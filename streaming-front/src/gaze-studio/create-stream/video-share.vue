<script setup>
import { NButton } from 'naive-ui';
import { ref } from 'vue';

const videoPlayer = ref(null)
const isSharing = ref(false)
const isLoading = ref(false)
let cameraStream = null;

const startCamera = async () => {
    try {
        isLoading.value = true;
        
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false // Для камеры обычно аудио не нужно
        });

        videoPlayer.value.srcObject = cameraStream;
        isSharing.value = true;

        cameraStream.getVideoTracks()[0].onended = () => {
            stopCamera();
        }
    } catch (err) {
        console.error("Ошибка захвата камеры:", err);
        
        // Обработка различных ошибок
        if (err.name === 'NotAllowedError') {
            alert('Доступ к камере запрещён. Пожалуйста, разрешите доступ в настройках браузера.');
        } else if (err.name === 'NotFoundError') {
            alert('Камера не найдена на вашем устройстве.');
        } else if (err.name === 'NotReadableError') {
            alert('Камера уже используется другим приложением.');
        } else {
            alert(`Ошибка: ${err.message}`);
        }
    } finally {
        isLoading.value = false;
    }
}

const stopCamera = () => {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        videoPlayer.value.srcObject = null;
        isSharing.value = false;
    }
}
</script>

<template>
    <div class="camera-share-wrap">
        <video ref="videoPlayer" autoplay playsinline muted></video>
        <div class="camera-button-container">
            <n-button 
                type="primary"
                @click="startCamera" 
                :disabled="isSharing || isLoading"
                :loading="isLoading"
            >
                {{ isLoading ? 'Загрузка...' : 'Начать трансляцию с камеры' }}
            </n-button>

            <n-button 
                type="primary"
                @click="stopCamera" 
                :disabled="!isSharing"
            >
                Остановить трансляцию
            </n-button>
        </div>
    </div>
</template>

<style scoped>
.camera-share-wrap{
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.camera-button-container{
    display: flex;
    flex-direction: row;
    gap: 16px;
    justify-content: end;
}

video{
    width: 100%;
    background-color: rgb(13, 12, 12);
    aspect-ratio: 16 / 9;
    border-radius: 8px;
}
</style>