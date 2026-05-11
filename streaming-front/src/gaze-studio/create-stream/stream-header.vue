<script setup>
import { NIcon, NSkeleton, NTag } from 'naive-ui';
import { computed, defineAsyncComponent } from 'vue';


const gazeIcon = computed(() => {
    return defineAsyncComponent(() => import('@/assets/img/svg/gaze.vue'))
})

const skeletonThemeOverrides = {
    color: '#0c7a43',
    colorEnd: '#18a058',
}
</script>

<template>
    <div class="stream-header-wrap">
        <n-icon color="white" size="24">GAZE</n-icon>
        <div class="stream-header-tags-wrap">
            <n-tag :bordered="false" type="success">Время 0:00:00</n-tag>
            <n-tag :bordered="false" type="success">0 Зрителей</n-tag>
            <n-tag :bordered="false" type="success">0 Подписчиков</n-tag>
            <n-skeleton height="28px" circle :theme-overrides="skeletonThemeOverrides"/>
        </div>
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

.stream-header-tags-wrap{
    display: flex;
    flex-direction: row;
    gap: 8px;
}
</style>