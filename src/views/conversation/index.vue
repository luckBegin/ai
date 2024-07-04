<template>
	<n-layout
		ref="rootRef"
		has-sider
		:class="['h-full', !appStore.preference.widerConversationPage ? 'lg:w-screen-lg lg:mx-auto' : '']"
	>
		<!-- 左栏 -->
		<n-layout-sider
			v-model:collapsed="foldLeftBar"
			:native-scrollbar="false"
			:collapsed-width="0"
			collapse-mode="transform"
			trigger-style="top: 27px; right: -26px;"
			collapsed-trigger-style="top: 27px; right: -26px;"
			bordered
			show-trigger="arrow-circle"
			:width="280"
			class="h-full"
		>
			<LeftBar
				v-model:value="currentConversationId"
				:class="['h-full pt-4 px-4 box-border mb-4 overflow-hidden flex flex-col space-y-4']"
				:loading="loadingAsk"
				:cs="conversations"
				@new-conversation="makeNewConversation"
			/>
		</n-layout-sider>
		<!-- 右栏 -->
		<n-layout-content embeded :class="['flex flex-col overflow-hidden', gtmd() ? '' : 'min-w-100vw']">
			<div class="h-full relative flex flex-col">
				<!-- 消息记录内容（用于全屏展示） -->
				<n-scrollbar
					v-if="currentConversationId"
					ref="historyRef"
					class="relative"
					:content-style="loadingHistory ? { height: '100%' } : {}"
				>
					<!-- 回到底部按钮 -->
					<div class="right-3 bottom-3 absolute z-20">
						<n-button secondary circle size="small" @click="scrollToBottomSmooth">
							<template #icon>
								<n-icon :component="ArrowDown"/>
							</template>
						</n-button>
					</div>
					<HistoryContent
						ref="historyContentRef"
						v-model:can-continue="canContinue"
						:conversation-id="currentConversationId"
						:cs="conversations"
						:extra-messages="currentActiveMessages"
						:fullscreen="false"
						:show-tips="showFullscreenTips"
						:loading="loadingHistory"
					/>
					<div class="h-14"/>
				</n-scrollbar>
				<!-- 未选中对话（空界面） -->
				<div
					v-else-if="!currentConversationId"
					class="flex-grow flex flex-col justify-center"
					:style="{ backgroundColor: themeVars.cardColor }"
				>
					<n-empty v-if="!currentConversation" :description="$t('tips.loadConversation')">
						<template #icon>
							<n-icon>
								<ChatboxEllipses/>
							</n-icon>
						</template>
						<template #extra>
							<n-button secondary @click="makeNewConversation">
								{{ $t('tips.newConversation') }}
							</n-button>
						</template>
					</n-empty>
				</div>
				<!-- 下半部分（回复区域） -->
				<InputRegion
					v-model:input-value="inputValue"
					v-model:auto-scrolling="autoScrolling"
					class="sticky bottom-0 z-10"
					:can-abort="canAbort"
					:can-continue="!loadingAsk && canContinue"
					:send-disabled="sendDisabled"
					:upload-mode="uploadMode"
					:upload-disabled="loadingAsk"
					@abort-request="abortRequest"
					@continue-generating="continueGenerating"
					@export-to-markdown-file="exportToMarkdownFile"
					@export-to-pdf-file="exportToPdfFile"
					@send-msg="sendMsg"
					@show-fullscreen-history="showFullscreenHistory"
				/>
			</div>
		</n-layout-content>
	</n-layout>
</template>

<script setup lang="ts">
import {ArrowDown, ChatboxEllipses} from '@vicons/ionicons5';
import {useStorage} from '@vueuse/core';
import {NButton, NIcon, useThemeVars} from 'naive-ui';
import {computed, ref, watch} from 'vue';
import {useI18n} from 'vue-i18n';

