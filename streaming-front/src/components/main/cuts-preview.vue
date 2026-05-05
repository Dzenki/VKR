<script setup>
import { usePluralize } from '@/composables/usePluralize';
import { NIcon, NSkeleton } from 'naive-ui';
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
        <n-skeleton class="cut-preview-skeleton" :sharp="false"/>
        <div class="cut-preview-text-wrap">
            <div class="cut-preview-text-container">
                <div class="cut-preview-name-wrap">
                    <span class="cut-preview-name-text">
                        {{ cutName }} 
                        <span>{{ hashTags }}</span>
                    </span>
                    
                </div>
                
                <span> {{formatWithCount(viewsCount, ['просмотр', 'просмотра', 'просмотров'])}}</span>
            </div>
            <n-icon size="18"><horisontalIcon/></n-icon>
            
        </div>
    </div>
</template>

<style>
.cut-preview-wrap{
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.cut-preview-skeleton{
    width: 100%;
    height: 0;
    padding-top: 150%;
}

.cut-preview-text-wrap{
    display: grid;
    grid-template-columns: repeat(2, auto);
}

.cut-preview-name-wrap{
    width: 100%;
}

.cut-preview-name-text{
    color: var(--main-text-color-deep-space-blue);
    font-size: var(--font-size-fourteen);
    font-weight: var(--font-weight-semi-bold);
    line-height: var(--line-height-small);

    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    text-overflow: ellipsis;
    overflow: hidden;
    -webkit-box-orient: vertical
}
</style>