<script setup>
import mainLayout from './layouts/main-layout.vue';
import { NConfigProvider } from 'naive-ui';
import { NMessageProvider } from 'naive-ui';

const themeOverrides = {
    common: {

    },
    Button: {
        color: '#fff',
        textColor: 'var(--main-text-color-deep-space-blue)',
        fontWeight: 'var(--font-weight-semi-bold)',
        fontSize: 'var(--font-size-fourteen)',
        lineHeight: 'var(--line-height-large)'
    },
}
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
