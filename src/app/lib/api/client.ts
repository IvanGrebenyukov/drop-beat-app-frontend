// Создаем экземпляр axios с базовыми настройками
import axios from 'axios'

const apiClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7158/api',
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Интерсептор для автоматической подстановки JWT токена
apiClient.interceptors.request.use((config) => {
	if (typeof window !== 'undefined') {
		const token = localStorage.getItem('accessToken');
		console.log('Interceptor token:', token); // Для отладки
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
	}
	return config;
});

// Интерсептор для обработки ошибок
apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		// Обработка 401 ошибки (неавторизован)
		if (error.response?.status === 401) {
			localStorage.removeItem('accessToken');
			window.location.href = '/login';
		}
		return Promise.reject(error);
	}
);

export default apiClient;