<template>
	<div class="model-select-wrapper">
		<el-select style="width: 10.417rem;" size="large" class="model-select"
				   placeholder="请选择模型"
				   v-model="data"
				   @change="modelChange()"
				   :disabled="!!props.value"

		>
			<template #label="{ label, value }">
				<span style="font-weight: bold">{{ findName(label) }}</span>
			</template>
			<el-option
				v-for="d in props.data"
				:key="d.name"
				:value="d.value"
				:class="{'option-wrapper' : !d.desc }"
			>
				<div v-if='d.desc' class='desc-wrapper'>
					<div :class="{ 'circle-active': d.value === data }"></div>
					<div>
						<span>{{ d.label }}</span>
						<span>{{ d.desc }}</span>
					</div>
				</div>
			</el-option>
		</el-select>
	</div>
</template>

<script setup lang='ts'>
import {ref, reactive, onMounted, onBeforeUnmount, watch} from "vue";

const props = defineProps(['data', 'value']);
const data = ref('');

const emits = defineEmits(['update']);

const modelChange = () => {
	const v = props.data.find((i: any) => i.value === data.value);
	emits('update', v)
}
const setModel = () => {
	if (props.value) {
		data.value = props.value
	} else {
		const m = props.data.find((i: any) => i.label === 'gpt-3.5-turbo');
		if (m) {
			data.value = m.value;
		} else {
			data.value = props.data[0].value
			modelChange()
		}
	}

}

const findName = (val: string) => {
	if (val) {
		const m = props.data.find((i: any) => i.value === val);
		return m ? m.label : val
	}
}
watch(props, (v) => {
	setModel()
})
onMounted(() => {
	setModel()
})

onBeforeUnmount(() => {
})
</script>

<style lang="scss" scoped>
.model-select-wrapper {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	padding: 1.042rem;

	& .model-select {
		border-radius: 3.646rem;
		overflow: hidden;
		box-shadow: 0.26rem 0.26rem 1.042rem 0 rgba(48, 108, 233, 0.2);

		&:deep(.el-select__wrapper) {
			background: linear-gradient(180.00deg, rgb(255, 255, 255), rgba(255, 255, 255, 0.5) 100%);
			font-size: 0.833rem;
			font-weight: 400;
			color: rgb(51, 51, 51);
		}

		&:deep(.el-select__placeholder) {
			color: rgb(51, 51, 51);
		}

		&:deep(.el-select-dropdown__item) {
			height: 100px !important;
		}
	}
}

.desc-wrapper {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	height: 100%;

	& > .circle-active {
		border: 1px solid #066BF7;
	}

	& > div {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		height: 100%;

		&:nth-of-type(1) {
			width: 0.78125rem;
			height: 0.78125rem;
			border-radius: 50%;
			position: relative;
		}

		&:nth-of-type(2) {
			margin-left: 25px;
		}

		& > span:nth-of-type(1) {
			font-weight: bolder;
		}

		& > span:nth-of-type(2) {
			font-weight: normal;
		}
	}

}

.option-wrapper:deep(.el-select-dropdown__item) {
	background: red !important;
	height: 200px;
}
</style>
