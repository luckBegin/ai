import axios, {AxiosInstance} from 'axios';
import {sessionService} from "./session";

declare module '@vue/runtime-core' {
	interface ComponentCustomProperties {
		$axios: AxiosInstance;
		$api: AxiosInstance;
	}
}
const api = axios.create({
});
// 添加响应拦截器
api.interceptors.response.use(
	response => response.data, // 直接返回data
	error => {
		const responseErr = error.response.data
		//
		// if(responseErr.code<500){
		// 	Notify.create({
		// 		type: "negative",
		// 		position: 'top',
		// 		message: responseErr.message
		// 	})
		// } else {
		// 	Notify.create({
		// 		type: "negative",
		// 		position: 'top',
		// 		message: '服务异常'
		// 	})
		// }
		Promise.reject(error)
	}
);
api.interceptors.request.use(
	function (config) {
		const token = sessionService.get('token')
		if (token) {
			config.headers['Authorization'] = `Bearer ${token}`;
		}
		return config;
	},
	function (error) {
		// 对请求错误做些什么
		return Promise.reject(error);
	}
);

export {api};
