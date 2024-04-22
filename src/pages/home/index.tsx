import {memo} from "react";

export default memo((p,c) => {

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
                        <li className={{ liOn: appStore.siderbarStr == 'drive' }} onClick={openDrive}>
                            {/* <i class="iconfont icon-drive"></i> */}
                            <CloudTwoTone />
                            <p>我的云盘</p>
                        </li>
                        <li className={{ liOn: appStore.siderbarStr == 'driveResourcePool' }} onClick={openDriveResourcePool}>
                            {/* <i class="iconfont icon-cloud"></i> */}
                            <DatabaseTwoTone />
                            <p>资源池</p>
                        </li>
                        <li className={{ liOn: appStore.siderbarStr == 'StreamingVideo' }} onClick={openStreamingVideo}>
                            {/* <i class="iconfont icon-video-play"></i> */}
                            <PlaySquareTwoTone />
                            <p>视频流DEMO</p>
                        </li>
                    </ul>

                    <div className="headBox">
                        <div className="headChildBox">
                            <img src={userStore.photo} />
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