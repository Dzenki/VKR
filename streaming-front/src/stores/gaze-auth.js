import { defineStore } from 'pinia'
import axios from 'axios'
import initRouter from '@/router'

const router = initRouter()

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
        loading: false,
        error: null
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        getUser: (state) => state.user
    },

    actions: {
        // Настройка axios с токеном
        setAuthHeader() {
            if (this.token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
            } else {
                delete axios.defaults.headers.common['Authorization']
            }
        },

        // Регистрация
        async register(userData) {
            this.loading = true
            this.error = null

            try {
                const response = await axios.post('/api/register', userData)

                if (response.data.token) {
                    this.token = response.data.token
                    this.user = response.data.user

                    // Сохраняем в localStorage
                    localStorage.setItem('token', response.data.token)
                    localStorage.setItem('user', JSON.stringify(response.data.user))

                    this.setAuthHeader()
                    router.push('/dashboard')
                }

                return response.data
            } catch (error) {
                this.error = error.response?.data?.message || 'Ошибка регистрации'
                throw error
            } finally {
                this.loading = false
            }
        },

        // Авторизация
        async login(credentials) {
            this.loading = true
            this.error = null

            try {
                const response = await axios.post('/api/login', credentials)

                if (response.data.token) {
                    this.token = response.data.token
                    this.user = response.data.user

                    localStorage.setItem('token', response.data.token)
                    localStorage.setItem('user', JSON.stringify(response.data.user))

                    this.setAuthHeader()
                    router.push('/dashboard')
                }

                return response.data
            } catch (error) {
                this.error = error.response?.data?.message || 'Ошибка авторизации'
                throw error
            } finally {
                this.loading = false
            }
        },

        // Выход
        async logout() {
            try {
                await axios.post('/api/logout')
            } catch (error) {
                console.error('Logout error:', error)
            } finally {
                this.token = null
                this.user = null
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                delete axios.defaults.headers.common['Authorization']
                router.push('/login')
            }
        },

        // Проверка токена
        async checkAuth() {
            if (this.token) {
                this.setAuthHeader()
                try {
                    const response = await axios.get('/api/user')
                    this.user = response.data
                    return true
                } catch (error) {
                    this.logout()
                    return false
                }
            }
            return false
        }
    }
})