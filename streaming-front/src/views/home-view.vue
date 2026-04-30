<script setup>
import tagsSlider from '@/components/main/tags-slider.vue';
import videoList from '@/components/main/video-list.vue';
import cutsList from '@/components/main/cuts-list.vue';

</script>

<template>
    <div>
        <tags-slider/>
        <div class="home-view-line"/>
        <video-list/>
        <cuts-list/>
    </div>
</template>

<style>
.home-view-line{
    height: 2px;
    background-color: var(--black-ten-opacity);
}
</style>
