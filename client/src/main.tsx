import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {getpublickeyapi} from "@/api/user";
import {message} from "antd";

// 程序运行获取公开密钥 用于后面登录验证
getpublickeyapi().then(async (resp) => {
    const data = await resp
    if (data.status !== 200) {
        return message.error('获取公钥失败')
    }
    // appStore.publickey = data.data
    // console.log(appStore.publickey)
})

export default ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <App/>
);
