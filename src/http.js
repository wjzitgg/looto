import axios from 'axios'
import Qs from 'qs'
import router from './router'
import store from './store/store'
// axios 配置
axios.defaults.timeout = 20000;
axios.defaults.baseURL = '/';
//axios.defaults.withCredentials = true;

axios.defaults.transformRequest = function(data) {
	// 这里可以在发送请求之前对请求数据做处理，比如form-data格式化等，这里可以使用开头引入的Qs（这个模块在安装axios的时候就已经安装了，不需要另外安装）
	if(data instanceof FormData){
		return data;
	}

	return data;
}
axios.defaults.paramsSerializer = function(params) {
//console.log(Qs.stringify(params))
	return Qs.stringify(params)
}

// http request 拦截器
axios.interceptors.request.use((config) => {
  	if(config.method  === 'post'){ 
    	config.data = Qs.stringify(config.data);
  	}
	config.headers['Lang'] = localStorage.getItem('lang')?localStorage.getItem('lang'):'en'
		
  return config;
},(error) =>{
  return Promise.reject(error);
});

// http response 拦截器

axios.interceptors.response.use(
	response => {

		if(response.data.code==308) {
			localStorage.removeItem('token')
            localStorage.removeItem('userId')
		
			router.push({
				 path: '/login',
				 query:{
				 	redirect:router.currentRoute.fullPath
				 }
			 })
		}
		    
		return response;
	},
	error => {
		console.log("response error: " + error)
		if(error.response) {
			switch(error.response.status) {
				case 400:
					error.message = 'Connection failed, please check your network.'
					break

				case 401:
					error.message = 'Connection failed, please check your network.'
					break

				case 403:
					error.message = 'Connection failed, please check your network.'
					break

				case 404:
					error.message = 'Connection failed, please check your network.'
					break

				case 408:
					error.message = 'Connection failed, please check your network.'
					break

				case 500:
					error.message = 'Connection failed, please check your network.'
					break

				case 501:
					error.message = 'Connection failed, please check your network.'
					break

				case 502:
					error.message = 'Connection failed, please check your network.'
					break

				case 503:
					error.message = 'Connection failed, please check your network.'
					break

				case 504:
					error.message = 'Connection failed, please check your network.'
					break

				case 505:
					error.message = 'Connection failed, please check your network.'
					break
			}
			if(error.response.data.message=='Hash is invalid.'||error.response.data.message=='Undefined index: id') {
				localStorage.removeItem('token')
	            localStorage.removeItem('userId')
			
				router.push({
					 path: '/login',
					 query:{
					 	redirect:router.currentRoute.fullPath
					 }
				 })
			}
			
			console.log(error.response)
			return Promise.reject({
				msg: error.message ? error.message : error,
				statusCode: error.response.status
			})
		} else {
			if(error.message) {
				return Promise.reject({
					msg: error.message,
					statusCode: 0
				})
			} else {
				return Promise.reject({
					msg: error,
					statusCode: 0
				})
			}
		}
		// console.log(JSON.stringify(error));//console : Error: Request failed with status code 402

	});

export default axios;