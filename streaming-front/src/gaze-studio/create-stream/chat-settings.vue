<script setup>
import { NButton, NForm, NFormItem, NInput, NSelect, NSwitch } from 'naive-ui';
import { ref } from 'vue';

const formRef = ref(null);
const formValue = ref({

})

const labelThemeOverrides = {
    labelTextColor: 'var(--white)',
    fontWeight: 'var(--font-weight-bold)'
}
const inputThemeOverrides = {
    labelTextColor: 'var(--white)',
    color: 'var(--bg-dark-color-dark-grey)',
    colorFocus: 'var(--bg-dark-color-dark-grey)',
    textColor: 'var(--white)',
}
const formThemeOverrides = {
    
}

</script>

<template>
    <n-form ref="formRef" :model="formValue" :theme-overrides="formThemeOverrides" 
        :style="{
            maxWidth: '440px',
            display: 'flex' ,
            flexDirection: 'column',
            gap: '8px',
        }"
    >
        <span class="chat-settings-name">Настройки чата</span>
        <n-form-item label="Показывать значки модераторов" path="name" :theme-overrides="labelThemeOverrides"
            :style="{
                display: 'flex' ,
                flexDirection: 'row',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '8px',
            }"
        >
            <n-switch size="medium"/>
        </n-form-item>

        <n-form-item label="Показывать мне действия модераторов" path="description" :theme-overrides="labelThemeOverrides"
            :style="{
                display: 'flex' ,
                flexDirection: 'row',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '8px',
            }"
        >
            <n-switch size="medium"/>
        </n-form-item>

        <n-form-item label="Показывать сообщения, отфильтрованные по заблокированным терминам канала" path="notification" :theme-overrides="labelThemeOverrides"
            :style="{
                display: 'flex' ,
                flexDirection: 'row',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '8px',
            }"
        >
            <n-switch size="medium"/>
        </n-form-item>

        <n-form-item label="Показывать удаленные сообщения" path="category" :theme-overrides="labelThemeOverrides"
            :style="{
                display: 'flex' ,
                flexDirection: 'row',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '8px',
            }"
        >
            <n-switch size="medium"/>
        </n-form-item>

        <n-form-item label="Приостановка чата" path="tags" :theme-overrides="labelThemeOverrides"
            :style="{
                display: 'flex' ,
                flexDirection: 'row',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '8px',
            }"
        >
            <n-switch size="medium"/>
        </n-form-item>

        <n-form-item label="Автоматическое объявление текста с экрана" path="language" :theme-overrides="labelThemeOverrides"
            :style="{
                display: 'flex' ,
                flexDirection: 'row',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '8px',
            }"
        >
            <n-switch size="medium"/>
        </n-form-item>
    </n-form>
</template>

<style>

.chat-settings-name{
    color: var(--white);
    font-weight: var(--font-weight-medium);
    font-size: var(--font-size-eighteen);
    line-height: var(--line-height-large);
    padding-bottom: 13px;
}

.n-form-item .n-form-item-blank {
    display: flex !important;
    /* width: 100% !important; */
    justify-content: end !important;
    align-self: flex-start;
}

.n-form-item.n-form-item--top-labelled .n-form-item-label{
    width: 100%;
}
</style>