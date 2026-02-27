<script setup>

const props = defineProps({
    sidebarItems: {
        type: Array,
        required: true
    },
    iconMap: {
        type: Object,
        required: true
    },
    show: {
        type: Boolean,
        required: false,
        defult: true
    },
    mainIcon: {
        type: Object,
        default: () => {}
    }
})

const showIcons = ref(false)

watch (() => props.show, (val) => {
    if (val) {
        setTimeout(() => {showIcons.value = true}, 10)
    }
    else {
        showIcons.value = false
    }
}, {immediate: true})

</script>

<template>
    <nav class="side-bar-short">
        <div class="side-bar-short-wrap" v-if="props.show || showIcons">
            <router-link v-for="item in sidebarItems" :key="item.title"
                :to="item.link">
                <component :is="iconMap[item.icon]" />
            </router-link>
        </div>
    </nav>
</template>

<style>

</style>