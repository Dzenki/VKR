<script setup>
import cutsPreview from './cuts-preview.vue';

</script>

<template>
    <div class="cuts-template">
        <div v-for="value in 5">
            <cuts-preview/>
        </div>
    </div>
</template>

<style>
.cuts-template{
    padding: 16px;
    display: flex;
    flex-direction: row;
    gap: 16px;
}
</style>