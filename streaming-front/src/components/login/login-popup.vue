<script setup>
import { inject, ref } from 'vue';
import sign from './sign.vue';

const signType = inject('signType')

const signUpText = 'У вас нет учетной записи? Зарегистрируйтесь!'
const signInText = 'Есть учетная запичь? Войти'
const currentButton = ref('')

// changeCurrentButton()

// function changeCurrentButton(){
//     if (signType.value === 'Вход'){
//         currentButton.value = 'Войти'
//         signType.value = 'Регитрация'
//     }
//     else if (signType.value === 'Регистрация'){
//         currentButton.value = 'Зарегистрироваться'
//         signType.value = 'Вход'
//     }
// }


</script>

<template>
    <div class="login-popup">
        <sign />
        <!-- <button @click="changeCurrentButton">{{ currentButton }}</button> -->
        <router-link to="/">
            <button class="login-popup-return-btn">Вернуться к просмотру</button>
        </router-link>
        
    </div>
</template>

<style>
.login-popup{
    max-width: 400px;
}

.login-popup-return-btn{
    color: var(--main-text-color-deep-space-blue);
    font-weight: var(--font-weight-semi-bold);
    font-size: var(--font-size-fourteen);
    line-height: var(--line-height-large);

    text-align: center;
    height: 30px;
    width: 100%;
}

.login-popup-return-btn:hover{
    color: var(--main-bg-color-alice-blue);

    background: var(--main-btn-color-emerald);
    border-radius: 12px;
    border: solid 2px var(--bg-color-emerald);

}
</style>