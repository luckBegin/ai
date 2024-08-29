<template>
	<div class = 'model-dialog'>
		<Markdown :source="source" />
	</div>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import Markdown from 'vue3-markdown-it';
const source = ref('asdasdasd')
onMounted(() => {
})

onBeforeUnmount(() => {
})
</script>

<style lang="scss" scoped>
.model-dialog {
	width: 100% ;
	height: 100% ;
}
</style>
