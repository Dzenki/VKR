<script setup>
import tagsSlider from '@/components/main/tags-slider.vue';
import videoList from '@/components/main/video-list.vue';
import cutsList from '@/components/main/cuts-list.vue';

// TODO: необходиом сделать, чтобы фронт получал какеи именно листы отображать: стримы, клипы, категории, рекомендации и тд причем везде разное кол-во видео
</script>

<template>
    <div class="home-view-wrap">
        <tags-slider/>
        <div class="home-view-line"/>
        <video-list/>
        <cuts-list/>
        <video-list/>
        <video-list/>
        <cuts-list/>
        <video-list/>
        <video-list/>

    </div>
</template>

<style>
.home-view-line{
    height: 2px;
    background-color: var(--black-ten-opacity);
}
</style>
