<template>
	<div class="dialog-wrapper">
		<div class="dialog-left">
			<div class="dialog-left-top">
				<div class="head">
					<img src="@/assets/ai.png" alt="">
				</div>
				<div class="image-icon" @click="switchType(1)"
					 :class="{'image-icon-active': 1 === type }"
				>
					<img src="@/assets/1.png" v-if='type !== 1'>
					<img src="@/assets/1-active.png" v-if='type === 1'>
				</div>
				<!--				<div class="image-icon">-->
				<!--					<img src="@/assets/2.png" alt="">-->
				<!--				</div>-->
				<!--				<div class="image-icon">-->
				<!--					<img src="@/assets/3.png" alt="">-->
				<!--				</div>-->
				<div class="image-icon" @click="switchType(2)"
					 :class="{'image-icon-active': 2 === type }"
				>
					<img src="@/assets/4.png" alt=""  v-if='type !== 2'>
					<img src="@/assets/4-active.png" alt=""  v-if='type === 2'>
				</div>
			</div>
			<!--			<div class="dialog-left-bottom">-->
			<!--				<div class="image-icon">-->
			<!--					<img src="@/assets/menu.png" alt="">-->
			<!--				</div>-->
			<!--			</div>-->
		</div>
		<div class="dialog-right">
			<div class="content-wrapper">
				<div class="content-left">
					<div class="content-new" @click="newDialog()">
						<img src="@/assets/dialog-new.png" alt="">
					</div>

					<div class="recent-dialog">
						<div class="title">
							历史记录
						</div>
						<div class="list">
							<div class="list-item" v-for="item in historyList"
								 :class="{'list-item-active': current.id === item.id }"
								 @click="conversation(item)"
							>
								<span>{{ item.title }}</span>
								<!--<img src="@/assets/del.png" alt="">-->
							</div>
						</div>
					</div>
				</div>
				<div class="content-right">
					<div class="top">
						<model-selector :data="models" :value="modelSelect"
										@update="modelChange($event)"
						/>
					</div>
					<div class="middle">
						<model-empty v-if="!conversationDetail.model"/>
						<model-dialog v-if="conversationDetail.model"
									  :conversation="conversationDetail"
									  ref="con"
						/>
					</div>
					<div class="bottom">
						<model-footer @update="update($event)"/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import modelSelector from './component/model-selector.vue'
import modelFooter from './component/model-footer.vue'
import modelEmpty from './component/model-empty.vue'
import ModelDialog from "@/views/component/model-dialog.vue";
import {nextTick, onMounted, ref} from 'vue'
import {service} from "@/util/api";

const ai = [ {
	"label": "ChatGPT-3.5turbo",
	"value": "gpt-3.5-turbo",
	"desc":"日常任务推荐使用，扣费低"
}, {
	"label": "ChatGPT-4o",
	"value": "gpt-4o",
	"desc":"推荐难度高任务使用，处理效果更为准确。扣费高"
}]

const image = [{
	"label": "图片dall-e-3模型",
	"value": "dall-e-3"
}]
const models = ref(ai)
const type = ref(1);
const modelSelect = ref('')


const switchType = (t: number) => {
	if (type.value === t) return
	if (t === 1) {
		models.value = ai
	} else {
		models.value = image
	}
	type.value = t
	newDialog()
}

const query = {
	pageIndex: 1,
	pageSize: 500
}
const historyList = ref([])

const conversationDetail = ref({})
const getList = () => {
	service.historys({data: query})
		.then((r: any) => {
			if (r.code === '1') {
				historyList.value = r.data.list
			}
		})
}
const emits = defineEmits(['update']);
const current = ref({})
const conversation = (item: any) => {
	current.value = item;
	service.conversation({data: {id: item.id}})
		.then((r: any) => {
			const d = r.data;
			const dialog = JSON.parse(d.chatRequst);
			conversationDetail.value = {
				id: item.id,
				model: d.model,
				dialog: dialog.filter((v: any) => v.role !== 'system'),
				raw: d.chatRequst
			}
			modelSelect.value = d.model
			nextTick(() => {
				con.value.init(conversationDetail.value, false)
			})
		})

	emits('update', item)
}
const modelChange = (e: any) => {
	aiModel.value = e.value;
}
const aiModel = ref('gpt-3.5-turbo')
const con = ref(null)
const update = (s: string) => {
	const data = {
		"conversationId": "",
		"content": s,
		"modeType": aiModel.value,
		"messages": ""
	}

	if (conversationDetail.value.id) {
		data.conversationId = conversationDetail.value.id
		data.content = s
		data.modeType = aiModel.value
		data.messages = conversationDetail.value.raw;
	}

	service.sendMsg({data}).then((r: any) => {
		if (r.code === '1') {
			const data = {
				id: r.data.conversationId,
				model: aiModel.value,
				title: s
			}

			if (!conversationDetail.value.id) {
				historyList.value.unshift(data)
			}

			current.value = data
			const dialog = JSON.parse(r.data.messages);
			conversationDetail.value = {
				id: data.id,
				model: data.model,
				dialog: dialog.filter((v: any) => v.role !== 'system'),
				raw: r.data.messages
			}

			nextTick(() => {
				con.value.init(conversationDetail.value, true)
			})
		}
	})
}

