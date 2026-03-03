<script setup>
import mainLayout from './layouts/main-layout.vue';
import { NConfigProvider } from 'naive-ui';

const themeOverrides = {
    common: {
        
    },
    Button: {

    },
}
</script>

<template>
    <n-config-provider :theme-overrides="themeOverrides" :abstract="true">
        <div class="app">
            <main-layout/>
        </div>
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
