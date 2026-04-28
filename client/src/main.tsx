import React from "react";
import App from "./App";
import {getpublickeyapi} from "@/api/user";
import {message} from "antd";
import {createRoot} from 'react-dom/client';
import {setPublickey} from "@/store/app";

const container: HTMLElement = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

const closeBootLoading = () => {
    const loading = document.querySelector('.loading');
    if (loading instanceof HTMLElement) {
        loading.style.display = 'none';
    }
};

// 程序运行获取公开密钥 用于后面登录验证
getpublickeyapi().then(async (resp) => {
    const data = await resp
    if (data.status !== 200) {
        closeBootLoading()
        return message.error('获取公钥失败')
    }

    setPublickey(data.data)
    closeBootLoading()
}).catch(() => {
    closeBootLoading()
    message.error('获取公钥失败')
})


export default root.render(<App/>);
