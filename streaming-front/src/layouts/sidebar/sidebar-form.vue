<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import sidebarFull from './sidebar-full.vue';
import sidebarShort from './sidebar-short.vue';

import homeIcon from '@/assets/img/svg/home-icon.vue';
import homeFillIcon from '@/assets/img/svg/home-fill-icon.vue';
import shortsIcon from '@/assets/img/svg/shorts-icon.vue';
import shortsFillIcon from '@/assets/img/svg/shorts-fill-icon.vue';
import collectionIcon from '@/assets/img/svg/collection-icon.vue';
import collectionFillIcon from '@/assets/img/svg/collection-fill-icon.vue';
import personIcon from '@/assets/img/svg/person-icon.vue';
import personFillIcon from '@/assets/img/svg/person-fill-icon.vue';

const iconMap = {
    home: homeIcon,
    homeF: homeFillIcon,
    shorts: shortsIcon,
    shortsF: shortsFillIcon,
    collection: collectionIcon,
    collectionF: collectionFillIcon,
    person: personIcon,
    personF: personFillIcon
}

const sidebarItems = [
    {
        icon: 'home',
        fillIcon: 'homeF',
        title: 'Главная',
        link: '/',
    },
    {
        icon: 'shorts',
        fillIcon: 'shortsF',
        title: 'Клипы',
        link: '/shorts',
    },
    {
        icon: 'collection',
        fillIcon: 'collectionF',
        title: 'Подписки',
        link: '/collection'
    },
    {
        icon: 'person',
        fillIcon: 'personF',
        title: 'Аккаунт',
        link: '/you',
    },
]

const showImportants = ref(true)
const showFullMenu = ref(localStorage.getItem('showFullMenu') !== 'false')
const route = useRoute()

// Для сброса анимации в short-menu
const shortMenuKey = ref(0)
watch(showFullMenu, (val) => {
	localStorage.setItem('showFullMenu', val)
	if (!val) {
		// при каждом открытии short-menu увеличиваем ключ, чтобы сбросить анимацию
		shortMenuKey.value++
	}
})

</script>

<template>
    <div class="side-bar-wrap" id="side-bar">
        <transition name="side-bar-width">
            <aside v-if="showFullMenu || !showFullMenu"
                :class="['side-bar', {'side-bar--collapsed' : !showFullMenu}]"
                key="side-bar-aside"
            >
                <div class="side-bar-container">
                    <router-link to="/" class="side-bar-header">
                        <bigMainIcon v-show="showFullMenu" />
						<mainIcon v-show="!showFullMenu" />
                    </router-link>
                    <sidebar-full v-if="showFullMenu" :sidebar-items="sidebarItems" :icon-map="iconMap"
                        :active="route.path" :show-full-menu="showFullMenu"
                        @toggle-importants="showImportants = !showImportants"
                    />
                    <sidebar-short v-else :key="shortMenuKey" :sidebar-items="sidebarItems"
                        :icon-map="iconMap" :active="route.path"
                    />
                </div>
            </aside>
        </transition>
        <div class="side-bar-toggle" @click="showFullMenu = !showFullMenu"
			:aria-label="showFullMenu ? 'Свернуть меню' : 'Развернуть меню'"
			:title="showFullMenu ? 'Свернуть меню' : 'Развернуть меню'"
            >
        </div>
    </div>
</template>

<style>
.side-bar-wrap{
    display: flex;
    height: 100vh;
    width: max-content;
    background: var(--main-bg-color-alice-blue);
}

.side-bar-header{
    display: flex;
    justify-content: center;
}

.side-bar-width-enter-active,
.side-bar-width-leave-active {
	transition: width 0.2s cubic-bezier(.4, 0, .2, 1);
}

.side-bar-width-enter-from,
.side-bar-width-leave-to {
	width: 90px !important;
}

.side-bar-width-enter-to,
.side-bar-width-leave-from {
	width: 224px !important;
}

.side-bar-container{
    height: 100%;
    padding: 24px;
}

.side-bar{
    position: relative;
    width: 224px;
    background: var(--main-bg-color-alice-blue);
    /* border: 1px solid var(--main-border-color-pale-state); */
    display: flex;
    height: 100%;
    flex-direction: column;
    /* box-shadow: 0 16px 16px 0 var(--main-border-color-pale-state); */
    transition: width 0.2s;
}

.side-bar--collapsed {
    width: 90px;
}
</style>