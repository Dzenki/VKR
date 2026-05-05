<script setup>
import { NIcon } from 'naive-ui';
import { computed, defineAsyncComponent } from 'vue';


const gazeIcon = computed(() => {
    return defineAsyncComponent(() => import('@/assets/img/svg/gaze.vue'))
})


</script>

<template>
    <div class="stream-header-wrap">
        <n-icon color="white" size="24">GAZE</n-icon>
        <div :style="{color: 'var(--white)'}">ПРОСТО ДЛЯ ВИДА ПРОСТО ДЛЯ ВИДА ПРОСТО ДЛЯ ВИДА</div>
    </div>
</template>

<style>
.stream-header-wrap{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 16px 16px;
    align-items: anchor-center;
}
</style>