import {getArkoseInfo} from '@/api/arkose';
import {getAskWebsocketApiUrl} from '@/api/chat';
import {generateConversationTitleApi, setConversationTitleApi} from '@/api/conv';
import {useAppStore, useConversationStore, useFileStore, useUserStore} from '@/store';
import {NewConversationInfo} from '@/types/custom';
import {
	AskRequest,
	AskResponse,
	BaseChatMessage,
	BaseConversationHistory,
	BaseConversationSchema,
	OpenaiWebChatMessageMetadataAttachment,
	OpenaiWebChatMessageMultimodalTextContentImagePart,
} from '@/types/schema';
import {getArkoseToken} from '@/utils/arkose';
import {screenWidthGreaterThan} from '@/utils/media';
import {popupNewConversationDialog} from '@/utils/renders';
// import { popupNewConversationDialog } from '@/utils/renders';
import {Dialog, LoadingBar, Message} from '@/utils/tips';
import HistoryContent from '@/views/conversation/components/HistoryContent.vue';
import InputRegion from '@/views/conversation/components/InputRegion.vue';
import LeftBar from '@/views/conversation/components/LeftBar.vue';

import {saveAsMarkdown} from './utils/export';
import {buildTemporaryMessage, modifiyTemporaryMessageContent} from './utils/message';
import {sendMsga} from "@/api/user";

const themeVars = useThemeVars();

const {t} = useI18n();

const gtmd = screenWidthGreaterThan('md');

const rootRef = ref();
const historyRef = ref();
const userStore = useUserStore();
const appStore = useAppStore();
const fileStore = useFileStore();
const conversationStore = useConversationStore();

const loadingAsk = ref(false);
const loadingHistory = ref<boolean>(false);
const autoScrolling = useStorage('autoScrolling', true);

const isAborted = ref<boolean>(false);
const canAbort = ref<boolean>(false);
const canContinue = ref<boolean>(false);
const foldLeftBar = useStorage('foldLeftBar', false);
let aborter: (() => void) | null = null;

const hasNewConversation = ref<boolean>(false);
const currentConversationId = ref<string | null>(null);
const isCurrentNewConversation = computed<boolean>(() => {
	// return currentConversationId.value === conversationStore.newConversation?.conversation_id;
	return currentConversationId.value?.startsWith('new_conversation') || false;
});
const currentConversation = computed<BaseConversationSchema | null>(() => {
	if (isCurrentNewConversation.value) return conversationStore.newConversation;
	const conv = conversationStore.conversations?.find((conversation: BaseConversationSchema) => {
		return conversation.conversation_id == currentConversationId.value;
	});
	return conv || null;
});
const currentConvHistory = computed<BaseConversationHistory | null>(() => {
	if (!currentConversationId.value) return null;
	return conversationStore.conversationHistoryMap[currentConversationId.value] || null;
});

const inputValue = ref('');
const currentSendMessage = ref<BaseChatMessage | null>(null);
const currentRecvMessages = ref<BaseChatMessage[]>([]);

const uploadMode = computed(() => {
	const disableUploading = userStore.userInfo?.setting.openai_web.disable_uploading;
	if (disableUploading) return null;
	if (
		currentConversation.value?.source === 'openai_web' &&
		currentConversation.value.current_model == 'gpt_4_code_interpreter'
	)
		return 'legacy_code_interpreter';
	else if (currentConversation.value?.source === 'openai_web' && currentConversation.value.current_model == 'gpt_4')
		return 'all';
	else return null;
});

// 实际的 currentMessageList，加上当前正在发送的消息
const currentActiveMessages = computed<Array<BaseChatMessage>>(() => {
	const result: BaseChatMessage[] = [];
	if (currentSendMessage.value) result.push(currentSendMessage.value);
	for (const msg of currentRecvMessages.value) {
		result.push(msg);
	}
	// console.log('currentActiveMessages', currentActiveMessages.value, currentRecvMessages.value);
	return result;
});

watch(currentConversationId, (newVal, _oldVal) => {
	if (newVal != 'new_conversation') {
		handleChangeConversation(newVal);
	}
});

