import axios from "axios";

const instance = axios.create({
    baseURL: "http://bluekaktus.ml/proxy/"
    // baseURL: "http://192.168.1.33:81"
});

export default instance;
