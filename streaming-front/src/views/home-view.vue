<script setup>
import tagsSlider from '@/components/main/tags-slider.vue';
import videoList from '@/components/main/video-list.vue';

</script>

<template>
    <div>
        <tags-slider/>
        <div class="home-view-line"/>
        <video-list/>
    </div>
</template>

<style>
.home-view-line{
    height: 2px;
    background-color: var(--black-ten-opacity);
}
</style>
