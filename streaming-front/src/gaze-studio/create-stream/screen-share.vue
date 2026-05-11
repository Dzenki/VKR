<script setup>
import { NButton, NSwitch, NSpace, NTag, NSelect, NSlider, NProgress, NAlert } from 'naive-ui';
import { ref, watch, onUnmounted, onMounted } from 'vue';

const videoPlayer = ref(null)
const isSharing = ref(false)
const cameraEnabled = ref(false)
const mirrorCamera = ref(false)
const cameraPosition = ref('top-right') // top-right, top-left, bottom-right, bottom-left
const cameraSize = ref(25) // размер в процентах (25% от ширины экрана)
const microphoneEnabled = ref(false)
const microphoneVolume = ref(0)
const microphoneTestActive = ref(false)
let screenStream = null;
let cameraStream = null;
let combinedStream = null;
let animationId = null;
let audioContext = null;
let microphoneStream = null;
let sourceNode = null;
let analyserNode = null;

// Позиции камеры
const positionOptions = [
    { label: 'Верхний правый угол', value: 'top-right' },
    { label: 'Верхний левый угол', value: 'top-left' },
    { label: 'Нижний правый угол', value: 'bottom-right' },
    { label: 'Нижний левый угол', value: 'bottom-left' }
];

// Функция для объединения потоков экрана и камеры
const combineStreams = () => {
    if (!screenStream) return null;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const screenVideo = document.createElement('video');
    const cameraVideo = document.createElement('video');
    
    screenVideo.srcObject = screenStream;
    if (cameraStream) {
        cameraVideo.srcObject = cameraStream;
    }
    
    screenVideo.muted = true;
    cameraVideo.muted = true;
    
    screenVideo.play();
    if (cameraVideo) cameraVideo.play();
    
    const draw = () => {
        if (!screenVideo.videoWidth || !screenVideo.videoHeight) {
            requestAnimationFrame(draw);
            return;
        }
        
        canvas.width = screenVideo.videoWidth;
        canvas.height = screenVideo.videoHeight;
        
        // Рисуем видео с экрана
        ctx.drawImage(screenVideo, 0, 0, canvas.width, canvas.height);
        
        // Если камера включена и есть видео, рисуем её поверх
        if (cameraEnabled.value && cameraStream && cameraVideo.videoWidth) {
            const cameraWidth = canvas.width * (cameraSize.value / 100);
            const cameraHeight = cameraVideo.videoHeight * (cameraWidth / cameraVideo.videoWidth);
            const margin = 20;
            
            let x, y;
            
            // Определяем позицию камеры
            switch(cameraPosition.value) {
                case 'top-left':
                    x = margin;
                    y = margin;
                    break;
                case 'bottom-right':
                    x = canvas.width - cameraWidth - margin;
                    y = canvas.height - cameraHeight - margin;
                    break;
                case 'bottom-left':
                    x = margin;
                    y = canvas.height - cameraHeight - margin;
                    break;
                default: // top-right
                    x = canvas.width - cameraWidth - margin;
                    y = margin;
            }
            
            // Рисуем тень
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 10;
            
            // Рисуем рамку
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, cameraWidth, cameraHeight);
            
            // Рисуем фон рамки (для красоты)
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(x, y, cameraWidth, cameraHeight);
            
            // Сбрасываем тень для видео
            ctx.shadowBlur = 0;
            
            // Применяем зеркальное отображение если нужно
            if (mirrorCamera.value) {
                ctx.save();
                ctx.translate(x + cameraWidth, y);
                ctx.scale(-1, 1);
                ctx.drawImage(cameraVideo, 0, 0, cameraWidth, cameraHeight);
                ctx.restore();
            } else {
                ctx.drawImage(cameraVideo, x, y, cameraWidth, cameraHeight);
            }
            
            // Добавляем надпись "Камера"
            ctx.font = 'bold 12px Arial';
            ctx.fillStyle = 'white';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 2;
            ctx.fillText('📷 Камера', x + 5, y + 20);
            ctx.shadowBlur = 0;
        }
        
        animationId = requestAnimationFrame(draw);
    };
    
    screenVideo.addEventListener('loadedmetadata', () => {
        if (animationId) cancelAnimationFrame(animationId);
        draw();
    });
    
    const stream = canvas.captureStream(30);
    
    // Добавляем аудио из экрана, если есть
    if (screenStream.getAudioTracks().length > 0) {
        stream.addTrack(screenStream.getAudioTracks()[0]);
    }
    
    // Добавляем аудио из микрофона, если включен
    if (microphoneEnabled.value && microphoneStream) {
        microphoneStream.getAudioTracks().forEach(track => {
            stream.addTrack(track);
        });
    }
    
    return stream;
}

