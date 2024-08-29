<template>
	<div class="dialog-wrapper">
		<div class="dialog-left">
			<div class="dialog-left-top">
				<div class="head"></div>
				<div class="image-icon">
					<img src="@/assets/1.png" alt="">
				</div>
				<div class="image-icon">
					<img src="@/assets/2.png" alt="">
				</div>
				<div class="image-icon">
					<img src="@/assets/3.png" alt="">
				</div>
				<div class="image-icon">
					<img src="@/assets/4.png" alt="">
				</div>
			</div>
			<div class="dialog-left-bottom">
				<div class="image-icon">
					<img src="@/assets/menu.png" alt="">
				</div>
			</div>
		</div>
		<div class="dialog-right">
			<div class="content-wrapper">
				<div class="content-left">
					<div class="content-new">
						<img src="@/assets/dialog-new.png" alt="">
					</div>

					<div class="recent-dialog">
						<div class="title">
							最近3天
						</div>
						<div class="list">
							<div class="list-item">
								<span>asdasdasd</span>
								<img src="@/assets/del.png" alt="">
							</div>
							<div class="list-item">
								<span>asdasdasd</span>
								<img src="@/assets/del.png" alt="">
							</div>
						</div>
					</div>

					<div class="recent-dialog" style="margin-top: 1.667rem">
						<div class="title">
							最近7天
						</div>
						<div class="list">
							<div class="list-item">
								<span>asdasdasd</span>
								<img src="@/assets/del.png" alt="">
							</div>
							<div class="list-item">
								<span>asdasdasd</span>
								<img src="@/assets/del.png" alt="">
							</div>
						</div>
					</div>
				</div>
				<div class="content-right">
					<div class="top">
						<model-selector/>
					</div>
					<div class="middle">
<!--						<model-empty />-->
						<model-dialog />
					</div>
					<div class="bottom">
						<model-footer />
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
			}

			& > .image-icon {
				width: 30px;
				height: 30px;
				margin-top: 32px;

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

					& > .title {
						color: #fff;
						margin-bottom: 0.625rem;
					}

					& > .list {
						display: flex;
						flex-direction: column;
						justify-content: flex-start;
						align-items: center;

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
								display: flex;
								flex-direction: row;
								justify-content: flex-start;
								flex: 1;
								align-items: center;
								box-sizing: border-box;
								margin-right: 16px;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
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
					width: 100% ;
				}
				& > .middle {
					flex: 1;
					width: 100%;
				}
			}
		}
	}
}
</style>
