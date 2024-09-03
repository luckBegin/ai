<template>
	<div class="model-footer-wrapper">
		<div class='area-input'>
			<el-input
				class="text-input"
				v-model="text"
				size="large"
				style="width: 100%"
				:autosize="{maxRows:5,minRows: 1}"
				type="textarea"
				placeholder="输入你要问的问题"
				@keypress.enter="confirm($event)"
			/>
			<img src="@/assets/submit.png" class='text-btn' @click='submit()'
				 :style="{ cursor: submitBtn.c }"
				 :class="{'gray': !submitBtn.o }"
			>
		</div>
		<div class='text-footer'>
			<div class="text-footer-icon">
				<img src="@/assets/light.png" alt="">
				<span>不会写提示词，帮帮我</span>
			</div>
			<div class="text-footer-text">
				小小书童显示的信息（包括与人相关的信息）不一定准确，请注意核查
			</div>
		</div>
	</div>
</template>

<script setup lang='ts'>
import {ref, computed, onMounted, onBeforeUnmount} from "vue";

const emits = defineEmits(['update']);
const text = ref('')
const submitBtn = computed(() => {
	return {
		o: text.value.length !== 0,
		c: text.value.length !== 0 ? 'pointer' : 'not-allowed'
	}
})

const submit = () => {
	emits('update', text.value)
	text.value = ''
}

const confirm = ($event: KeyboardEvent) => {
	if( $event.shiftKey ) {
		if( text.value.length === 0 ) {
			$event.preventDefault()
		}
	} else {
		$event.preventDefault();
		if (text.value) submit()
	}

}
onMounted(() => {
})

onBeforeUnmount(() => {
})
</script>

<style lang="scss" scoped>
.gray {
	filter: grayscale(100%) !important;
}
.model-footer-wrapper {
	width: 100%;
	box-sizing: border-box;
	padding: 1.042rem 15%;

	& > .area-input {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: flex-end;
		position: relative;
		& > .text-input:deep(.el-textarea__inner) {
			&::-webkit-scrollbar {
				width: 6px;
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
		}

		& > .text-input:deep(textarea) {
			width: 100%;
			border-radius: 2.083rem;
			line-height: 1.927rem;
			padding-left: 2.604rem;
			padding-right: 3.125rem;
			border: none;
			font-size: 0.729rem;
			background: linear-gradient(180.00deg, rgb(255, 255, 255), rgba(255, 255, 255, 0.5) 100%);
			box-shadow: 0.26rem 0.26rem 1.042rem 0 rgba(48, 108, 233, 0.2);
			resize: none;
			outline: none;
		}


		& > .submit-disable {
			opacity: 0.4;
		}

		& > .text-btn {
			width: 2.083rem;
			height: 2.083rem;
			display: block;
			margin-left: 0.9375rem;
			-webkit-filter: drop-shadow(10px 10px 10px rgba(0, 0, 0, .25));
			cursor: pointer;
			transition: all .2s linear;
			opacity: 1;
			position: absolute;
			right: 1.042rem ;
			bottom: 0.15625rem;
		}
	}

	& > .text-footer {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		font-size: 0.833rem;
		margin-top: 0.78125rem;
		margin-right: 4.167rem;

		& > .text-footer-icon {
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: center;
			box-sizing: border-box;
			padding: 0 0.78125rem;

			& > img {
				display: block;
				width: 0.625rem;
				height: 0.833rem;
				margin-right: 0.521rem;
			}
		}

		& > .text-footer-text {
			color: #999999
		}
	}

}


</style>
