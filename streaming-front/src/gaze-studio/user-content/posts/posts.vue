<script setup>
import { NButton, NIcon, NResult } from 'naive-ui';
import { computed, defineAsyncComponent } from 'vue';

const sadIcon = computed(() => {
    return defineAsyncComponent(() => import(`@/assets/img/svg/sad-icon.vue`))
})

</script>

<template>
    <n-result
        status="info"
        title="Посты"
        description="Здесь будут собраны ваши прямые трансляции"
    >
        <template #icon>
            <n-icon size="128">
                <sadIcon/>
            </n-icon>
        </template>

        <template #footer>
            <n-button type="primary">Начать</n-button>
        </template>
    </n-result>
</template>

<style>

</style>