<script setup>
import { usePluralize } from '@/composables/usePluralize';
import { NSkeleton } from 'naive-ui';
import { computed, defineAsyncComponent } from 'vue';


const { formatWithCount } = usePluralize()

/**0 просмотров 1 просмотр 2 просмотра */

const props = defineProps({
    cutName: {
        type: String,
        default: 'Без имени, потом будет редактироваться'
    },
    hashTags: {
        type: Array,
        default: () => ['#first', '#second', '#third', '#etc']
    },
    cutBanner: {
        type: String,
        default: null
    },
    viewsCount: {
        type: Number,
        default: 0
    }
})

// TODO: cuts, как и video дополнительно имеют в пропсах имя автора, 
// TODO: описание, лого автора, покл-во отметок нравится, дата, просмотры и тд
// См ютуб или твич. На данный момент достаточно только того, что написанно, но потом нужно будет довативь дополнительные props

const horisontalIcon = computed(() => {
    return defineAsyncComponent(() => import(`@/assets/img/svg/three-dots-icon.vue`))
})

</script>

<template>
    <div class="cut-preview-wrap">
        <div></div>
        <div class="cut-preview-text-wrap">
            <div class="cut-preview-text-container">
                <span>{{ cutName }}</span>
                <span>{{ hashTags }}</span>
                <span>{{ viewsCount }}</span>
            </div>
        </div>
    </div>
</template>

<style>

</style>