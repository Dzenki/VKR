<script setup>
import { computed, defineAsyncComponent, ref } from 'vue';

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

</script>

<template>
    <div class="header-layout">
        <div class="header-left-wrap">
            <menuIcon class="header-layout-menu-icon"/>
            <gazeIcon class="header-layout-gaze-icon"/>
        </div>
        <div class="header-center-wrap">
            <div class="header-search-wrap">
                <input type="text" placeholder="Search" v-model="searchRequest" class="header-search-container" id="search" />
            </div>
        </div>
        <div class="header-right-wrap">
            <bellIcon class="header-layout-bell-icon" />
            <profileIcon class="header-layout-profile-icon"/>
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
