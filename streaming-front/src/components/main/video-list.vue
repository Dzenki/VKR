<script setup>
import videoPreview from './video-preview.vue';

</script>

<template>
    <div class="template">
        <div v-for="value in 8 ">
            <video-preview/>
        </div>
    </div>

</template>

<style>
.template{
    padding: 16px;
    display: grid;
    grid-template-rows: repeat(auto, auto);
    gap: 16px;
}



/* Мобильные устройства */
@media (max-width: 640px) {
    .template {
        grid-template-columns: repeat(1, 1fr);
    }
}

/* Планшеты */
@media (min-width: 641px) and (max-width: 768px) {
    .template {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* Ноутбуки */
@media (min-width: 769px) and (max-width: 1024px) {
    .template {
        grid-template-columns: repeat(3, 1fr);
    }
}

/* Десктопы */
@media (min-width: 1025px) {
    .template {
        grid-template-columns: repeat(4, 1fr);
    }
}
</style>