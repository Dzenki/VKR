<script setup>
import { computed, defineAsyncComponent } from 'vue';


const props = defineProps({
    videoName: {
        type: String,
        default:'Без имени'
    },
    creatorName: {
        type: String,
        default: 'Без имени'
    },
    category: {
        type: Number,
        default: null
    },
    viewersCnt: {
        type: Number,
        default: 0
    },
    creatorLogo: {
        type: String,
        default: null,
    },
    videoBanner: {
        type: String,
        default: null,
    }
})

const horisontal = computed(() => {
    return defineAsyncComponent(() => import(`@/assets/img/svg/three-dots-icon.vue`))
})

// TODO: Категории работают по принципу словаря. Те мы получаем 1, потом вызываем словарь и получаем значение 1 (прим. Genshin Impact)
</script>

<template>
    <div class="video-preview-wrap">

    </div>
</template>

<style>

</style>