<template>
	<div class='model-dialog'>
		<div class="dialog-wrapper" ref="container">
			<div v-for="(item,idx) of dialog">
				<div class="dialog-me dialog" v-if="item.type === 0">
					<div class="content">{{ item.text }}</div>
					<div class="head">
						<img src="@/assets/user.png" alt="">
					</div>
				</div>
				<div class="dialog-ai dialog" v-if="item.type === 1">
					<div class="head">
						<img src="@/assets/ai.png" alt="">
					</div>
					<div class="content">
						<div class="mark-down">
							<Markdown :source="item.text" v-if="item.model !== 'dall-e-3' "/>
							<img :src="last.text" alt="" v-if="last.model === 'dall-e-3' ">
						</div>
						<div class="mark-footer">
							<div>
								以上内容为 AI 生成，不代表开发者立场，请勿删除或修改本标记
							</div>
							<div class="mark-down-icon">
								<!--								<div @click="refresh()">-->
								<!--									<img src="@/assets/refresh.png" alt="">-->
								<!--									<span>重新生成</span>-->
								<!--								</div>-->
								<div @click="copy(item)">
									<img src="@/assets/copy.png" alt="">
									<span>{{ item.model === 'dall-e-3' ? '下载' : '复制' }}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div v-if="!last.text">
				<div class="dialog-ai dialog" v-if="last.type === 1">
					<div class="head">
						<img src="@/assets/ai.png" alt="">
					</div>

					<div style="width: 36.458rem;margin-left: 0.521rem">
						<el-skeleton :rows="3" animated/>
					</div>
				</div>
			</div>

			<div v-if="last.text">
				<div class="dialog-me dialog" v-if="last.type === 0">
					<div class="content">{{ last.text }}</div>
					<div class="head">
						<img src="@/assets/user.png" alt="">
					</div>
				</div>
				<div class="dialog-ai dialog" v-if="last.type === 1">
					<div class="head">
						<img src="@/assets/ai.png" alt="">
					</div>
					<div class="content">
						<div class="mark-down">
							<Markdown :source="last.text" v-if="last.model !== 'dall-e-3' "/>
							<img :src="last.text" alt="" v-if="last.model === 'dall-e-3' ">
						</div>
						<div class="mark-footer">
							<div>
								以上内容为 AI 生成，不代表开发者立场，请勿删除或修改本标记
							</div>
							<div class="mark-down-icon">
								<!--								<div @click="refresh()" class="line">-->
								<!--									<img src="@/assets/refresh.png" alt="">-->
								<!--									<span>重新生成</span>-->
								<!--								</div>-->
								<div @click="copy(last)">
									<img src="@/assets/copy.png" alt="">
									<span>{{ last.model === 'dall-e-3' ? '下载' : '复制' }}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang='ts'>
import {nextTick, onBeforeUnmount, onMounted, reactive, ref, watch} from "vue";
import Markdown from 'vue3-markdown-it';
import {ElMessage} from 'element-plus'
import {Dialog, DialogType} from "@/util/dialog";
import {useStore} from 'vuex'
import {cloneDeep} from "lodash";


const store = useStore()
const dialog = ref([]);
// watch(store.state.dialogs, v => init(v) )
const init = (v: any) => {
	if (v.length) {
		if (last.dialog) last.dialog.stop()
		let l: Dialog;
		const print = v[v.length -1].type === DialogType.Ai
		if (print) {
			l = v.pop();
		}
		const arr: any[] = [...v]
		if (print) {
			last.type = l.type;
			last.model = l.model
			last.dialog = l;
			last.text = l.text
			l.on(s => {
				last.text = s;
				if (container.value) {
					container.value.scrollTop = container.value.scrollHeight;
				}
			})
		}
		dialog.value = arr
		nextTick(() => {
			if (container.value) {
				container.value.scrollTop = container.value.scrollHeight;
			}
		})
	} else {
		dialog.value = []
		last.type = null
		last.text = null
		last.dialog = null
		last.model = null
	}
}
const last = reactive({
	type: null,
	text: null,
	dialog: null,
	model: null,
});
const container = ref('')
const copy = (item: any): void => {
	if (item.model !== 'dall-e-3') {
		const textarea = document.createElement('textarea');
		textarea.value = item.text;
		document.body.appendChild(textarea);
		textarea.select();
		document.execCommand('copy');
		document.body.removeChild(textarea);
		ElMessage({
			message: '复制成功',
			type: 'success',
		})
	} else {
		window.open(item.text)
	}
}


