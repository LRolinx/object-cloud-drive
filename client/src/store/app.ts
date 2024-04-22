import {createSlice} from '@reduxjs/toolkit'

export const useAppStore = createSlice({
    name: 'app',
    initialState: {
        initState: false, //初始化状态
        width: 0, //浏览器宽度
        height: 0, //浏览器高度
        publickey: '', //公钥
        siderbarStr: 'drive', //当前页面名
        counter: 0, //操作计数器
    },
    selectors: {
        getPublickey: (state) => state.publickey,
    },
    reducers: {
        setPublickey(state, {payload}) {
            state.publickey = payload;
        },
    },
})

export const {getPublickey} = useAppStore.selectors
export const {setPublickey} = useAppStore.actions