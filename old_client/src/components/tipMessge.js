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
        console.log(tipMessge,text,title)
        this.instance = createApp(tipMessge)

        this.parent = document.createElement("div")
        let appDom = document.getElementById('app')
        appDom.appendChild(this.parent)
        this.instance.mount(this.parent)


        setTimeout(() => {
            this.instance.unmount(this.parent);
            appDom.removeChild(this.parent);
        }, time);
    },
};
