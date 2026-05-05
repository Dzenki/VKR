<script setup>
import { h } from 'vue';
import { ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

import { NLayoutHeader, NSpace } from 'naive-ui';
import { NLayout } from 'naive-ui';
import { NLayoutSider } from 'naive-ui';
import { NMenu } from 'naive-ui';
import { NIcon } from 'naive-ui';

import homeIcon from '@/assets/img/svg/home-icon.vue';
import shortsIcon from '@/assets/img/svg/shorts-icon.vue';
import collectionIcon from '@/assets/img/svg/collection-icon.vue';
import personIcon from '@/assets/img/svg/person-icon.vue';
import headerLayout from '../header-layout.vue';

const sidebarItems = [
    {
        icon: renderIcon(homeIcon),
        label: () =>
            h(
                RouterLink,
                {
                to: {
                    name: 'home',
                }
                },
                { default: () => 'Главная' }
            ),
        key: 'home',
    },
    {
        icon: renderIcon(shortsIcon),
        label: () =>
            h(
                RouterLink,
                {
                to: {
                    name: 'shorts',
                }
                },
                { default: () => 'Клипы' }
            ),
        key: 'shorts',
    },
    {
        icon: renderIcon(collectionIcon),
        label: () =>
            h(
                RouterLink,
                {
                to: {
                    name: 'collection',
                }
                },
                { default: () => 'Подписки' }
            ),
        key: 'collection',
    },
    {
        icon: renderIcon(personIcon),
        label: () =>
            h(
                RouterLink,
                {
                to: {
                    name: 'you',
                }
                },
                { default: () => 'Аккаунт' }
            ),
        key: 'you',
    },
]

const activeKey = ref(null);
const collapsed = ref(false);


function renderIcon(icon) {
    return () => h(NIcon, null, { default: () => h(icon) });
}

</script>

<template>
    <div style="height: 100vh; position: relative">
        <n-layout position="absolute">
            <n-layout-header bordered :style="{height: '56px'}">
                <header-layout/>
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
                <n-layout has-sider class="main-router-wrap" >
                    <router-view/>
                </n-layout>
            </n-layout>
        </n-layout>
    </div>
</template>

<style>

</style>