<script setup>
import sidebarForm from './sidebar/sidebar-form.vue';
import headerLayout from './header-layout.vue';

</script>

<template>
    <div class="main-layout">
        <header-layout/>
        <div class="main-layout-warp">
            <div class="side-bar-form">
                <sidebar-form/>
            </div>
            <div class="main-layout-content">
                <router-view/>
            </div>
        </div>
    </div>
</template>

<style>
.main-layout{
    position: relative;
    display: flex;
    flex-direction: column;
}

.main-layout-warp{
    display: flex;
    flex-direction: row;
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
