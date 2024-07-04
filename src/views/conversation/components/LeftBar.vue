<template>
  <div>
    <div class="h-full flex flex-col">
      <n-button
        v-if="!hasNewConversation"
        class="mb-2"
        secondary
        strong
        type="primary"
        :disabled="props.loading"
        @click="emits('new-conversation')"
      >
        <template #icon>
          <n-icon class="">
            <Add />
          </n-icon>
        </template>
        {{ $t('commons.newConversation') }}
      </n-button>
      <n-menu
        ref="menuRef"
        v-model:value="convId"
        class="-mx-2"
        :content-style="{ backgroundColor: 'red' }"
        :disabled="props.loading"
        :options="menuOptions"
        :root-indent="18"
      />
      <!-- </n-scrollbar> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Add } from '@vicons/ionicons5';
import { MenuOption, NEllipsis } from 'naive-ui';
import { computed, h } from 'vue';
import { useI18n } from 'vue-i18n';

import ChatGPTAvatar from '@/components/ChatGPTAvatar.vue';
import { useConversationStore } from '@/store';
import { BaseConversationSchema } from '@/types/schema';
import { dropdownRenderer, popupChangeConversationTitleDialog } from '@/utils/renders';
import { Dialog, Message } from '@/utils/tips';

import StatusCard from './StatusCard.vue';

const { t } = useI18n();

const conversationStore = useConversationStore();

const props = defineProps<{
  loading: boolean;
  value: string | null;
  cs: Array<any>
}>();

const emits = defineEmits<{
  (e: 'update:value', value: string | null): void;
  (e: 'new-conversation'): void;
}>();

// get and set to bind convId and value
const convId = computed<string | null>({
  get() {
    return props.value;
  },
  set(value: string | null) {
    emits('update:value', value);
  },
});

const hasNewConversation = computed<boolean>(() => {
  return !!conversationStore.newConversation;
});

const menuOptions = computed<MenuOption[]>(() => {
  return props.cs.map( i => {
	  return  {
		  label: () => h(NEllipsis, null, { default: () => i.title || 'New chat' }),
		  key: i.id,
		  value: i.key ,
		  disabled: props.loading,
		  icon: () =>
			  h(ChatGPTAvatar, { model: 'plugins', size: 20, class: 'opacity-80' }, { default: () => null }),
	  }
  })
});

const handleDeleteConversation = (conversation_id: string | undefined) => {
  if (!conversation_id) return;
  const d = Dialog.info({
    title: t('commons.confirmDialogTitle'),
    content: t('tips.deleteConversation'),
    positiveText: t('commons.confirm'),
    negativeText: t('commons.cancel'),
    onPositiveClick: () => {
      d.loading = true;
      return new Promise((resolve) => {
        conversationStore
          .deleteConversation(conversation_id)
          .then(() => {
            Message.success(t('tips.deleteConversationSuccess'));
            if (convId.value == conversation_id) convId.value = null;
          })
          .catch(() => {
            Message.error(t('tips.deleteConversationFailed'));
          })
          .finally(() => {
            d.loading = false;
            resolve(true);
          });
      });
    },
  });
};

const handleChangeConversationTitle = (conversation_id: string | undefined) => {
  // if (!conversation_id) return;
  // popupChangeConversationTitleDialog(
  //   conversation_id,
  //   async (title: string) => {
  //     await conversationStore.changeConversationTitle(conversation_id, title);
  //   },
  //   () => {
  //     Message.success(t('tips.changeConversationTitleSuccess'));
  //   },
  //   () => {
  //     Message.error(t('tips.changeConversationTitleFailed'));
  //   }
  // );
};
</script>

<style>
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
