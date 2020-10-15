import axios from 'axios';
import { useStateValue } from './Context';

const instance = axios.create({
    baseURL:"http://localhost:4000"
});

instance.interceptors.request.use(function (config) {
    var token = localStorage.getItem('jwtAuthTokenSecret');
    config.headers['Authorization'] = token ?"Bearer "+token : '';
    return config;
  })

export default instance;