// Обновление композитного потока
const updateCompositeStream = () => {
    if (!videoPlayer.value) return;
    
    if (isSharing.value && screenStream) {
        const newStream = combineStreams();
        if (newStream) {
            if (combinedStream) {
                combinedStream.getTracks().forEach(track => track.stop());
            }
            combinedStream = newStream;
            videoPlayer.value.srcObject = combinedStream;
        }
    }
}

// Инициализация проверки микрофона
const initMicrophoneTest = async () => {
    if (!microphoneTestActive.value) return;
    
    try {
        if (audioContext) {
            await audioContext.close();
        }
        
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyserNode = audioContext.createAnalyser();
        analyserNode.fftSize = 256;
        
        const testStream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });
        
        sourceNode = audioContext.createMediaStreamSource(testStream);
        sourceNode.connect(analyserNode);
        sourceNode.connect(audioContext.destination);
        
        audioContext.resume();
        
        const dataArray = new Uint8Array(analyserNode.frequencyBinCount);
        
        const updateVolume = () => {
            if (!microphoneTestActive.value) return;
            
            analyserNode.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
            }
            let avg = sum / dataArray.length;
            let volume = Math.min(100, (avg / 255) * 100);
            microphoneVolume.value = Math.floor(volume);
            
            requestAnimationFrame(updateVolume);
        };
        
        updateVolume();
        
        // Сохраняем поток для возможного использования в трансляции
        microphoneStream = testStream;
        
    } catch (err) {
        console.error("Ошибка доступа к микрофону:", err);
        microphoneVolume.value = -1;
    }
};

const stopMicrophoneTest = () => {
    microphoneTestActive.value = false;
    microphoneVolume.value = 0;
    
    if (sourceNode) {
        sourceNode.disconnect();
        sourceNode = null;
    }
    
    if (analyserNode) {
        analyserNode.disconnect();
        analyserNode = null;
    }
    
    if (audioContext) {
        audioContext.close();
        audioContext = null;
    }
    
    // Не останавливаем microphoneStream, если он используется в трансляции
    if (!microphoneEnabled.value && microphoneStream) {
        microphoneStream.getTracks().forEach(track => track.stop());
        microphoneStream = null;
    }
};

const startMicrophoneForBroadcast = async () => {
    try {
        if (!microphoneStream) {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true
            });
            microphoneStream = stream;
        }
        
        if (isSharing.value) {
            updateCompositeStream();
        }
    } catch (err) {
        console.error("Ошибка доступа к микрофону для трансляции:", err);
    }
};

const stopMicrophoneForBroadcast = () => {
    if (!microphoneTestActive.value && microphoneStream) {
        microphoneStream.getTracks().forEach(track => track.stop());
        microphoneStream = null;
        
        if (isSharing.value) {
            updateCompositeStream();
        }
    }
};

const startCamera = async () => {
    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        });
        
        cameraEnabled.value = true;
        
        if (isSharing.value) {
            updateCompositeStream();
        }
    } catch (err) {
        console.error("Ошибка захвата камеры:", err)
    }
}

