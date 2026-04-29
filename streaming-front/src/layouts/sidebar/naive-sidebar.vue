<script setup>
import { h } from 'vue';
import { ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

import { NSpace } from 'naive-ui';
import { NLayout } from 'naive-ui';
import { NLayoutSider } from 'naive-ui';
import { NMenu } from 'naive-ui';
import { NIcon } from 'naive-ui';

import homeIcon from '@/assets/img/svg/home-icon.vue';
import shortsIcon from '@/assets/img/svg/shorts-icon.vue';
import collectionIcon from '@/assets/img/svg/collection-icon.vue';
import personIcon from '@/assets/img/svg/person-icon.vue';

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

const route = useRoute()

function renderIcon(icon) {
    return () => h(NIcon, null, { default: () => h(icon) });
}

</script>

<template>
    <n-space vertical class="naive-slider-wrap">
        <n-layout has-sider>
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
            <n-layout>
                <router-view/>
            </n-layout>
        </n-layout>
    </n-space>
</template>

<style>
.naive-slider-wrap{
    height: calc(100vh - 56px);
    overflow: auto;
    overflow-x: hidden;
}
</style>