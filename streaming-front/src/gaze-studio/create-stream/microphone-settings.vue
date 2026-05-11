<script setup>
import { NButton } from 'naive-ui'
import { ref, onMounted, onBeforeUnmount } from 'vue'
// State
const isTesting = ref(false)
const isLoading = ref(false)
const hasPermission = ref(false)
const permissionError = ref('')
const microphones = ref([])
const selectedMicrophoneId = ref(null)

// Audio context variables
let mediaStream = null
let audioContext = null
let sourceNode = null
let analyserNode = null

// Methods
const getMicrophones = async () => {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        microphones.value = devices.filter(device => device.kind === 'audioinput')

        // Auto-select first microphone if none selected
        if (microphones.value.length > 0 && !selectedMicrophoneId.value) {
            selectedMicrophoneId.value = microphones.value[0].deviceId
        }
    } catch (err) {
        console.error('Error getting microphones:', err)
    }
}

const changeMicrophone = async () => {
    if (isTesting.value) {
        await stopTest()
        await startTest()
    }
}

const startTest = async () => {
    if (isTesting.value) return

    isLoading.value = true
    permissionError.value = ''

    try {
        const constraints = {
            audio: selectedMicrophoneId.value
                ? { deviceId: { exact: selectedMicrophoneId.value } }
                : true
        }

        mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
        hasPermission.value = true

        isTesting.value = true

    } catch (err) {
        console.error('Error accessing microphone:', err)
        permissionError.value = getErrorMessage(err)
        hasPermission.value = false
    } finally {
        isLoading.value = false
    }
}

const stopTest = async () => {
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop())
        mediaStream = null
    }

    isTesting.value = false
}

const requestPermission = async () => {
    permissionError.value = ''
    await startTest()
}

const getErrorMessage = (err) => {
    switch (err.name) {
        case 'NotAllowedError':
            return 'Доступ к микрофону запрещён. Пожалуйста, разрешите доступ в настройках браузера.'
        case 'NotFoundError':
            return 'Микрофон не найден на вашем устройстве.'
        case 'NotReadableError':
            return 'Микрофон уже используется другим приложением.'
        case 'SecurityError':
            return 'Доступ к микрофону заблокирован из-за политик безопасности.'
        default:
            return err.message || 'Неизвестная ошибка'
    }
}

// Lifecycle
onMounted(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        permissionError.value = 'Ваш браузер не поддерживает доступ к микрофону'
        return
    }

    await getMicrophones()

    navigator.mediaDevices.addEventListener('devicechange', () => {
        getMicrophones()
    })
})

onBeforeUnmount(() => {
    if (isTesting.value) {
        stopTest()
    }
})
</script>

<template>
    <div class="microphone-tester">
        <div class="controls-section">
            <div class="microphone-selector" v-if="microphones.length > 0">
                <label :style="{color: 'var(--white)'}">Выберите микрофон:</label>
                <select v-model="selectedMicrophoneId" :disabled="isTesting" @change="changeMicrophone">
                    <option v-for="mic in microphones" :key="mic.deviceId" :value="mic.deviceId">
                        {{ mic.label || `Микрофон ${mic.deviceId.slice(0, 5)}` }}
                    </option>
                </select>
            </div>

            <div class="action-buttons">
                <n-button @click="startTest" :disabled="isTesting" type="primary">
                    Начать трансляцию
                </n-button>

                <n-button @click="stopTest" :disabled="!isTesting" type="primary">
                    ⏹ Остановить трансляцию
                </n-button>
            </div>
        </div>

        <div class="permission-warning" v-if="permissionError">
            <span class="warning-icon">⚠️</span>
            <div class="warning-text">
                <strong>Ошибка доступа к микрофону:</strong> {{ permissionError }}
                <button @click="requestPermission" class="btn-retry">Повторить запрос</button>
            </div>
        </div>
    </div>
</template>

<style>
.action-buttons{
    display: flex;
    flex-direction: row;
    gap: 16px;
}
</style>