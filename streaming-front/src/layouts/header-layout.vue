<script setup>
import { computed, defineAsyncComponent, inject, ref } from 'vue';
import { RouterLink } from 'vue-router';

const searchRequest = ref('')
const signType = inject('signType')

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

async function searchFunction(){

}

function isSignIn(){
    signType.value = 'Вход'
}

function isSignUp(){
    signType.value = 'Регистрация'

}

</script>

<template>
    <div class="header-layout">
        <div class="header-left-wrap">
            <menuIcon class="header-layout-menu-icon"/>
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
            <router-link to="/login">
                <button class="header-right-sign-in-btn" @click="isSignIn">Войти</button>
            </router-link>
            <router-link to="/login">
                <button class="header-right-sign-up-btn" @click="isSignUp">Регистрация</button>
            </router-link>
            <bellIcon class="header-layout-bell-icon" @click="console.log('notification')"/>
            <profileIcon class="header-layout-profile-icon" @click="console.log('profile')"/>
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
    background: var(--main-bg-color-alice-blue);
    position: sticky;
    top: 0;
    z-index: 1000;
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
</style>
