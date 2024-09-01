<template>
	<div class="model-select-wrapper">
		<el-select  style="width: 10.417rem;" size="large" class="model-select"
					placeholder="请选择模型"
					v-model="data"
					@change="modelChange()"
					:disabled="!!props.value"
		>
			<el-option
				v-for="d in props.data"
				:key="d.name"
				:label="d.name"
				:value="d.value"
			/>
		</el-select>
	</div>
</template>

<script setup lang='ts'>
import {ref, reactive, onMounted, onBeforeUnmount, watch} from "vue";
const props = defineProps(['data', 'value']);
const data = ref('');

const emits = defineEmits(['update']);

const modelChange = () => {
	const v = props.data.find( (i:any) => i.value === data.value );
	emits('update', v)
}
const setModel = () => {
	if( props.value ) {
		data.value = props.value
	} else {
		const m = props.data.find( (i: any) => i.name === '综合模型gpt-3.5-turbo') ;
		if( m ) {
			data.value = m.name ;
		}  else {
			data.value = props.data[0].name
		}
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
	width: 100% ;
	height: 100% ;
	box-sizing: border-box;
	padding: 1.042rem;
	& .model-select {
		border-radius: 3.646rem;
		overflow: hidden;
		box-shadow: 0.26rem 0.26rem 1.042rem 0 rgba(48, 108, 233, 0.2);
		&:deep(.el-select__wrapper) {
			background:  linear-gradient(180.00deg, rgb(255, 255, 255),rgba(255, 255, 255, 0.5) 100%);
			font-size: 0.833rem;
			font-weight: 400;
			color: rgb(51, 51, 51);
		}
		&:deep(.el-select__placeholder) {
			color: rgb(51, 51, 51);
		}
	}
}
</style>
