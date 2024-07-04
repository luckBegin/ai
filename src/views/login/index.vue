<template>
	<!-- Login Form -->
	<div class="flex relative flex-col justify-center items-center w-full h-full">
		<div class="absolute top-4 right-4 space-x-3">
			<n-dropdown :options="languageOptions" placement="bottom-start">
				<n-button secondary circle>
					<n-icon :component="Language"/>
				</n-button>
			</n-dropdown>
			<n-button secondary circle @click="toggleTheme">
				<n-icon :component="themeIcon"/>
			</n-button>
		</div>
		<div class="mb-6">
			<!-- <CWSIcon :color="appStore.theme == 'dark' ? 'white': 'black'" class="w-60" /> -->
			<n-gradient-text :size="32" type="success" class="select-none">
				AI
			</n-gradient-text>
		</div>
		<n-card embedded class="w-90 p-6 m-6 rounded-lg">
			<n-form
				ref="formRef"
				class="space-y-2"
				:model="formValue"
				:show-label="false"
				:rules="loginRules"
				:wrapper-col="{ span: 16 }"
			>
				<n-form-item path="username">
					<n-input
						v-model:value="formValue.username"
						:placeholder="'手机号'"
					>
						<template #prefix>
							<n-icon>
								<PersonFilled/>
							</n-icon>
						</template>
					</n-input>
				</n-form-item>
				<n-form-item path="password">
					<n-input
						v-model:value="formValue.password"
						placeholder="验证码"
						:input-props="{
			              autoComplete: 'current-password',
			            }"
						@keyup.enter="login"
					>
					</n-input>
					<n-button class="h-8" type="primary" @click="sendCode" :disabled="codeBtn">
						发送验证码
					</n-button>
				</n-form-item>
			</n-form>
			<n-button class="w-full h-8" type="primary" :enabled="loading" @click="login">
				{{ $t('commons.login') }}
			</n-button>
		</n-card>
	</div>
</template>

<script setup lang="ts">
import {Language} from '@vicons/ionicons5';
import {DarkModeRound, LightModeRound, LockFilled, PersonFilled} from '@vicons/material';
import {FormInst} from 'naive-ui';
import {FormRules, FormValidationError} from 'naive-ui/es/form';
import {computed, reactive, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {useRouter} from 'vue-router';

import {getCode, LoginData, userLogin} from '@/api/user';
import CWSIcon from '@/components/icons/CWSIcon.vue';
import {useAppStore, useUserStore} from '@/store';
import {Message} from '@/utils/tips';

const router = useRouter();
const {t} = useI18n();
const userStore = useUserStore();
const appStore = useAppStore();

const formRef = ref<FormInst>();

const rememberPassword = computed({
	get: () => userStore.savedLoginForm.rememberPassword,
	set: (value) => {
		userStore.savedLoginForm.rememberPassword = value;
		if (!value) {
			userStore.savedLoginForm.savedUsername = '';
			userStore.savedLoginForm.savedPassword = '';
		}
	},
});

const themeIcon = computed(() => {
	if (appStore.theme == 'dark') {
		return DarkModeRound;
	} else {
		return LightModeRound;
	}
});

const toggleTheme = () => {
	appStore.toggleTheme();
};

const formValue = reactive({
	username: userStore.savedLoginForm.savedUsername || '',
	password: userStore.savedLoginForm.savedPassword || '',
});

const loading = ref(false);
const checkCode = ref("adq9z0Ex8taTsEk9J8efwNE0USBCG0%2f1MHOfBzx0hKI%3d")
const loginRules = {
	username: {required: true, message: '请输入手机号'},
	password: {required: true, message: '请输入验证码'},
} as FormRules;

const codeBtn = ref(false)
const sendCode = async () => {
	if( !formValue.username ) {
		return 	Message.error('请输入手机号');
	}
	codeBtn.value = true
	Message.success('发送成功');
	const r  = await getCode({mobile: formValue.username})
	if( r.data.code ==='-1' ) {
		Message.error(r.data.msg )
	} else {
		checkCode.value = r.data.data.checkCode ;
	}
	codeBtn.value = false ;
}
const login = async () => {
	if( !checkCode.value ) {
		return 	Message.error('请先发送验证码');
	}
	if (loading.value) return;
	formRef.value
		?.validate((errors?: Array<FormValidationError>) => {
			if (!errors) {
				loading.value = true;
			}
		})
		.then(async () => {
			const result = await userLogin({
				"userName": formValue.username,
				"code": formValue.password,
				"checkCode": checkCode.value
			})
			if( result.data.code === '-1') {
				return Message.error(result.data.msg)
			} else {
				sessionStorage.setItem('login', JSON.stringify(result.data.data))
				router.push('/conversation')
			}
		});
};

const languageOptions = [
	{
		label: '简体中文',
		key: 'zh-CN',
		props: {
			onClick: () => {
				appStore.setLanguage('zh-CN');
			},
		},
	},
	{
		label: 'Bahasa Melayu',
		key: 'ms-MY',
		props: {
			onClick: () => {
				appStore.setLanguage('ms-MY');
			},
		},
	},
	{
		label: 'English',
		key: 'en-US',
		props: {
			onClick: () => {
				appStore.setLanguage('en-US');
			},
		},
	},
];

if (userStore.user) {
	router.push({name: 'conversation'});
}
</script>

<style scoped>
@keyframes blink {
	0%,
	100% {
		opacity: 0;
	}
	50% {
		opacity: 1;
	}
}

.blink {
	animation: blink 1s ease-in-out infinite;
}
</style>