const stopCamera = () => {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
        cameraEnabled.value = false;
        
        if (isSharing.value) {
            updateCompositeStream();
        }
    }
}

const startScreenShare = async () => {
    try {
        screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: false // Берем только видео с экрана, аудио будет с микрофона
        });

        if (cameraEnabled.value && cameraStream) {
            updateCompositeStream();
        } else {
            videoPlayer.value.srcObject = screenStream;
        }
        
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
        screenStream.getTracks().forEach(track => track.stop());
        screenStream = null;
        
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        
        if (combinedStream) {
            combinedStream.getTracks().forEach(track => track.stop());
            combinedStream = null;
        }
        
        if (cameraEnabled.value && cameraStream) {
            videoPlayer.value.srcObject = cameraStream;
        } else {
            videoPlayer.value.srcObject = null;
        }
        
        isSharing.value = false;
    }
}

// Очистка при размонтировании
onUnmounted(() => {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
    }
    if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
    }
    if (combinedStream) {
        combinedStream.getTracks().forEach(track => track.stop());
    }
    if (microphoneStream) {
        microphoneStream.getTracks().forEach(track => track.stop());
    }
    stopMicrophoneTest();
});

watch(cameraEnabled, (newVal) => {
    if (newVal && !cameraStream) {
        startCamera();
    } else if (!newVal && cameraStream) {
        stopCamera();
    }
});

watch(microphoneEnabled, (newVal) => {
    if (newVal) {
        startMicrophoneForBroadcast();
    } else {
        stopMicrophoneForBroadcast();
    }
});

watch([mirrorCamera, cameraPosition, cameraSize], () => {
    if (isSharing.value && cameraEnabled.value) {
        updateCompositeStream();
    }
});

watch(microphoneTestActive, (newVal) => {
    if (newVal) {
        initMicrophoneTest();
    } else {
        stopMicrophoneTest();
    }
});

onMounted(() => {
    // Инициализация
});
</script>

