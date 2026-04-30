<script setup>
import { h, ref, shallowRef, watch, markRaw } from 'vue';

import { NSpace, NLayout, NLayoutSider, NMenu, NIcon } from 'naive-ui';

import heartIcon from '@/assets/img/svg/heart-icon.vue';

const sidebarItems = [
    {
        icon: renderIcon(heartIcon),
        label: 'Управление',
        key: 'dashboard',
        importComponent: () => import('@/gaze-studio/dashboard/dashboard.vue') // Функция импорта
    },
    {
        icon: renderIcon(heartIcon),
        label: 'Контент',
        key: 'content',
        importComponent: () => import('@/gaze-studio/user-content/content.vue')
    },
    {
        icon: renderIcon(heartIcon),
        label: 'Аналитика',
        key: 'analytics',
        importComponent: () => import('@/gaze-studio/analytics/analytics.vue')
    },
    {
        icon: renderIcon(heartIcon),
        label: 'Сообщество',
        key: 'community',
        importComponent: () => import('@/gaze-studio/community/community.vue')
    },
    {
        icon: renderIcon(heartIcon),
        label: 'Языки',
        key: 'languages',
        importComponent: () => import('@/gaze-studio/languages/languages.vue')
    },
    {
        icon: renderIcon(heartIcon),
        label: 'Монетизация',
        key: 'monetization',
        importComponent: () => import('@/gaze-studio/monetization/monetization.vue')
    },
    {
        icon: renderIcon(heartIcon),
        label: 'Настройки канала',
        key: 'channel-settings',
        importComponent: () => import('@/gaze-studio/channel-settings/channel-settings.vue')
    },
    {
        icon: renderIcon(heartIcon),
        label: 'Фонотека',
        key: 'music',
        importComponent: () => import('@/gaze-studio/music/music.vue')
    },
]

const activeKey = ref('dashboard');
const currentComponent = shallowRef(null);
const collapsed = ref(false);

const componentCache = new Map();

function renderIcon(icon) {
    return () => h(NIcon, null, { default: () => h(icon) });
}

async function loadComponent(key) {
    if (componentCache.has(key)) {
        currentComponent.value = componentCache.get(key);
        return;
    }

    const item = sidebarItems.find(item => item.key === key);
    if (item && item.importComponent) {
        try {
            const module = await item.importComponent();
            const component = module.default || module;
            const markedComponent = markRaw(component);
            componentCache.set(key, markedComponent);
            currentComponent.value = markedComponent;
        } catch (error) {
            console.error(`Ошибка загрузки компонента ${key}:`, error);
            currentComponent.value = null;
        }
    }
}

// Следим за изменением activeKey
watch(activeKey, async (newKey) => {
    if (newKey) {
        await loadComponent(newKey);
    }
}, { immediate: true });
</script>

<template>
    <n-space vertical class="naive-slider-wrap">
        <n-layout has-sider>
            <n-layout-sider
                bordered collapse-mode="width" :collapsed-width="64"
                :width="240" :collapsed="collapsed" show-trigger
                @collapse="collapsed = true" @expand="collapsed = false"
            >
                <n-menu 
                    v-model:value="activeKey" 
                    class="naive-slider-wrap"
                    :collapsed="collapsed" 
                    :collapsed-width="64"
                    :collapsed-icon-size="22" 
                    :options="sidebarItems"
                />
            </n-layout-sider>
            <n-layout>
                <component 
                    :is="currentComponent" 
                    v-if="currentComponent"
                />
                <div v-else class="loading-placeholder">
                    <n-spin size="large" />
                </div>
            </n-layout>
        </n-layout>
    </n-space>
</template>

<style>
.naive-slider-wrap {
    height: calc(100vh - 56px);
    overflow: auto;
    overflow-x: hidden;
}

.loading-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #666;
}
</style>