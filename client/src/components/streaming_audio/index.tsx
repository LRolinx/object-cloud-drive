import {defineComponent, nextTick, onBeforeMount, watch} from 'vue'
import {StreamingAudioEmits, StreamingAudioProps} from './type'
import './index.less'
import {memo} from "react";
import {Modal} from "antd";

export const StreamingAudio = memo(
    (props: StreamingAudioProps, context: StreamingAudioEmits) => {
        //返回
        const onCancel = () => {
            // ctx.emit('update:open', false)
            context["update:open"] = () => false
        }

        const init = () => {
            nextTick(() => {
                const container = document.querySelector('.container'),
                    mainVideo = container?.querySelector('audio'),
                    videoTimeline = container?.querySelector('.video-timeline'),
                    progressBar = container?.querySelector('.progress-bar'),
                    volumeBtn = container?.querySelector('.volume i'),
                    volumeSlider = container?.querySelector('.left input'),
                    currentVidTime = container?.querySelector('.current-time'),
                    videoDuration = container?.querySelector('.video-duration'),
                    skipBackward = container?.querySelector('.skip-backward i'),
                    skipForward = container?.querySelector('.skip-forward i'),
                    playPauseBtn = container?.querySelector('.play-pause i'),
                    speedBtn = container?.querySelector('.playback-speed span'),
                    speedOptions = container?.querySelector('.speed-options'),
                    //   pipBtn = container?.querySelector('.pic-in-pic span'),
                    fullScreenBtn = container?.querySelector('.fullscreen i')

                // fetch('http://music.163.com/song/media/outer/url?id=447925558.mp3').then((resp) => {
                //   resp.blob().then((blob) => {
                //     mainVideo.src = URL.createObjectURL(blob)
                //   })
                // })

                let timer: NodeJS.Timeout | undefined = undefined

                const hideControls = () => {
                    if (mainVideo?.paused) return
                    //   timer = setTimeout(() => {
                    //     container?.classList.remove('show-controls')
                    //   }, 3000)
                }
                hideControls()

                container?.addEventListener('mousemove', () => {
                    container?.classList.add('show-controls')
                    clearTimeout(timer)
                    hideControls()
                })

                const formatTime = (time: number): string => {
                    let seconds: number | string = Math.floor(time % 60),
                        minutes: number | string = Math.floor(time / 60) % 60,
                        hours: number | string = Math.floor(time / 3600)

                    seconds = seconds < 10 ? `0${seconds}` : seconds
                    minutes = minutes < 10 ? `0${minutes}` : minutes
                    hours = hours < 10 ? `0${hours}` : hours

                    if (hours == 0) {
                        return `${minutes}:${seconds}`
                    }
                    return `${hours}:${minutes}:${seconds}`
                }

                videoTimeline?.addEventListener('mousemove', (e) => {
                    let timelineWidth = videoTimeline.clientWidth
                    let offsetX = e.offsetX
                    let percent = Math.floor((offsetX / timelineWidth) * (mainVideo?.duration ?? 0))
                    const progressTime = videoTimeline.querySelector('span')
                    if (progressTime == undefined) return
                    offsetX = offsetX < 20 ? 20 : offsetX > timelineWidth - 20 ? timelineWidth - 20 : offsetX
                    progressTime.style.left = `${offsetX}px`
                    progressTime.innerText = formatTime(percent)
                })

                videoTimeline?.addEventListener('click', (e) => {
                    if (mainVideo == undefined) return
                    let timelineWidth = videoTimeline.clientWidth
                    mainVideo.currentTime = (e.offsetX / timelineWidth) * (mainVideo?.duration ?? 0)
                })

                mainVideo?.addEventListener('timeupdate', (e) => {
                    if (progressBar == undefined || currentVidTime == undefined) return
                    let {currentTime, duration} = e.target
                    let percent = (currentTime / duration) * 100
                    progressBar.style.width = `${percent}%`
                    currentVidTime.innerText = formatTime(currentTime)
                })

                mainVideo?.addEventListener('loadeddata', () => {
                    if (videoDuration == undefined) return
                    videoDuration.innerText = formatTime(mainVideo.duration)
                })

                const draggableProgressBar = (e: any) => {
                    if (progressBar == undefined || mainVideo == undefined || currentVidTime == undefined) return
                    let timelineWidth = videoTimeline?.clientWidth ?? 0
                    progressBar.style.width = `${e.offsetX}px`
                    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration
                    currentVidTime.innerText = formatTime(mainVideo.currentTime)
                }

                volumeBtn?.addEventListener('click', () => {
                    if (!volumeBtn.classList.contains('fa-volume-high')) {
                        mainVideo.volume = 0.5
                        volumeBtn.classList.replace('fa-volume-xmark', 'fa-volume-high')
                    } else {
                        mainVideo.volume = 0.0
                        volumeBtn.classList.replace('fa-volume-high', 'fa-volume-xmark')
                    }
                    volumeSlider.value = mainVideo.volume
                })

                volumeSlider?.addEventListener('input', (e) => {
                    mainVideo.volume = e.target.value
                    if (e.target.value == 0) {
                        return volumeBtn.classList.replace('fa-volume-high', 'fa-volume-xmark')
                    }
                    volumeBtn.classList.replace('fa-volume-xmark', 'fa-volume-high')
                })

                speedOptions?.querySelectorAll('li').forEach((option) => {
                    option.addEventListener('click', () => {
                        mainVideo.playbackRate = option.dataset.speed
                        speedOptions.querySelector('.active').classList.remove('active')
                        option.classList.add('active')
                    })
                })

                document.addEventListener('click', (e) => {
                    if (e.target.tagName !== 'SPAN' || e.target.className !== 'material-symbols-rounded') {
                        speedOptions.classList.remove('show')
                    }
                })

                fullScreenBtn?.addEventListener('click', () => {
                    container?.classList.toggle('fullscreen')
                    if (document.fullscreenElement) {
                        fullScreenBtn.classList.replace('fa-compress', 'fa-expand')
                        return document.exitFullscreen()
                    }
                    fullScreenBtn.classList.replace('fa-expand', 'fa-compress')
                    container?.requestFullscreen()
                })

                speedBtn?.addEventListener('click', () => speedOptions?.classList.toggle('show'))
                // pipBtn.addEventListener('click', () => mainVideo.requestPictureInPicture())
                skipBackward?.addEventListener('click', () => (mainVideo.currentTime -= 5))
                skipForward?.addEventListener('click', () => (mainVideo.currentTime += 5))
                mainVideo?.addEventListener('play', () => playPauseBtn?.classList.replace('fa-play', 'fa-pause'))
                mainVideo?.addEventListener('pause', () => playPauseBtn?.classList.replace('fa-pause', 'fa-play'))
                playPauseBtn?.addEventListener('click', () => (mainVideo?.paused ? mainVideo?.play() : mainVideo?.pause()))
                videoTimeline?.addEventListener('mousedown', () => videoTimeline.addEventListener('mousemove', draggableProgressBar))
                document.addEventListener('mouseup', () => videoTimeline?.removeEventListener('mousemove', draggableProgressBar))
            })
        }

        watch(
            () => props.open,
            () => {
                if (props.open) {
                    init()
                } else {
                    const container
                        ? = document.querySelector('.container?'),
                        mainVideo = container?.querySelector('audio')
                    //   mainVideo.pause()
                    URL.revokeObjectURL(mainVideo.src)
                }
            }
        )

        componentDidMount(() => {
            init()
        })


        return <>
            <div className="streaming_video_player">
                <Modal onCancel={onCancel} style={{width: '80vw'}} v-model:open={props.open} title="流音频"
                       footer={<></>}>
                    <div className="container? show-controls">
                        <div className="wrapper">
                            <div className="video-timeline">
                                <div className="progress-area">
                                    <span>00:00</span>
                                    <div className="progress-bar"></div>
                                </div>
                            </div>
                            <ul className="video-controls">
                                <li className="options left">
                                    <button className="volume">
                                        <i className="fa-solid fa-volume-high"></i>
                                    </button>
                                    <input type="range" min="0" max="1" step="any"/>
                                    <div className="video-timer">
                                        <p className="current-time">00:00</p>
                                        <p className="separator"> / </p>
                                        <p className="video-duration">00:00</p>
                                    </div>
                                </li>
                                <li className="options center">
                                    <button className="skip-backward">
                                        <i className="fas fa-backward"></i>
                                    </button>
                                    <button className="play-pause">
                                        <i className="fas fa-play"></i>
                                    </button>
                                    <button className="skip-forward">
                                        <i className="fas fa-forward"></i>
                                    </button>
                                </li>
                                <li className="options right">
                                    <div className="playback-content">
                                        <button className="playback-speed">
                                            <span className="material-symbols-rounded">slow_motion_video</span>
                                        </button>
                                        <ul className="speed-options">
                                            <li data-speed="2">2x</li>
                                            <li data-speed="1.5">1.5x</li>
                                            <li data-speed="1" className="active">
                                                Normal
                                            </li>
                                            <li data-speed="0.75">0.75x</li>
                                            <li data-speed="0.5">0.5x</li>
                                        </ul>
                                    </div>
                                    {/* <button className="pic-in-pic">
                        <span className="material-icons">picture_in_picture_alt</span>
                      </button> */}
                                    <button className="fullscreen">
                                        <i className="fa-solid fa-expand"></i>
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <audio autoPlay loop src="http://music.163.com/song/media/outer/url?id=447925558.mp3"></audio>
                    </div>
                </Modal>
            </div>
        </>
    }
)
