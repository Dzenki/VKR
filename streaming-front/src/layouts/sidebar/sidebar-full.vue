<script setup>
import { computed, defineAsyncComponent } from 'vue';


const gazeIcon = computed(() => {
    return defineAsyncComponent(() => import('@/assets/img/svg/gaze.vue'))
})

defineProps({
	sidebarItems: {
		type: Array,
		required: true
	},
	iconMap: {
		type: Object,
		required: true
	},
	showFullMenu: {
		type: Boolean,
		required: true
	}
})

const emit = defineEmits(['toggleImportants'])
</script>

<template>
    <nav class="side-bar-full">
        <div class="side-bar-full-wrap">
            <router-link 
                v-for="item in sidebarItems"
                :key="item.title"
                :to="item.link"
                class="side-bar-full-item"
            >
                <div class="side-bar-full-item-wrap">
                    <component :is="iconMap[item.icon]" class="side-bar-icon"/>
                    <span class="side-bar-text" :class="{'side-bar-text--visible' : showFullMenu}">{{ item.title }}</span>
                </div>
            </router-link>
        </div>
    </nav>
</template>

<style>
.side-bar-full{
    flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.side-bar-full-wrap{
    display: flex;
    gap: 8px;
    flex-direction: column;
}

.side-bar-full-item{
    display: flex;
	align-items: center;
	gap: 12px;
	padding: 6px 16px;
	text-decoration: none;
	transition: all 0.2s;
	user-select: none;
	justify-content: space-between;
}

.side-bar-full-item-wrap{
    display: flex;
	align-items: center;
	gap: 12px;
}
</style>