defineExpose({init})
onMounted(() => {
})
onBeforeUnmount(() => {
})
</script>

<style lang="scss" scoped>
.show {
	display: block;
}

.hide {
	display: none;
}

.model-dialog {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	padding: 1.042rem 15%;
	overflow: hidden;

	& > .dialog-wrapper {
		width: 100%;
		height: 100%;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;

		&::-webkit-scrollbar {
			width: 6px;
			height: 6px;
		}

		&::-webkit-scrollbar-thumb {
			border-radius: 3px;
			-moz-border-radius: 3px;
			-webkit-border-radius: 3px;
			background-color: #5a6efc;
		}

		&::-webkit-scrollbar-track {
			background-color: transparent;
		}

		& > div {
			width: 100%;
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			align-items: flex-start;

			&:not(:last-child) {
				margin-bottom: 0.833rem;
			}

			& > .dialog {
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				align-items: flex-start;
				width: 90%;
			}

			& > .dialog-me {
				justify-content: flex-end;
				min-height: 2.604rem;

				& > .head {
					width: 1.5625rem;
					height: 1.5625rem;
					margin-top: 0.26rem;
					border-radius: 50%;
					background: #fff;

					& > img {
						display: block;
						width: 100%;
						height: auto;
					}
				}

				& > .content {
					min-height: 2.083rem;
					line-height: 2.083rem;
					margin-right: 0.521rem;
					background: #066BF7;
					border-radius: 1.042rem;
					padding: 0 1.042rem;
					color: #fff;
					font-size: 0.78125rem;
				}

			}

			& > .dialog-ai {
				justify-content: flex-start;
				min-height: 2.604rem;

				& > .head {
					width: 1.5625rem;
					height: 1.5625rem;
					margin-top: 0.26rem;
					border-radius: 50%;
					background: #fff;
					flex-shrink: 0;

					& > img {
						display: block;
						width: 100%;
					}
				}

				& > .content {
					min-height: 2.083rem;
					line-height: 2.083rem;
					margin-left: 0.521rem;
					border-radius: 20px;
					color: #333333;
					font-size: 0.78125rem;
					background: #EFF7FF;
					overflow: hidden;

					& > .mark-down {
						border-radius: 1.042rem;
						padding: 0.521rem 1.042rem;
						background: #fff;

						& > img {
							display: block;
							width: 100%;
							height: auto;
						}
					}

					& > .mark-footer {
						width: 100%;
						height: 40px;
						background: #EFF7FF;
						display: flex;
						padding: 0 1.042rem;
						box-sizing: border-box;
						flex-direction: row;
						justify-content: space-between;
						align-items: center;

						& > div:nth-of-type(1) {
							font-size: 0.625rem;
							color: #999999
						}

						& > .mark-down-icon {
							display: flex;
							flex-direction: row;
							justify-content: flex-end;
							align-items: center;
							margin-left: 5.208rem;

							& > div {
								display: flex;
								flex-direction: row;
								justify-content: center;
								align-items: center;
								cursor: pointer;
								transition: all .2s linear;
								opacity: 1;

								&:hover {
									opacity: 0.7;
								}

								& > img {
									display: block;
									width: 0.521rem;
									height: auto;
									margin-right: 0.417rem;
								}

								& > span {
									font-size: 0.677rem;
									color: #1A3FAA;
								}
							}
						}
					}
				}
			}
		}
	}
}

.line {
	margin-right: 1.042rem;
	position: relative;

	&::after {
		content: '';
		display: block;
		width: 1px;
		height: 0.521rem;
		position: absolute;
		right: -0.521rem;
		top: 50%;
		margin-top: -0.26rem;
		background: #D0D8DE;
	}
}
</style>
