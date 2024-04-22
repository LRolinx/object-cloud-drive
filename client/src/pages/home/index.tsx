import {memo} from "react";
import {UploadType} from "@/types/UploadType";

export default memo((p, c) => {

    //打开新建文件夹
    const onOpenNewFolderModel = () => {
        console.log(childRouter.value)
        //   childRouter.value.openNewFolderModel()
        //   childRouter.value.$props.openNewFolderModel()
        //   childRouter.value.openNewFolderModel()
    }

    const openDrive = () => {
        //打开我的云盘
        router.push({ name: 'drive' })
    }

    const openDriveResourcePool = () => {
        // 打开资源池
        router.push({ name: 'driveResourcePool' })
    }

    const openStreamingVideo = () => {
        //打开视频流DEMO
        router.push({ name: 'StreamingVideo' })
    }

    // 片段上传
    const upLoadFun = async (item) => {
        //设置状态为上传中
        setUploadType(item, UploadType.Conduct)
        const blobSlice = File.prototype.slice

        // 指定文件分块大小 1024的2次方
        const chunkSize = calculateSliceSize(item.file.size) * 1024 ** 2
        // 计算文件分块总数
        const chunks = Math.ceil(item.file.size / chunkSize)
        //设置总片段数量
        item.currentChunkMax = chunks

        for (let i = 0, len = chunks; i < len; i++) {
            // 计算开始读取的位置
            const start = i * chunkSize
            // 计算结束读取的位置
            const end = start + chunkSize >= item.file.size ? item.file.size : start + chunkSize

            // 简化流程
            const fileslice = blobSlice.call(item.file, start, end)

            //片段流上传
            const params = new FormData() //创建form对象
            params.append('file', fileslice)

            uploadstreamfileapi(params, userStore.id, item.folderId, item.fname, item.filePath, item.fext, item.fileSha256, chunks, i).then((resp) => {
                const { code: code, message: msg, data: data } = resp.data
                if (code !== 200) {
                    //上传失败
                    setUploadType(item, UploadType.Error)
                    return message.error(msg)
                }

                item.uploadCurrentChunkNum += 1
                appStore.counter += 1
                if (item.uploadCurrentChunkNum >= item.currentChunkMax) {
                    // console.log(childRouter);
                    // $refs.childRouter.getUserFileAndFolder(
                    //   $refs.childRouter.getFolderId()
                    // );

                    //设置任务上传完成
                    setUploadType(item, UploadType.Success)
                }
            })
        }
    }

    const calculateSliceSize = (size: number) => {
        //计算分段MB

        const mbSize = Number((((size / 1024 ** 2) * 100) / 100).toFixed(2))

        //计算的出百分比占比MB
        const zb = parseInt(((mbSize / 100) * 2).toString())

        if (zb <= 2) {
            return 2
        }

        if (zb > 10) {
            return 10
        }

        return zb
    }

    //设置上传状态
    const setUploadType = (item: any, type: UploadType) => {
        item['uploadType'] = type
        //操作计数器用于刷新
        appStore.counter += 1
    }

    watch(route, (toRouter) => {
        // //设置最后路由
        appStore.siderbarStr = toRouter.name.toString()
        // sessionStorage.setItem("siderbarStr", toRouter.name);
        appStore.siderbarStr = toRouter.name.toString() //重置最后路由
    })

    driveStore.$subscribe((m, s) => {
        //监听任务列表变化
        //   console.log(m.events)
        if (m.events['type'] === 'set') {
            // 监听到添加任务 开始分配任务
            const item = m.events['target']
            if (item['file'] === undefined || item['uploadType'] !== UploadType.Prepare) return
            // setUploadType(item, UploadType.Prepare)
            // appStore.counter += 1

            // examinefileapi(userStore.id, item.folderId, item.fileSha256, item.fname, item.fext).then((resp) => {
            //   const { code, message: msg, data } = resp.data
            //   if (code !== 200) {
            //     //上传失败
            //     setUploadType(item, UploadType.Error)
            //     return message.error(msg)
            //   }

            if (!item.userFileExist) {
                //用户文件不存在
                if (!item.fileExist) {
                    //文件不存在 开始上传

                    upLoadFun(item)
                } else {
                    //秒传文件
                    setUploadType(item, UploadType.Fast)
                    //   $http
                    //     .post(`${userStore.serve.serveUrl}upload/uploadSecondPass`, {
                    //       userid: userStore.id,
                    //       folderid: item.folderId,
                    //       fileName: item.fname,
                    //       filePath: item.filePath,
                    //       fileExt: item.fext,
                    //       fileSha256: item.fileSha256,
                    //     })
                    //     .then((SecondPass) => {
                    //       if (SecondPass.data.code == 200) {
                    //         // childRouter.value.getUserFileAndFolder(
                    //         //   childRouter.value.getFolderId()
                    //         // );
                    //         // console.log(childRouter);
                    //         //设置任务为秒传
                    //         setTaskState(item, 5, 0)
                    //       } else {
                    //         //秒传失败
                    //         setTaskState(item, 404, 0)
                    //         console.log(SecondPass.data.message)
                    //       }
                    //     })
                }
            } else {
                //用户文件已存在
                setUploadType(item, UploadType.Exist)
            }
            // })
        }
    })

    return <>
        <div className="home">
            {/* <NewFolder v-model:open={showNewFolderModel.value} onSubmit={newFolderSubmit}></NewFolder> */}

            <div className="topbar" v-if="false">
                <p>网盘2.0 全新升级~</p>
            </div>

            <div className="main">
                <div className="siderbar">
                    <div className="logo">
                        <p>对象云盘</p>
                    </div>

                    <ul className="siderbarUl">
                        <li className={"liOn": appStore.siderbarStr == 'drive'} onClick={openDrive}>
                            {/* <i class="iconfont icon-drive"></i> */}
                            <CloudTwoTone/>
                            <p>我的云盘</p>
                        </li>
                        <li className={{liOn: appStore.siderbarStr == 'driveResourcePool'}}
                            onClick={openDriveResourcePool}>
                            {/* <i class="iconfont icon-cloud"></i> */}
                            <DatabaseTwoTone/>
                            <p>资源池</p>
                        </li>
                        <li className={{liOn: appStore.siderbarStr == 'StreamingVideo'}} onClick={openStreamingVideo}>
                            {/* <i class="iconfont icon-video-play"></i> */}
                            <PlaySquareTwoTone/>
                            <p>视频流DEMO</p>
                        </li>
                    </ul>

                    <div className="headBox">
                        <div className="headChildBox">
                            <img src={userStore.photo}/>
                            <p>{userStore.nickname}</p>
                        </div>
                    </div>
                </div>
                <div className="content">
                    <router-view>{/* <component ref={childRouter} is={Component} key={route.path}></component> */}</router-view>
                </div>
            </div>
            <UploadFloatButtonGroup></UploadFloatButtonGroup>
            {/* <UploadModal onOpenNewFolderModel={onOpenNewFolderModel} uploadTaskList={props.uploadTaskList} uploadRemainingTask={props.uploadRemainingTask}></UploadModal> */}
        </div>
    </>
})