const newDialog = () => {
	current.value = {}
	conversationDetail.value = {}
	aiModel.value = 'gpt-3.5-turbo'
	modelSelect.value = ''
}
onMounted(() => {
	getList()
})
</script>

<style lang="scss" scoped>
@import "@/style.scss";

.dialog-wrapper {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: flex-start;
	background: url("@/assets/bg.png") round;
	& > .dialog-left {
		width: 5.208rem;
		height: 100%;
		padding: 2.083rem 0.521rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;

		& > .dialog-left-top,
		& > .dialog-left-bottom {
			width: 100px;
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			align-items: center;

			& > .head {
				width: 2.604rem;
				height: 2.604rem;
				box-sizing: border-box;
				border: 1px solid rgb(255, 255, 255);
				border-radius: 50%;
				box-shadow: 5px 5px 20px 0 rgba(48, 108, 233, 0.5);

				& > img {
					display: block;
					width: 100%;
					height: auto;
				}
			}

			& > .image-icon-active {
				transform: scale(1.2);
			}

			& > .image-icon {
				width: 1.5625rem;
				height: 1.5625rem;
				margin-top: 1.667rem;
				cursor: pointer;
				transition: all .2s linear;
				&:hover {
					transform: scale(1.2);
				}
				& > img {
					display: block;
					width: 100%;
					height: auto;
				}
			}
		}

		& > .dialog-left-bottom {
			justify-content: flex-end;
		}
	}

	& > .dialog-right {
		flex: 1;
		height: 100%;
		padding: 1.042rem 1.042rem 1.042rem 0;
		box-sizing: border-box;

		& > .content-wrapper {
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.1);
			border-radius: 1.042rem;
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: flex-start;
			overflow: hidden;

			& > .content-left {
				width: 15.625rem;
				height: 100%;
				box-sizing: border-box;
				padding: 2.083rem 0;
				display: flex;
				flex-direction: column;
				justify-content: flex-start;
				align-items: center;

				& > .content-new {
					width: 90%;
					margin-bottom: 0.9375rem;

					& > img {
						display: block;
						width: 100%;
						height: auto;
						cursor: pointer;
						transition: all .2s linear;

						&:hover {
							opacity: 0.8;
						}
					}
				}

				& > .recent-dialog {
					width: 90%;
					box-sizing: border-box;
					padding: 0 1.5625rem;
					font-size: 0.9375rem;
					overflow-y: auto;

					&::-webkit-scrollbar {
						width: 2px;
						height: 6px;
					}

					&::-webkit-scrollbar-thumb {
						border-radius: 3px;
						-moz-border-radius: 3px;
						-webkit-border-radius: 3px;
						background-color: #c3c3c3;
					}

					&::-webkit-scrollbar-track {
						background-color: transparent;
					}

					& > .title {
						color: #fff;
						margin-bottom: 0.625rem;
					}

					& > .list {
						display: flex;
						flex-direction: column;
						justify-content: flex-start;
						align-items: center;
						height: 100%;
						width: 100%;


						& > .list-item-active {
							opacity: 0.5 !important;
						}

						& > .list-item {
							width: 100%;
							padding: 10px 20px;
							border-radius: 30px;
							background: rgba(255, 255, 255, 0.2);
							color: #fff;
							display: flex;
							flex-direction: row;
							justify-content: space-between;
							align-items: center;
							transition: all .2s linear;
							cursor: pointer;

							& > span {
								align-items: center;
								box-sizing: border-box;
								margin-right: 0.833rem;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
								display: inline-block;
							}

							&:not(:last-child) {
								margin-bottom: 18px;
							}

							&:hover {
								opacity: 0.8;
							}
						}
					}
				}
			}


			& > .content-right {
				flex: 1;
				height: 100%;
				border-radius: 1.042rem 0 0 1.042rem;
				background: rgba(222, 239, 255, 0.6);
				backdrop-filter: blur(5px);
				display: flex;
				flex-direction: column;
				justify-content: flex-start;
				align-items: flex-start;

				& > .top,
				& > .bottom {
					width: 100%;
				}

				& > .middle {
					flex: 1;
					width: 100%;
					overflow: hidden;
				}
			}
		}
	}
}
</style>
