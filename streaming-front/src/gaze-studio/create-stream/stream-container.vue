<script setup>
import { NButton } from 'naive-ui';
import screenShare from './screen-share.vue';


</script>

<template>
    <div class="video-from-cam">

    </div>
    <div class="video-from-screen">
        <screen-share/>
    </div>
    <div class="sound">
        <n-button type="primary">
            Запустить трансляцию
        </n-button>
    </div>
</template>

<style>

</style>