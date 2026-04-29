<script setup>
import { NButton, NIcon, NMenu, NModal, NSkeleton } from 'naive-ui';
import { h } from 'vue';
import { computed, defineAsyncComponent, ref } from 'vue';
import { RouterLink } from 'vue-router';

import logOutIcon from '@/assets/img/svg/log-out-icon.vue';
import languageIcon from '@/assets/img/svg/language-icon.vue';
import contentSettingsIcon from '@/assets/img/svg/content-settings-icon.vue';
import settingsIcon from '@/assets/img/svg/settings-icon.vue';
import walletIcon from '@/assets/img/svg/wallet-icon.vue';
import cameraIcon from '@/assets/img/svg/camera-icon.vue';
import lockIcon from '@/assets/img/svg/lock-icon.vue';
import paidSubscriptionIcon from '@/assets/img/svg/paid-subscription-icon.vue';
import moonIcon from '@/assets/img/svg/moon-icon.vue';
import awardIcon from '@/assets/img/svg/award-icon.vue';
import questionIcon from '@/assets/img/svg/question-icon.vue';
import graphIcon from '@/assets/img/svg/graph-icon.vue';
import autherPage from '@/assets/img/svg/auther-page.vue';

const props = defineProps({
    profileName: {
        type: String,
        default: 'UNKNOWN'
    },
})
const model = defineModel()

const loading = ref(true);
const activeKey = ref(null);

function renderIcon(icon) {
    return () => h(NIcon, null, { default: () => h(icon) });
}

const menuMain = [
    {
        key: "divider-1",
        type: "divider",
        props: {
        style: {
                marginLeft: "0px"
            }
        }
    },
    {
        icon: renderIcon(moonIcon),
        label: () => h(
            RouterLink,
            {
                to: {}
            },
            "Тема"
        ),
        key: "theme",
    },
    {
        key: "divider-1",
        type: "divider",
        props: {
        style: {
                marginLeft: "0px"
            }
        }
    },
    {
        icon: renderIcon(cameraIcon),
        label: () => h(
            RouterLink,
            {
                to: {}
            },
            "Канал"
        ),
        key: "chanel",
    },
    {
        icon: renderIcon(graphIcon),
        label: () => h(
            RouterLink,
            {
                to: {}
            },
            "Панель управления автора"
        ),
        key: "author-panel",
    },
    {
        icon: renderIcon(autherPage),
        label: () => h(
            RouterLink,
            {
                to: {}
            },
            "Страница автора"
        ),
        key: "author-page",
    },
    {
        icon: renderIcon(lockIcon),
        label: () => h(
            RouterLink,
            {
                to: {}
            },
            "Центр конфиденциальности"
        ),
        key: "confidential",
    },
    {
        icon: renderIcon(questionIcon),
        label: () => h(
            RouterLink,
            {
                to: {}
            },
            "Портал обжалования"
        ),
        key: "portal",
    },
    {
        key: "divider-1",
        type: "divider",
        props: {
        style: {
                marginLeft: "0px"
            }
        }
    },
    {
        icon: renderIcon(paidSubscriptionIcon),
        label: () => h(
            RouterLink,
            {
                to: {}
            },
            "Подписки и спонсорство"
        ),
        key: "paid-subscription",
    },
    {
        icon: renderIcon(awardIcon),
        label: () => h(
            RouterLink,
            {
                to: {}
            },
            "Наргады"
        ),
        key: "awards",
    },
    {
        icon: renderIcon(walletIcon),
        label: () => h(
            RouterLink,
            {
                to: {}
            },
            "Кошелек"
        ),
        key: "wallet",
    },
    {
        key: "divider-1",
        type: "divider",
        props: {
        style: {
                marginLeft: "0px"
            }
        }
    },
    
    {
        icon: renderIcon(settingsIcon),
        label: () => h(
            RouterLink,
            {
                to: {}
            },
            "Настройки"
        ),
        key: "settings",
    },
    {
        icon: renderIcon(contentSettingsIcon),
        label: () => h(
            RouterLink,
            {
                to: {}
            },
            "Настройки контента"
        ),
        key: "content-settings",
    },
    {
        icon: renderIcon(languageIcon),
        label: () => h(
            RouterLink,
            {
                to: {}
            },
            "Язык"
        ),
        key: "language",
    },
    {
        key: "divider-1",
        type: "divider",
        props: {
        style: {
                marginLeft: "0px"
            }
        }
    },
    {
        icon: renderIcon(logOutIcon),
        label: () => h(
            RouterLink,
            {
                to: {}
            },
            "Выйти"
        ),
        key: "log-out",
    },
]



const emit = defineEmits(['close'])

function close() {
    emit('close')
}

</script>

<template>
    <n-modal class="account-sidebar-wrap"
        v-model:show="model"
        :style="{
            width: '300px'
        }"
        preset="card"
        :show-mask="false"
    >
        <template #header class="account-sidebar-header">
            <n-skeleton v-if="loading" circle size="medium"/>
            <span class="account-sidebar-name">{{ profileName }}</span>
        </template>
        <n-menu class="account-sidebar-menu"
            :style="{
                padding: '0px'
            }"
            v-model:value="activeKey"
            mode="vertial"
            :options="menuMain"
            responsive

        />

    </n-modal>
</template>

<style>
.account-sidebar-wrap{
    position: absolute;
    right: 12px;
    top: 56px;
}
.n-card > .n-card-header{
    padding: 16px;
}

.n-card > .n-card__content{
    padding: 0px 16px 16px 16px;
}

.account-sidebar-menu div{
    padding-left: 0px !important;
    padding-right: 0px;
}
.account-sidebar-menu .n-menu-item{
    height: 24px;
}

.n-card-header__main{
    display: flex;
    flex-direction: row;
    gap: 8px;
}

.n-menu-item div{
    padding-left: 0px;
}
</style>