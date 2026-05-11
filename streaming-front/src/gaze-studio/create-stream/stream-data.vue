<script setup>
import { NButton, NForm, NFormItem, NInput, NSelect } from 'naive-ui';
import { ref } from 'vue';

const formRef = ref(null);
const formValue = ref({
    name: "",
    description: "",
    notification: "",
    category: "",
    tags: [],
    language: "",

})

const labelThemeOverrides = {
    labelTextColor: 'var(--white)',
    fontWeight: 'var(--font-weight-bold)'
}
const inputThemeOverrides = {
    labelTextColor: 'var(--white)',
    color: 'var(--bg-dark-color-dark-grey)',
    colorFocus: 'var(--bg-dark-color-dark-grey)',
    textColor: 'var(--white)'
}


</script>

<template>
    <n-form ref="formRef" :model="formValue" :theme-overrides="formThemeOverrides" 
        :style="{
            maxWidth: '440px'
        }"

    >
        <span class="stream-data-name">Изменить данные трансляции</span>
        <n-form-item label="Название" path="name" :theme-overrides="labelThemeOverrides">
            <n-input :theme-overrides="inputThemeOverrides" 
                placeholder="Введите название" 
                maxlength="140" 
                show-count 
                v-model:value="formValue.name"
            />
        </n-form-item>

        <n-form-item label="Описание" path="description" :theme-overrides="labelThemeOverrides">
            <n-input :theme-overrides="inputThemeOverrides" placeholder="Введите описание" type="textarea"
                maxlength="500" show-count 
                v-model:value="formValue.description"
            />
        </n-form-item>

        <n-form-item label="Уведомление о трансляции" path="notification" :theme-overrides="labelThemeOverrides">
            <n-input :theme-overrides="inputThemeOverrides" placeholder="Приходите на трансляцию)" maxlength="115"
                show-count  
                v-model:value="formValue.notification"
            />
        </n-form-item>

        <n-form-item label="Категория" path="category" :theme-overrides="labelThemeOverrides">
            <n-input :theme-overrides="inputThemeOverrides" placeholder="Выберите категорию" 
                v-model:value="formValue.category"
            />
        </n-form-item>

        <n-form-item label="Теги" path="tags" :theme-overrides="labelThemeOverrides">
            <n-input :theme-overrides="inputThemeOverrides" placeholder="Укажите теги"
                v-model:value="formValue.tags" 
            />
        </n-form-item>

        <n-form-item label="Язык трансляции" path="language" :theme-overrides="labelThemeOverrides">
            <n-input :theme-overrides="inputThemeOverrides" placeholder="Выберите язык трансляции"
                v-model:value="formValue.language" 
            />
        </n-form-item>
        <n-button type="primary" :style="{
            display: 'flex',
            justifySelf: 'right',

        }">
            Сохранить изменения
        </n-button>
    </n-form>
</template>

<style >
.stream-data-name{
    color: var(--white);
    font-weight: var(--font-weight-medium);
    font-size: var(--font-size-eighteen);
    line-height: var(--line-height-large);
}

.n-form-item.n-form-item--top-labelled {
    display: grid;
    grid-template-columns: 0.75fr 1.5fr;
    grid-template-rows: 4px auto auto;
    align-items: start;
    gap: 8px;
}

.n-form-item.n-form-item--top-labelled>label {
    grid-row: 2;
    grid-column: 1;
}

.n-form-item.n-form-item--top-labelled>div {
    grid-column: 2;
}

.n-input .n-input__border,
.n-input .n-input__state-border {
    border: 1px solid var(--white);

}

.n-form-item .n-form-item-label {
    font-weight: 600;
}
</style>