<script setup>
import { NCard, NTabPane, NTabs } from 'naive-ui';
import cutsEmpty from './cuts/cuts.vue';
import liveEmpty from './live/live.vue';
import postsEmpty from './posts/posts.vue';
import playlistsEmpty from './playlists/playlists.vue';
</script>

<template>
    <n-tabs type="line" animated>
        <n-tab-pane name="live" tab="Трансляции">
            <live-empty/>
        </n-tab-pane>
        <n-tab-pane name="posts" tab="Посты">
            <posts-empty/>
        </n-tab-pane>
        <n-tab-pane name="cuts" tab="Cuts">
            <cuts-empty/>
        </n-tab-pane>
        <n-tab-pane name="playlists" tab="Плейлисты">
            <playlists-empty/>
        </n-tab-pane>
    </n-tabs>
</template>

<style>

</style>