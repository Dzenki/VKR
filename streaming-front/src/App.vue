<script setup>
import mainLayout from './layouts/main-layout.vue';
import { NConfigProvider } from 'naive-ui';
import { NMessageProvider } from 'naive-ui';
import { watch } from 'vue';
import { useRoute } from 'vue-router';

const themeOverrides = {
    common: {
        textColorBase: 'var(--main-text-color-deep-space-blue)'
    },
    Button: {
        color: '#fff',
        textColor: 'var(--main-text-color-deep-space-blue)',
        fontWeight: 'var(--font-weight-semi-bold)',
        fontSize: 'var(--font-size-fourteen)',
        lineHeight: 'var(--line-height-large)'
    },
    Dialog: {
        padding: '12px',
    },
    Icon: {
        color: 'var(--main-text-color-deep-space-blue)'
    },
    Menu: {
        itemIconColor: 'var(--main-text-color-deep-space-blue)',
    },
    Dropdown: {
        optionTextColor: 'var(--main-text-color-deep-space-blue)',

    }
}

const route = useRoute()

watch(
    () => route.meta.name,
    (newTitle) => {
        if (newTitle) {
        document.title = `${newTitle} | Gaze`
        } else {
        document.title = 'Gaze'
        }
    },
    { immediate: true } // Сработает сразу при загрузке
)
</script>

<template>
    <n-config-provider :theme-overrides="themeOverrides" :abstract="true">
        <n-message-provider>
            <div class="app">
                <main-layout/>
            </div>
        </n-message-provider>
    </n-config-provider>
</template>

<style>
.app {
    width: 100vw;
    height: 100vh;
    overflow-x: hidden;
    display: block;
    justify-items: center;
    background: wheat;
}
</style>
