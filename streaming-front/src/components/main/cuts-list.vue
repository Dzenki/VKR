<script setup>
import { computed, defineAsyncComponent } from 'vue';
import cutsPreview from './cuts-preview.vue';
import { NIcon } from 'naive-ui';

const scissorsIcon = computed(() => {
    return defineAsyncComponent(() => import('@/assets/img/svg/scissors-icon.vue'))
})

const horisontalIcon = computed(() => {
    return defineAsyncComponent(() => import('@/assets/img/svg/three-dots-icon.vue'))
})

</script>

<template>
    <div class="cuts-list-header-wrap">
        <div class="cuts-list-header-wrap">
            <n-icon size="24"color="var(--main-btn-color-emerald)"><scissorsIcon/></n-icon>
            &nbsp
            <span class="cuts-list-header-text">Клипы</span>
        </div>
        <n-icon size="24"><horisontalIcon/></n-icon>
        
    </div>
    <div class="cuts-template">
        <div v-for="value in 7">
            <cuts-preview/>
        </div>
    </div>
</template>

<style>
.cuts-list-header-wrap{
    padding: 0px 16px ;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.cuts-list-header-text{
    color: var(--main-text-color-deep-space-blue);
    font-size: var(--font-size-twenty-four);
    font-weight: var(--font-weight-semi-bold);
    line-height: var(--line-height-absolute);
}

.cuts-template{
    padding: 16px;
    display: flex;
    flex-direction: row;
    gap: 16px;
}
</style>