<template>
    <div class="screen-share-wrap">
        <span class="stream-data-name">Настройка видео</span>
        <video ref="videoPlayer" autoplay playsinline muted></video>
        
        <div class="controls-wrapper">
            <div class="camera-controls">
                <NSpace vertical :size="12">
                    <div class="control-group">
                        <NTag :type="cameraEnabled ? 'success' : 'default'">
                            {{ cameraEnabled ? 'Камера включена' : 'Камера выключена' }}
                        </NTag>
                        <NSwitch 
                            v-model:value="cameraEnabled"
                            :loading="cameraEnabled && !cameraStream"
                        >
                            <template #checked>
                                Вкл
                            </template>
                            <template #unchecked>
                                Выкл
                            </template>
                        </NSwitch>
                    </div>

                    <div v-if="cameraEnabled" class="camera-settings">
                        <div class="setting-item">
                            <span class="setting-label">Зеркальное отражение:</span>
                            <NSwitch v-model:value="mirrorCamera">
                                <template #checked>
                                    Вкл
                                </template>
                                <template #unchecked>
                                    Выкл
                                </template>
                            </NSwitch>
                        </div>

                        <div class="setting-item">
                            <span class="setting-label">Позиция камеры:</span>
                            <NSelect 
                                v-model:value="cameraPosition"
                                :options="positionOptions"
                                size="small"
                                style="width: 180px"
                            />
                        </div>

                        <div class="setting-item">
                            <span class="setting-label">Размер камеры: {{ cameraSize }}%</span>
                            <NSlider 
                                v-model:value="cameraSize"
                                :min="10"
                                :max="40"
                                :step="5"
                                style="width: 200px"
                            />
                        </div>
                    </div>

                    <!-- Секция микрофона -->
                    <div class="microphone-section">
                        <div class="control-group">
                            <NTag :type="microphoneEnabled ? 'success' : 'default'">
                                {{ microphoneEnabled ? 'Микрофон в трансляции' : 'Микрофон выключен' }}
                            </NTag>
                            <NSwitch 
                                v-model:value="microphoneEnabled"
                            >
                                <template #checked>
                                    Вкл
                                </template>
                                <template #unchecked>
                                    Выкл
                                </template>
                            </NSwitch>
                        </div>

                        <div class="control-group" style="margin-top: 8px;">
                            <NTag :type="microphoneTestActive ? 'info' : 'default'">
                                Тест микрофона
                            </NTag>
                            <NSwitch 
                                v-model:value="microphoneTestActive"
                            >
                                <template #checked>
                                    Вкл
                                </template>
                                <template #unchecked>
                                    Выкл
                                </template>
                            </NSwitch>
                        </div>

                        <!-- Индикатор уровня громкости -->
                        <div v-if="microphoneTestActive" class="volume-meter">
                            <div class="volume-label">
                                <span>Уровень громкости:</span>
                                <span class="volume-value">{{ microphoneVolume }}%</span>
                            </div>
                            <div class="volume-bar-container">
                                <div 
                                    class="volume-bar" 
                                    :style="{ 
                                        width: microphoneVolume + '%',
                                        background: microphoneVolume > 70 ? '#ff4444' : (microphoneVolume > 30 ? '#ffaa44' : '#44ff44')
                                    }"
                                ></div>
                            </div>
                            <div v-if="microphoneVolume === -1" class="microphone-error">
                                <NAlert type="error" :show-icon="true">
                                    Не удалось получить доступ к микрофону. Пожалуйста, проверьте разрешения.
                                </NAlert>
                            </div>
                            <div v-else-if="microphoneTestActive" class="microphone-hint">
                                <small>Говорите в микрофон, чтобы увидеть уровень громкости</small>
                            </div>
                        </div>

                        <div v-if="microphoneEnabled && !microphoneTestActive" class="microphone-hint">
                            <small>Микрофон будет добавлен к трансляции экрана</small>
                        </div>
                    </div>
                </NSpace>
            </div>
            
            <div class="screen-share-button-container">
                <NButton 
                    type="primary"
                    @click="startScreenShare" 
                    :disabled="isSharing"
                >
                    Начать трансляцию
                </NButton>

                <NButton 
                    type="error"
                    @click="stopScreenShare" 
                    :disabled="!isSharing"
                >
                    Остановить трансляцию
                </NButton>
            </div>
        </div>
    </div>
</template>

<style scoped>
.screen-share-wrap {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

video {
    width: 100%;
    background-color: rgb(13, 12, 12);
    aspect-ratio: 16 / 9;
    border-radius: 8px;
    object-fit: contain;
}

.controls-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 16px;
}

.camera-controls {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    padding: 16px;
    border-radius: 12px;
    flex: 1;
    min-width: 280px;
}

.control-group {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
}

.camera-settings {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.microphone-section {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.setting-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    gap: 12px;
    flex-wrap: wrap;
}

.setting-label {
    color: white;
    font-size: 13px;
    font-weight: 500;
}

.volume-meter {
    margin-top: 12px;
    padding: 10px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 8px;
}

.volume-label {
    display: flex;
    justify-content: space-between;
    color: white;
    font-size: 12px;
    margin-bottom: 8px;
}

.volume-value {
    font-weight: bold;
    font-family: monospace;
}

.volume-bar-container {
    width: 100%;
    height: 8px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 8px;
}

.volume-bar {
    height: 100%;
    transition: width 0.1s ease;
    border-radius: 4px;
}

.microphone-hint {
    color: #aaa;
    font-size: 11px;
    margin-top: 8px;
    text-align: center;
}

.microphone-error {
    margin-top: 8px;
}

.screen-share-button-container {
    display: flex;
    flex-direction: row;
    gap: 16px;
    align-items: flex-start;
}
</style>