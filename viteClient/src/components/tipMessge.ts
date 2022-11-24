/*
 * █████▒█      ██  ▄████▄   ██ ▄█▀     ██████╗ ██╗   ██╗ ██████╗
 * ▓██   ▒ ██  ▓██▒▒██▀ ▀█   ██▄█▒      ██╔══██╗██║   ██║██╔════╝
 * ▒████ ░▓██  ▒██░▒▓█    ▄ ▓███▄░      ██████╔╝██║   ██║██║  ███╗
 * ░▓█▒  ░▓▓█  ░██░▒▓▓▄ ▄██▒▓██ █▄      ██╔══██╗██║   ██║██║   ██║
 * ░▒█░   ▒▒█████▓ ▒ ▓███▀ ░▒██▒ █▄     ██████╔╝╚██████╔╝╚██████╔╝
 * ▒ ░   ░▒▓▒ ▒ ▒ ░ ░▒ ▒  ░▒ ▒▒ ▓▒     ╚═════╝  ╚═════╝  ╚═════╝
 * ░     ░░▒░ ░ ░   ░  ▒   ░ ░▒ ▒░
 * ░ ░    ░░░ ░ ░ ░        ░ ░░ ░
 * ░     ░ ░      ░  ░
 * Copyright 2022 LRolinx.
 * <p>
 *  -
 * </p>
 * @author LRolinx
 * @create 2021-12-14 20:14
 */

import { createApp } from "vue"
import tipMessge from './tipMessge.vue'

export default {

    instance: null,
    parent: null,
    // 为了保证多个同时loading的时候，只显示一个，并且需要全部close之后才消失
    open(text = '你好，世界', title = "提示", time = 2000) {

        const instance = createApp(tipMessge, { text, title })

        const parent = document.createElement("div")
        let appDom = document.getElementById('app')
        if (appDom === null) return;
        appDom.appendChild(parent)
        instance.mount(parent)

        setTimeout(() => {
            instance.unmount();
            if (appDom === null) return;
            appDom.removeChild(parent);
        }, time);
    },
};
