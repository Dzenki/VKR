<script setup>
import { ref } from 'vue';


const categoriesList = [
    {
        name: 'Все',
        banner: '',
        code: '',
    },
    {
        name: 'Общение',
        banner: '',
        code: '',
    },
    {
        name: 'Honkai: Star Rail',
        banner: '',
        code: '',
    },
    {
        name: 'Genshin Impact',
        banner: '',
        code: '',
    },
    {
        name: 'League of Legends',
        banner: '',
        code: '',
    },
    {
        name: 'Minecraft',
        banner: '',
        code: '',
    },
    {
        name: 'Zenless Zone Zero',
        banner: '',
        code: '',
    },
]

// TODO: все что относится к categoriesList будет приходить как словарь.

</script>

<template>
    <div class="tag-slider-wrap">
        <div v-for="category in categoriesList" class="tag-slider-category-container">
            <span class="tag-slider-category-name" :class="{active: isChecked}">{{ category.name }}</span>
        </div>
    </div>
    
</template>

<style>
.tag-slider-wrap{
    display: flex;
    flex-direction: row;
    gap: 8px;
    padding: 16px;
}
</style>