import { API_LIST } from '@/script/api';
import Axios from 'axios'
import { App } from 'vue';

const axios = Axios.create({
	baseURL: API_LIST.BASEURL,
})

axios.interceptors.request.use(config => {
  return config;
})

axios.interceptors.response.use(resp => {
  return resp;
}, err => {
  if (err.response.status === 200 || err.response.status === 406) {
    return Promise.resolve(err.response);
  }
  return Promise.reject(err)
})

const AxiosPluginRegister = {
  install(app: App) {
    // defineExpose({
    $http: axios
    // })
  }
}

export { AxiosPluginRegister };

export default axios;
