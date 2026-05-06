<script setup>
import { NLayout, NLayoutContent, NLayoutHeader, NLayoutSider } from 'naive-ui';
import streamHeader from './stream-header.vue';
import streamContainer from './stream-container.vue';

</script>

<template>
    <div class="create-stream-wrap">
        <n-layout position="absolute">
            <n-layout-header bordered :style="{height: '56px'}" >
                <stream-header/>
            </n-layout-header>
            <n-layout has-sider position="absolute" style="top: 56px;">
                <n-layout-sider
                    bordered collapse-mode="width" :collapsed-width="64"
                    :width="240" :collapsed="collapsed" show-trigger
                    @collapse="collapsed = true" @expand="collapsed = false"
                >
                    <n-menu v-model:value="activeKey" class="naive-slider-wrap"
                        :collapsed="collapsed" :collapsed-width="64"
                        :collapsed-icon-size="22" :options="sidebarItems"
                    />
                </n-layout-sider>
                <n-layout-content has-sider class="main-router-wrap" >
                    <stream-container/>
                </n-layout-content>
            </n-layout>
        </n-layout>
    </div>
</template>

<style>
.create-stream-wrap{
    width: 100vw;
    height: 100vh;
    position: relative
}

.n-layout-content{
    background-color: var(--bg-dark-color-dark-grey);
}

.n-layout-header{
    background-color: var(--bg-dark-color-dark-grey);

}

.n-layout-sider{
    background-color: var(--bg-dark-color-dark-grey);

}
</style>