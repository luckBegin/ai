<template>
	<div class="base-layout" style="height: 100%;">
		<router-view />
	</div>
</template>

<script lang="ts" setup>

</script>

<style>
@import "@/style.scss";
.base-layout {
	width: 100% ;
	height: 100% ;
	background: url("@/assets/bg.png") round;
}

</style>
