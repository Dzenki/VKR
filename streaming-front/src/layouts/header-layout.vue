<script setup>
import { computed, defineAsyncComponent, inject, ref } from 'vue';
import { RouterLink } from 'vue-router';

import { NDropdown, NModal } from 'naive-ui';
import { NButton } from 'naive-ui';
import { NIcon } from 'naive-ui';

import upHeader from '@/components/login/sign-up/header.vue';
import inHeader from '@/components/login/sign-in/header.vue';
import inForm from '@/components/login/sign-in/form.vue';
import upForm from '@/components/login/sign-up/form.vue';
import accountSidebar from './account-sidebar/account-sidebar.vue';
import { h } from 'vue';

import postIcon from '@/assets/img/svg/post-icon.vue';
import goLiveIcon from '@/assets/img/svg/go-live-icon.vue';
import uploadIcon from '@/assets/img/svg/upload-icon.vue';

const searchRequest = ref('')

const menuIcon = computed(() => {
    return defineAsyncComponent(() => import('@/assets/img/svg/menu-icon.vue'))
})

const gazeIcon = computed(() => {
    return defineAsyncComponent(() => import('@/assets/img/svg/gaze.vue'))
})

const profileIcon = computed(() => {
    return defineAsyncComponent(() => import('@/assets/img/svg/profile-icon.vue'))
})

const bellIcon = computed(() => {
    return defineAsyncComponent(() => import('@/assets/img/svg/bell-icon.vue'))
})

const searchIcon = computed(() => {
    return defineAsyncComponent(() => import('@/assets/img/svg/search-icon.vue'))
})

const gazeIconMini = computed(() => {
    return defineAsyncComponent(() => import('@/assets/img/svg/gaze-icon.vue'))
})

const bigPlusIcon = computed(() => {
    return defineAsyncComponent(() => import('@/assets/img/svg/big-plus-icon.vue'))
})


const showSignInModal = ref(false)
const showSignUpModal = ref(false)

const accountSidebarModal = ref(false)

const createOptions = [
    {
        icon: renderIcon(goLiveIcon),
        label: () => h( 
            RouterLink,
            {
                to: {
                    name: 'createStream'
                }
            },
            "Начать трансляцию"
        ),
        key: "go-live",
    },
    {
        icon: renderIcon(uploadIcon),
        label: () => h( 
            RouterLink,
            {
                to: {
                    name: 'uploadVOD'
                }
            },
            "Загрузить запись"
        ),
        key: "upload-vod",
    },
    {
        icon: renderIcon(postIcon),
        label: () => h( 
            RouterLink,
            {
                to: {
                    name: 'createPost'
                }
            },
            "Создать пост"
        ),
        key: "create-post",
    },
]

function renderIcon(icon) {
    return () => {
        return h(NIcon, null, {
        default: () => h(icon)
        });
    };
}

async function searchFunction(){

}

function rediretFunction(){
    showSignInModal.value = !showSignInModal.value 
    showSignUpModal.value = !showSignUpModal.value 
}
</script>

<template>
    <div class="header-layout">
        <div class="header-left-wrap">
            <!-- <menuIcon class="header-layout-menu-icon"/> -->
            <router-link to="/">
                <gazeIcon class="header-layout-gaze-icon"/>

            </router-link>
        </div>
        <form  class="header-center-wrap" @submit.prevent="searchFunction">
            <div class="header-search-wrap">
                <input type="text" placeholder="Search" v-model="searchRequest" class="header-search-container" id="search" />
                <searchIcon class="header-search-icon" @click="console.log('search')"/>
            </div>
            
        </form>
        <div class="header-right-wrap">
            <!-- <n-button class="header-right-sign-in-btn" @click="showSignInModal = true">Войти</n-button>
            <n-modal v-model:show="showSignInModal" preset="dialog" title="Dialog">
                <template #icon>
                    <n-icon>
                        <gazeIconMini/>
                    </n-icon>
                </template>
                <template #header>
                    <in-header/>
                </template>
                <in-form/>
                <template #action>
                    <n-button class="sign-redirect-btn"
                        @click="rediretFunction">У вас нет учетной записи? Зарегистрируйтесь!</n-button>
                </template>
            </n-modal>

            <n-button class="header-right-sign-up-btn" @click="showSignUpModal = true">Регистрация</n-button>
            <n-modal v-model:show="showSignUpModal" preset="dialog" title="Dialog">
                <template #icon>
                    <n-icon>
                        <gazeIconMini/>
                    </n-icon>
                </template>
                <template #header>
                    <up-header/>
                </template>
                <up-form/>
                <template #action>
                    <n-button class="sign-redirect-btn"
                        @click="rediretFunction">Есть учетная запись? Войти</n-button>
                </template>
            </n-modal> -->
            <n-dropdown :options="createOptions" trigger="click">
                <n-button strong secondary type="primary">
                    <n-icon>
                        <bigPlusIcon/>
                    </n-icon>
                    &nbsp Создать
                </n-button>
            </n-dropdown>
            

            <bellIcon class="header-layout-bell-icon" @click="console.log('notification')"/>
            <profileIcon class="header-layout-profile-icon" @click="accountSidebarModal = true"/>
            <accountSidebar v-model:="accountSidebarModal" @close="accountSidebarModal = false"/>
        </div>
    </div>
</template>

<style>
.header-layout{
    height: 56px;
    width: 100vw;
    padding: 0px 16px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: anchor-center;
    gap: 56px;
    /* background: var(--main-bg-color-alice-blue); */
    background-color: #fff;
    /* position: sticky; */
    /* top: 0; */
    /* z-index: 1000; */
}

.header-left-wrap{
    display: flex;
    flex-direction: row;
    gap: 16px;
}

.header-right-wrap{
    display: flex;
    flex-direction: row;
    gap: 16px;
}

.header-center-wrap{
    width: 100%;
    max-width: 600px;
}

.header-search-wrap{
    width: 100%;
    height: 30px;
    border: solid 1px var(--main-border-color-pale-state);
    border-radius: 20px;
    display: flex;
    padding: 16px;
    align-items: center;
}

.header-search-icon{
    fill: var(--main-border-color-pale-state);
}

.header-search-container{
    width: 100%;

    border: none;
    outline: none;
	transition: border 0.1s;
}

.header-layout-menu-icon{
    height: 24px;
    width: 24px;
    align-self: center;
}

.header-layout-bell-icon{
    height: 20px;
    width: 20px;
    align-self: center;
}

.header-layout-profile-icon{
    height: 30px;
    width: 30px;
}

.sign-redirect-btn{
    width: stretch;
}
</style>
