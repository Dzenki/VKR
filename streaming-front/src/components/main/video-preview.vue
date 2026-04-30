<script setup>
import { usePluralize } from '@/composables/usePluralize';
import { NSkeleton } from 'naive-ui';
import { computed, defineAsyncComponent } from 'vue';

const { formatWithCount } = usePluralize()

const props = defineProps({
    videoName: {
        type: String,
        default:'Без имени (бесполезный текст для теста)'
    },
    creatorName: {
        type: String,
        default: 'Без имени'
    },
    videoCategory: {
        type: Number,
        default: 1
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

const language = {
    rus: 'В эфире',
    eng: 'live'
}

const horisontalIcon = computed(() => {
    return defineAsyncComponent(() => import(`@/assets/img/svg/three-dots-icon.vue`))
})

// TODO: Категории работают по принципу словаря. Те мы получаем 1, потом вызываем словарь и получаем значение 1 (прим. Genshin Impact)
</script>

<template>
    <div class="video-preview-wrap">
        <div class="video-preview-container">
            <n-skeleton class="video-preview-skeleton" :sharp="false"/>
            <div class="video-preview-online-tag">
                <span class="video-preview-online-text">{{ language.rus }}</span>
            </div>
            <div class="video-preview-viewers-tag">
                <span class="video-preview-viewers-text">{{ formatWithCount(viewersCnt, ['зритель', 'зрителя', 'зрителей']) }}</span>
            </div>
        </div>
        <div class="video-preview-text-wrap">
            <n-skeleton height="35px" circle/>
            <div class="video-preview-text-container">
                <span class="video-preview-video-name">{{ videoName }}</span>
                <span class="video-preview-creator-name">{{ creatorName }}</span>
                <span class="video-preview-creator-name">{{ videoCategory }}</span>
            </div>
            <horisontalIcon :style="{height: '16px'}"/>
        </div>
            
    </div>
</template>

<style>

.video-preview-skeleton{
    width: 100%;
    height: 0;
    padding-bottom: 56.25%;
}

.video-preview-wrap{
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.video-preview-container{
    position: relative;
}

.video-preview-text-wrap{
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 8px;
    display: grid;
    grid-template-columns: repeat(3, auto);
}

.video-preview-text-container{
    display: flex;
    flex-direction: column;
    gap: 1px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.video-preview-video-name{
    color: var(--main-text-color-deep-space-blue);
    font-size: var(--font-size-fourteen);
    font-weight: var(--font-weight-semi-bold);
    line-height: var(--line-height-small);

    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.video-preview-creator-name{
    color: var(--main-text-color-deep-space-blue);
    font-size: var(--font-size-twelve);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-small);
}

.video-preview-online-tag{
    background-color: var(--bg-color-red);
    border-radius: 6px;
    padding: 1px 5px;
    width: max-content;

    position: absolute;
    top: 8px;
    left: 10px;
}

.video-preview-online-text{
    color: var(--text-color-white);
    font-size: var(--font-size-twelve);
    font-weight: var(--font-weight-medium);
    line-height: var(--line-height-small);
    text-transform: uppercase;
}

.video-preview-viewers-tag{
    background-color: var(--black-ten-opacity);
    border-radius: 6px;
    padding: 1px 5px;
    width: max-content; 
    position: absolute;
    bottom: 8px;
    left: 10px;
}

.video-preview-viewers-text{
    color: var(--text-color-white);
    font-size: var(--font-size-twelve);
    font-weight: var(--font-weight-medium);
    line-height: var(--line-height-small);
   
}
</style>