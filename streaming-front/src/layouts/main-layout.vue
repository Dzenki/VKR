<script setup>
import sidebarForm from './sidebar/sidebar-form.vue';
import headerLayout from './header-layout.vue';
import naiveSidebar from './sidebar/naive-sidebar.vue';

</script>

<template>
    <div class="main-layout">
        <header-layout/>
        <div class="main-layout-warp">
            <naive-sidebar/>
        </div>
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
    overflow-x: hidden;
}

.main-layout-content{
    background: var(--main-bg-color-alice-blue);
    display: flex;
	flex-direction: column;
	width: 100%;
	overflow: auto;
    /* justify-content: center; */
	position: relative;
    height: calc(100vh - 56px);
    padding: 16px;
}
</style>
