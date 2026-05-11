<script setup>
import { NIcon, NLayout, NLayoutContent, NLayoutHeader, NLayoutSider, NMenu } from 'naive-ui';
import streamHeader from './stream-header.vue';
import streamContainer from './stream-container.vue';
import { h, ref } from 'vue';
import { RouterLink } from 'vue-router';

import homeFillIcon from '@/assets/img/svg/home-fill-icon.vue';
import goLiveIcon from '@/assets/img/svg/go-live-icon.vue';
import megaphoneIcon from '@/assets/img/svg/megaphone-icon.vue';
import diagramIcon from '@/assets/img/svg/diagram-icon.vue';
import peopleIcon from '@/assets/img/svg/people-icon.vue';
import materialsIcon from '@/assets/img/svg/materials-icon.vue';
import moderationIcon from '@/assets/img/svg/moderation-icon.vue';
import coolEmojiiIcon from '@/assets/img/svg/cool-emojii-icon.vue';
import addStreamerIcon from '@/assets/img/svg/add-streamer-icon.vue';

const sidebarItems = [
    {
        icon: renderIcon(homeFillIcon),
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        name: '',
                    }
                },
                { default: () => 'Главная' }
            ),
        key: 'main',
    },
    {
        icon: renderIcon(goLiveIcon),
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        name: '',
                    }
                },
                { default: () => 'Управление трансляцией' }
            ),
        key: 'stream-managment',
    },
    {
        icon: renderIcon(megaphoneIcon),
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        name: '',
                    }
                },
                { default: () => 'Оповещения' }
            ),
        key: 'notification',
    },
    {
        icon: renderIcon(diagramIcon),
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        name: '',
                    }
                },
                { default: () => 'Аналитика' }
            ),
        key: 'analityc',
    },
    {
        icon: renderIcon(peopleIcon),
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        name: '',
                    }
                },
                { default: () => 'Сообщество' }
            ),
        key: 'community',
    },
    {
        icon: renderIcon(materialsIcon),
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        name: '',
                    }
                },
                { default: () => 'Материалы' }
            ),
        key: 'community1',
    },
    {
        icon: renderIcon(moderationIcon),
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        name: '',
                    }
                },
                { default: () => 'Модерация' }
            ),
        key: 'community2',
    },
    {
        icon: renderIcon(coolEmojiiIcon),
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        name: '',
                    }
                },
                { default: () => 'Награды для зрителей' }
            ),
        key: 'community3',
    },
    {
        icon: renderIcon(addStreamerIcon),
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        name: '',
                    }
                },
                { default: () => 'Совместная трансляция' }
            ),
        key: 'community4',
    },
]


const activeKey = ref(null);
const collapsed = ref(false);

function renderIcon(icon) {
    return () => h(NIcon, null, { default: () => h(icon) });
}

const iconThemeOverrides = {
    itemIconColor: 'var(--white)',
    itemTextColor: 'var(--white)',
}
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
                    :theme-overrides="iconThemeOverrides"
                >
                    <n-menu v-model:value="activeKey" class="naive-slider-wrap"
                        :collapsed="collapsed" :collapsed-width="64"
                        :collapsed-icon-size="22" :options="sidebarItems" :theme-overrides="iconThemeOverrides"
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