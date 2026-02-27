<script setup>
import { computed, defineAsyncComponent, ref } from 'vue';

const userlogin = ref('')
const userPassword = ref('')
const userEmail = ref('')
const dateOFBirht = ref('')
const currentButton = ref('Зарегистрироваться')


const loginText = 'Под этим именем вас будут знать другие пользователи Gaze. Его можно изменить в любой момент!'
const loginPosition = 'Нажимая «Зарегистрироваться вы подтверждаете свое согласие с условиями ХХХ и принимаете ХХХ»'

function makeFocus(){
    const signField = document.getElementById("sign-field-container");
    signField.style.border = '3px solid var(--main-border-color-deep-space-blue)'
    signField.style.transition = 'border 0.2s'
}

// событие на клик мимо плейсхолдера
document.addEventListener('click', (e) => {
    const targetElement = document.getElementById("sign-field-container");
    if( targetElement && !targetElement.contains(e.target)){
        targetElement.style.borderColor = 'var(--border-color-white-smoky)'
        targetElement.style.transition = 'border 0.2s'
    }
})

function getAuthorized(){

}

</script>

<template>
    <div class="sign-in-wrap">
        <form class="sign-in-form">
            <div class="sign-in-container">
                <div class="sign-field-wrap">
                    <label for="login" class="sign-field-label">Эл. почта</label>
                    <input class="sign-field-login" placeholder="E-mail" v-model="userEmail"
                        id="login" type="text" required autocomplete="email"
                    />
                </div>
                <div class="sign-field-wrap">
                    <label for="login" class="sign-field-label">Имя пользователя</label>
                    <input class="sign-field-login" placeholder="Логин" v-model="userlogin"
                        id="login" type="text" required autocomplete="username"
                    />
                    <span class="sign-up-login-text">{{ loginText }}</span>
                </div>
                <div class="sign-field-wrap">
                    <label for="password" class="sign-field-label">Пароль</label>
                    <div class="sign-field-container" id="sign-field-container">
                        <input class="sign-field-password" @click="makeFocus()" v-model="userPassword" 
                            placeholder="Введите ваш пароль" id="password" type="password" required autocomplete="current-password" 
                            :style="{border: 'none'}"
                        />
                    </div>
                </div>
                <span class="sign-up-login-text" @click="getAuthorized">{{ loginPosition }}</span>
            </div>
            <!-- <div></div> -->
            <button class="sign-button">{{ currentButton }}</button>
        </form>
    </div>
</template>

<style>
.sign-in-form{
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 16px;
}

.sign-in-container{
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.sign-field-wrap{
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.sign-field-label{
    color: var(--main-text-color-deep-space-blue);
    font-weight: var(--font-weight-semi-bold);
    font-size: var(--font-size-fourteen);
    line-height: var(--line-height-large);
}

.sign-field-login{
    color: var(--text-color-pale-state);
    font-weight: var(--font-weight-regular);
    font-size: var(--font-size-fourteen);
    line-height: var(--line-height-large);

    border: solid 2px var(--main-border-color-pale-state);
    border-radius: 12px;
    height: 30px;
    padding: 0px 12px;
    outline: none;
	transition: border 0.1s;
}

.sign-up-login-text{
    color: var(--text-color-pale-state);
    font-weight: var(--font-weight-regular);
    font-size: var(--font-size-ten);
    line-height: var(--line-height-medium);
}

.sign-field-login:focus{
    border: 3px solid var(--main-border-color-deep-space-blue);
}

.sign-field-container{
    border: solid 2px var(--main-border-color-pale-state);
    border-radius: 12px;
    height: 30px;
    width: 100%;
    padding: 0px 12px;

    display: flex;
    justify-content: space-between;
    align-items: center;
}

.sign-field-password{
    color: var(--text-color-pale-state);
    font-weight: var(--font-weight-regular);
    font-size: var(--font-size-fourteen);
    line-height: var(--line-height-large);

    width: 100%;
    border: none;
    outline: none;
	transition: border 0.1s;
}

.sign-field-confirm{
    display: flex;
    flex-direction: row;
    gap: 8px;
}

.sign-info-icon{
    width: 16px;
    height: 16px;
}

.sign-field-check-box-label{
    display: flex;
    flex-direction: row;
    gap: 8px;
}

.sign-check-box-wrap{
    width: 24px;
	height: 24px;
    border-radius: 6px;
    display: flex;
	align-items: center;
    justify-content: center;
}

.sign-button{
    color: var(--main-text-color-deep-space-blue);
    font-weight: var(--font-weight-semi-bold);
    font-size: var(--font-size-fourteen);
    line-height: var(--line-height-large);

    text-align: center;
    height: 30px;
    width: 100%;
}

.sign-button:hover{
    color: var(--main-bg-color-alice-blue);

    background: var(--main-btn-color-emerald);
    border-radius: 12px;
    border: solid 2px var(--bg-color-emerald);

}
</style>