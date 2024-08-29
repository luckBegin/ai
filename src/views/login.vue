<template>
	<div class="login-wrapper">
		<bg-component/>
		<div class='content-wrapper'>
			<div class="content-wrapper-left">

			</div>

			<div class="content-wrapper-right">
				<div class="right-wrapper">
					<div class='title'>
						<span>验证码登陆</span>
					</div>
					<div class="form">
						<div>
							<input type="tel" placeholder="请输入手机号码">
						</div>
						<div>
							<input type="tel" placeholder="请输入验证码">
							<div class = 'send-code'>获取验证码</div>
						</div>
					</div>
					<div class="user-guide">
						<el-checkbox v-model="userGuide"/>
						<span>我已阅读</span>
						<span class="user-guide-tip">用户手册</span>
						<span>和</span>
						<span class="user-guide-tip">隐私政策</span>
					</div>

					<div class="login-btn">
						<img :src="loginImg" alt="">
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import bgComponent from '@/components/bg.vue'
import {ref} from "vue";
import loginImage from '@/assets/btn-login.png'

const loginImg = ref(loginImage)
const userGuide = ref(false);

</script>

<style lang="scss" scoped>
@import "@/style.scss";

.login-wrapper {
	width: 100%;
	height: 100%;
	position: relative;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
}

.content-wrapper {
	width: 50%;
	height: 64%;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	border-radius: 1.042rem;
	overflow: hidden;

	& > .content-wrapper-left {
		width: 37%;
		height: 100%;
		background: url("@/assets/card.png") round;
	}

	& > .content-wrapper-right {
		width: 63%;
		height: 100%;
		position: relative;

		& > .right-wrapper {
			position: absolute;
			left: -10%;
			top: 0;
			width: 100%;
			height: 100%;
			padding: 10%;
			background: #fff;
			box-sizing: border-box;

			& > .title {
				font-size: 1rem;
				color: $blue;
				font-weight: bolder;
				padding-bottom: 0.521rem;
				border-bottom: 1px solid $light-blue;
				margin-bottom: 3.229rem;

				& > span {
					display: inline-block;
					position: relative;

					&::after {
						display: block;
						content: '';
						width: 100%;
						height: 3px;
						position: absolute;
						left: 0;
						bottom: calc(-0.521rem - 3px);
						background: $blue;
					}
				}
			}

			& > .form {
				& > div {
					width: 100%;
					height: 3.646rem;
					line-height: 3.646rem;
					position: relative;

					&:nth-of-type(2) {
						margin-top: 1.667rem ;
					}

					& > input {
						width: 100%;
						height: 100%;
						box-sizing: border-box;
						padding-left: 1.5625rem;
						border-radius: 3.646rem;
						border: 1px solid $light-blue;
						font-size: 0.78125rem;
						outline: none;
					}

					& > .send-code {
						height: 100% ;
						position: absolute;
						right: 0;
						top:0;
						z-index: 2 ;
						background: #DEEFFF ;
						border: 1px solid $light-blue;
						box-sizing: border-box;
						color: #333333 ;
						font-size: 0.78125rem;
						padding: 0 2.083rem;
						border-radius: 3.646rem;
						cursor: pointer;
					}
				}
			}

			& > .user-guide {
				width: 100%;
				padding-left: 1.042rem;
				margin-top: 0.9375rem;
				box-sizing: border-box;

				&::v-deep(.el-checkbox__inner) {
					border-radius: 50%;
				}

				& > span {
					font-size: 0.78125rem;
					color: $gray;

					&:nth-of-type(1) {
						margin-left: 0.417rem;
					}
				}

				& > .user-guide-tip {
					color: $sky-blue
				}
			}

			& > .login-btn {
				width: 100%;
				margin-top: 4.271rem;
				transition: all .2s linear ;
				opacity: 1;
				cursor: pointer;
				&:hover {
					opacity: .8 ;
				}
				& > img {
					display: block;
					width: 100%;
					height: auto;
				}
			}
		}
	}
}
</style>