const handleChangeConversation = (key: string | null) => {
	// // TODO: 清除当前已询问、得到回复，但是发生错误的两条消息
	// if (loadingAsk.value || !key) return;
	// loadingAsk.value = true;
	// loadingHistory.value = true;
	// LoadingBar.start();
	// conversationStore
	// 	.fetchConversationHistory(key)
	// 	.then(() => {
	// 		// console.log(conversationStore.conversationDetailMap);
	// 	})
	// 	.catch((err: any) => {
	// 		console.log(err);
	// 	})
	// 	.finally(() => {
	// 		loadingAsk.value = false;
	// 		loadingHistory.value = false;
	// 		LoadingBar.finish();
	// 	});
};

const sendDisabled = computed(() => {
	return (
		loadingAsk.value ||
		currentConversationId.value == null ||
		inputValue.value === null ||
		inputValue.value.trim() == ''
	);
});

const conversations: any = ref([]);
const makeNewConversation = () => {
	if (hasNewConversation.value) return;
	popupNewConversationDialog(async (newConversationInfo: NewConversationInfo) => {
		const result = await sendMsga({
			"conversationId": "",
			"content": newConversationInfo.title,
			"modeType": newConversationInfo.model,
			"messages": ""
		})
		if (result.data.code !== '1') {
			const r = result.data.data;
			const id = r.conversationId;
			const messages = r.messages
			conversations.value.push({...newConversationInfo, id, messages})
			currentConversationId.value = id
		} else {
			Message.error('接口异常');
		}
	});
};

const abortRequest = () => {
	if (aborter == null || !canAbort.value) return;
	aborter();
	aborter = null;
};

const continueGenerating = () => {
	inputValue.value = ':continue';
	sendMsg();
};

const scrollToBottom = () => {
	historyRef.value.scrollTo({left: 0, top: historyRef.value.$refs.scrollbarInstRef.contentRef.scrollHeight});
};

const scrollToBottomSmooth = () => {
	historyRef.value.scrollTo({
		left: 0,
		top: historyRef.value.$refs.scrollbarInstRef.contentRef.scrollHeight,
		behavior: 'smooth',
	});
};

const sendMsg = async () => {
	if (sendDisabled.value || loadingAsk.value) {
		return;
	}
	// const model =conversations.value.find( i => i.id === currentConversationId.value ) ;
	// debugger
	// await sendMsga({
	// 	"conversationId": "string",
	// 	"content": "string",
	// 	"modeType": "string",
	// 	"messages": "string"
	// })
};

const exportToMarkdownFile = () => {
	if (!currentConversation.value) {
		Message.error(t('tips.pleaseSelectConversation'));
		return;
	}
	saveAsMarkdown(currentConvHistory.value!);
};

const historyContentRef = ref();
const showFullscreenTips = ref(false);

const showFullscreenHistory = () => {
	if (!currentConversation.value) {
		Message.error(t('tips.pleaseSelectConversation'));
		return;
	}
	// focus historyContentRef
	historyContentRef.value.focus();
	historyContentRef.value.toggleFullscreenHistory(true);
};

const exportToPdfFile = () => {
	if (!currentConversation.value) {
		Message.error(t('tips.pleaseSelectConversation'));
		return;
	}
	historyContentRef.value.toggleFullscreenHistory(false);
	window.print();
	historyContentRef.value.toggleFullscreenHistory(false);
};

// 加载对话列表
// conversationStore.fetchAllConversations().then();
</script>

<style>
textarea.n-input__textarea-el {
	resize: none;
}

div.n-menu-item-content-header {
	display: flex;
	justify-content: space-between;
}

span.n-menu-item-content-header__extra {
	display: inline-block;
}

.left-col .n-card__content {
	@apply flex flex-col overflow-auto !important;
}

@media print {
	body * {
		visibility: hidden;
	}

	#print-content * {
		visibility: visible;
	}

	/* no margin in page */
	@page {
		margin-left: 0;
		margin-right: 0;
	}
}
</style>
