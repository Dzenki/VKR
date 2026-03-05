<script setup>
import { NForm } from 'naive-ui';
import { NFormItem } from 'naive-ui';
import { NInput } from 'naive-ui';
import { useMessage } from "naive-ui";
import { NMessageProvider } from 'naive-ui';

import { ref } from "vue";

const formRef = ref(null);
const rPasswordFormItemRef = ref(null);

const message = useMessage();

const modelRef = ref({
    email: null,
    password: null,
});

const rules = {
    email: [
        {
            required: true,
        }
    ],
    password: [
        {
            required: true,
            message: "Password is required"
        }
    ],
};

function handlePasswordInput() {
    if (modelRef.value.reenteredPassword) {
        rPasswordFormItemRef.value?.validate({ trigger: "password-input" });
    }
}

function handleValidateButtonClick(e) {
    e.preventDefault();
    formRef.value?.validate((errors) => {
        if (!errors) {
        message.success("Valid");
        } else {
        console.log(errors);
        message.error("Invalid");
        }
    });
}

</script>

<template>
    <n-message-provider>
        <n-form ref="formRef" :model="modelRef" :rules="rules">
            <n-form-item path="email" label="Эл. почта" class="sign-form-item-label">
                <n-input placeholder="E-mail"
                    v-model:value="modelRef.email" type="email"
                    @keydown.enter.prevent
                />
            </n-form-item>

            <n-form-item path="password" label="Пароль" class="sign-form-item-label">
                <n-input placeholder="Password"
                    v-model:value="modelRef.password"
                    type="password"
                    show-password-on="mousedown"
                    @input="handlePasswordInput"
                    @keydown.enter.prevent
                />
            </n-form-item>

            <n-button
                :disabled="modelRef.email === null"
                round class="sign-form-confirm-btn"
                type="primary"
                @click="handleValidateButtonClick"
            >
                Войти
            </n-button>
        </n-form>
    </n-message-provider>
</template>

<style>
.sign-form-item-label label span{
    color: var(--main-text-color-deep-space-blue);
    font-weight: var(--font-weight-semi-bold);
    font-size: var(--font-size-fourteen);
    line-height: var(--line-height-large);
}

.sign-form-confirm-btn:hover{
    color: var(--text-color-white);
    font-weight: var(--font-weight-semi-bold);
    font-size: var(--font-size-fourteen);
    line-height: var(--line-height-large);

    display: flex;
    justify-content: center;

    background-color: var(--main-btn-color-emerald);
    height: 34px;
    align-items: anchor-center;
    border-radius: 3px;
    border: solid 1px var(--border-color-emerald);
}

.sign-form-confirm-btn {
    color: var(--text-color-grey);
    font-weight: var(--font-weight-semi-bold);
    font-size: var(--font-size-fourteen);
    line-height: var(--line-height-large);

    display: flex;
    justify-content: center;

    background-color: var(--btn-color-light-grey);
    height: 34px;
    align-items: anchor-center;
    border-radius: 3px;
    border: solid 1px var(--btn-color-light-grey);

}

</style>