<script setup>
import { ref } from 'vue';


const videoPlayer = ref(null)
const isSharing = ref(false)
let screenStream = null;

const startScreenShare = async () => {
    try{
        screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true
        });

        videoPlayer.value.srcObject = screenStream;
        isSharing.value = true;

        screenStream.getVideoTracks()[0].onended = () => {
            stopScreenShare();
        }
    } catch (err) {
        console.error("Ошибка захвата экрана:", err)
    }
}

const stopScreenShare = () => {
    if (screenStream) {
        screenStream.getTracks().forEach(track => track.spot());
        videoPlayer.value.srcObject = null;
        isSharing.value = false;
    }
}
</script>

<template>
    <div class="while-color">ЗДЕСЬ БУДЕТ ТРАНСЛЯЦИЯ ЭКРАНА</div>
    <div>
        <button @click="startScreenShare" :disabled="isSharing" class="while-color">Начать трасляцию</button>
        <br/>
        <button @click="stopScreenShare" :disabled="!isSharing" class="while-color">Остановить трансляцию</button>
        <br/>
        <video ref="videoPlayer" autoplay playsinline muted></video>
    </div>
</template>

<style>
.while-color{
    color: white;
}

video{
    width: 100%;
    max-width: 600px;
    
}
</style>