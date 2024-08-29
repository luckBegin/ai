<template>
	<div class="model-empty">
		<div class="title">
			<span>用户, 你好</span>
			<span>今天需要我做什么？</span>
		</div>

		<div class="section-block">
			<div class="section-block-item">
				<span>商店标语</span>
				<div class="section-icon">
					<img src="@/assets/i-1.png" alt="">
				</div>
			</div>
			<div class="section-block-item">
				<span>我的小说人物构思</span>
				<div class="section-icon">
					<img src="@/assets/i-2.png" alt="">
				</div>
			</div>
			<div class="section-block-item">
				<span>复杂的谜语</span>
				<div class="section-icon">
					<img src="@/assets/i-3.png" alt="">
				</div>
			</div>
			<div class="section-block-item">
				<span>抽查测验</span>
				<div class="section-icon">
					<img src="@/assets/i-4.png" alt="">
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
onMounted(() => {
})

onBeforeUnmount(() => {
})
</script>

<style lang="scss" scoped>
.model-empty {
	width: 100% ;
	height: 100% ;
	box-sizing: border-box;
	padding: 1.042rem 15%;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-start;
	& > .title {
		font-size: 1.09375rem;
		margin-bottom: 1.667rem;
		& > span {
			display: block;
			color: rgb(51, 51, 51);
			&:nth-of-type(1) {
				font-weight: bolder;
			}
			&:nth-of-type(2) {
				margin-top:0.417rem;
			}
		}
	}

	& > .section-block {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;

		& > .section-block-item {
			width: 8.958rem;
			height: 9.375rem;
			padding: 1.042rem;
			font-size: 0.729rem;
			font-weight: bold;
			box-sizing: border-box;
			border: 1px solid rgb(208, 216, 222);
			border-radius: 1.5625rem;
			background: rgb(255, 255, 255);
			margin-right: 0.833rem;
			position: relative;
			overflow: hidden;
			& > .section-icon {
				position: absolute;
				bottom: 0;
				right: 0;
				width: 3.125rem;
				height: 3.125rem;
				box-sizing: border-box;
				border: 1px solid rgb(186, 211, 233);
				border-radius: 1.042rem 0 1.042rem 0;
				padding: 0.78125rem;
				background: rgb(222, 239, 255);
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				& > img {
					display: block;
					width: 70% ;
					height: auto;
				}
			}
		}
	}
}
</style>
