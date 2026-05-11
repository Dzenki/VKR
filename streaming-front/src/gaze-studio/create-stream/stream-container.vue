<script setup>
import { NButton } from 'naive-ui';
import screenShare from './screen-share.vue';
import streamData from './stream-data.vue';
import videoShare from './video-share.vue';
import chatSettings from './chat-settings.vue';

</script>

<template>
    <div class="stream-container-wrap">
        <div class="stream-container-container">
            <screen-share/>
            <stream-data/>
            <chat-settings/>
        </div>
        <n-button type="primary"
            :style="{
                display: 'flex',
                justifySelf: 'end',
                marginRight: '16px',
            }"
        >
            Сохранить изменения
        </n-button>
    </div>
</template>

<style>

.stream-container-container{
    display: grid;
    grid-template-columns: 1fr auto 0.65fr;
    padding: 16px;
    width: 100%;
    gap: 16px;
}
</style>