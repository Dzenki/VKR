<script setup>
import sidebarForm from './sidebar/sidebar-form.vue';
import headerLayout from './header-layout.vue';
import naiveSidebar from './sidebar/naive-sidebar.vue';
import { useRoute } from 'vue-router';

const route = useRoute()
</script>

<template>
    <div class="studio-layout" v-if="$route.meta.layout === 'studio'">
        <router-view/>
    </div>
    <div class="main-layout" v-if="$route.meta.layout === 'main'">
        <naive-sidebar/>
    </div>
</template>

<style>
.main-layout{
    width: 100vw;
    height: 100vh;
}

.side-bar-form{
    height: calc(100vh - 56px);
    overflow: auto;
}

.main-layout-content{
    background: var(--main-bg-color-alice-blue);
    /* display: flex; */
	/* flex-direction: column; */
	width: 100%;
	/* overflow: auto; */
    /* justify-content: center; */
	/* position: relative; */
    /* height: calc(100vh - 56px); */
    padding: 16px;
}

</style>
