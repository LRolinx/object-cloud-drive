import { defineComponent, nextTick, onBeforeMount, ref, watch } from 'vue'
import { StreamingVideoPlayerEmits, StreamingVideoPlayerProps } from './type'
import { Modal, Spin } from 'ant-design-vue'
import './index.less'
import { API_LIST } from '@/script/api'
import { getDashUrlAPI } from '@/api/resource_pool'

export const StreamingVideoPlayer = defineComponent<StreamingVideoPlayerProps, StreamingVideoPlayerEmits>(
  (props, ctx) => {
    //视频加载中
    const loading = ref(false)
    //当前播放索引
    const index = ref(0)

    //dash播放
    const dashPlayer = dashjs.MediaPlayer().create()

    //返回
    const onCancel = () => {
      ctx.emit('update:open', false)
    }

    // 设置播放数据
    const setPlayData = () => {
      const container = document.querySelector('.container'),
        mainVideo = container.querySelector('video')
      //   loading.value = true

      dashPlayer.initialize(mainVideo, `${API_LIST.BASEURL}/resourcepool/playVideoSteam?name=${props.data[index.value].name}&ext=${props.data[index.value].ext}&path=${props.data[index.value].path}`, true)

      // //   getDashUrlAPI(props.data[index.value].name, props.data[index.value].ext, props.data[index.value].path).then((resp) => {
      // //     console.log(resp)
      // //   })

      //   fetch(`${API_LIST.BASEURL}/resourcepool/playVideoSteam`, {
      //     method: 'post',
      //     headers: {
      //       'Content-Type': 'application/json;charset=utf-8',
      //     },
      //     body: JSON.stringify({ ...props.data[index.value] }),
      //   }).then((resp) =>
      //     resp.blob().then((blob) => {
      //       URL.revokeObjectURL(mainVideo.src)
      //       const blobUrl = URL.createObjectURL(blob)
      //       console.log(blobUrl)

      //       //   mainVideo.src =
      //       loading.value = false
      //     })
      //   )
    }

    const init = () => {
      if (props.index != undefined) {
        index.value = props.index
      }
      nextTick(() => {
        const container = document.querySelector('.container'),
          mainVideo = container.querySelector('video'),
          videoTimeline = container.querySelector('.video-timeline'),
          progressBar = container.querySelector('.progress-bar'),
          volumeBtn = container.querySelector('.volume i'),
          volumeSlider = container.querySelector('.left input'),
          currentVidTime = container.querySelector('.current-time'),
          videoDuration = container.querySelector('.video-duration'),
          skipBackward = container.querySelector('.skip-backward i'),
          skipForward = container.querySelector('.skip-forward i'),
          playPauseBtn = container.querySelector('.play-pause i'),
          speedBtn = container.querySelector('.playback-speed span'),
          speedOptions = container.querySelector('.speed-options'),
          pipBtn = container.querySelector('.pic-in-pic span'),
          fullScreenBtn = container.querySelector('.fullscreen i')

        setPlayData()

        let timer

        const hideControls = () => {
          if (mainVideo.paused) return
          timer = setTimeout(() => {
            container.classList.remove('show-controls')
          }, 3000)
        }
        hideControls()

        container.addEventListener('mousemove', () => {
          container.classList.add('show-controls')
          clearTimeout(timer)
          hideControls()
        })

        const formatTime = (time) => {
          let seconds = Math.floor(time % 60),
            minutes = Math.floor(time / 60) % 60,
            hours = Math.floor(time / 3600)

          seconds = seconds < 10 ? `0${seconds}` : seconds
          minutes = minutes < 10 ? `0${minutes}` : minutes
          hours = hours < 10 ? `0${hours}` : hours

          if (hours == 0) {
            return `${minutes}:${seconds}`
          }
          return `${hours}:${minutes}:${seconds}`
        }

        videoTimeline.addEventListener('mousemove', (e) => {
          let timelineWidth = videoTimeline.clientWidth
          let offsetX = e.offsetX
          let percent = Math.floor((offsetX / timelineWidth) * mainVideo.duration)
          const progressTime = videoTimeline.querySelector('span')
          offsetX = offsetX < 20 ? 20 : offsetX > timelineWidth - 20 ? timelineWidth - 20 : offsetX
          progressTime.style.left = `${offsetX}px`
          progressTime.innerText = formatTime(percent)
        })

        videoTimeline.addEventListener('click', (e) => {
          let timelineWidth = videoTimeline.clientWidth
          mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration
        })

        mainVideo.addEventListener('timeupdate', (e) => {
          let { currentTime, duration } = e.target
          let percent = (currentTime / duration) * 100
          progressBar.style.width = `${percent}%`
          currentVidTime.innerText = formatTime(currentTime)
        })

        mainVideo.addEventListener('loadeddata', () => {
          videoDuration.innerText = formatTime(mainVideo.duration)
        })

        const draggableProgressBar = (e) => {
          let timelineWidth = videoTimeline.clientWidth
          progressBar.style.width = `${e.offsetX}px`
          mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration
          currentVidTime.innerText = formatTime(mainVideo.currentTime)
        }

        volumeBtn.addEventListener('click', () => {
          if (!volumeBtn.classList.contains('fa-volume-high')) {
            mainVideo.volume = 0.5
            volumeBtn.classList.replace('fa-volume-xmark', 'fa-volume-high')
          } else {
            mainVideo.volume = 0.0
            volumeBtn.classList.replace('fa-volume-high', 'fa-volume-xmark')
          }
          volumeSlider.value = mainVideo.volume
        })

        volumeSlider.addEventListener('input', (e) => {
          mainVideo.volume = e.target.value
          if (e.target.value == 0) {
            return volumeBtn.classList.replace('fa-volume-high', 'fa-volume-xmark')
          }
          volumeBtn.classList.replace('fa-volume-xmark', 'fa-volume-high')
        })

        speedOptions.querySelectorAll('li').forEach((option) => {
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

        fullScreenBtn.addEventListener('click', () => {
          container.classList.toggle('fullscreen')
          if (document.fullscreenElement) {
            fullScreenBtn.classList.replace('fa-compress', 'fa-expand')
            return document.exitFullscreen()
          }
          fullScreenBtn.classList.replace('fa-expand', 'fa-compress')
          container.requestFullscreen()
        })

        speedBtn.addEventListener('click', () => speedOptions.classList.toggle('show'))
        pipBtn.addEventListener('click', () => mainVideo.requestPictureInPicture())
        skipBackward.addEventListener('click', () => {
          // (mainVideo.currentTime -= 5)
          if (index.value > 0) {
            index.value -= 1
            setPlayData()
            // console.log(props.index,index.value,props.data.length)
          }
        })
        skipForward.addEventListener('click', () => {
          //(mainVideo.currentTime += 5)
          if (index.value < props.data.length - 1) {
            index.value += 1
            setPlayData()
            // console.log(props.index,index.value,props.data.length)
          }
        })
        mainVideo.addEventListener('play', () => playPauseBtn.classList.replace('fa-play', 'fa-pause'))
        mainVideo.addEventListener('pause', () => playPauseBtn.classList.replace('fa-pause', 'fa-play'))
        playPauseBtn.addEventListener('click', () => (mainVideo.paused ? mainVideo.play() : mainVideo.pause()))
        videoTimeline.addEventListener('mousedown', () => videoTimeline.addEventListener('mousemove', draggableProgressBar))
        document.addEventListener('mouseup', () => videoTimeline.removeEventListener('mousemove', draggableProgressBar))
      })
    }

    watch(
      () => props.open,
      () => {
        if (props.open) {
          nextTick(() => {
            init()
          })
        } else {
          //   const container = document.querySelector('.container'),
          //     mainVideo = container.querySelector('video')
          //   // mainVideo.pause()
          //   URL.revokeObjectURL(mainVideo.src)
        }
      }
    )

    // onBeforeMount(() => {
    //   nextTick(() => {
    //     init()
    //   })
    // })

    return () => {
      return (
        <>
          <div class="streaming_video_player">
            <Modal maskClosable={false} onCancel={onCancel} style="width:80vw" v-model:open={props.open} title="流视频" footer={<></>}>
              <Spin spinning={loading.value}>
                <div class="container show-controls">
                  <div class="wrapper">
                    <div class="video-timeline">
                      <div class="progress-area">
                        <span>00:00</span>
                        <div class="progress-bar"></div>
                      </div>
                    </div>
                    <ul class="video-controls">
                      <li class="options left">
                        <button class="volume">
                          <i class="fa-solid fa-volume-high"></i>
                        </button>
                        <input type="range" min="0" max="1" step="any" />
                        <div class="video-timer">
                          <p class="current-time">00:00</p>
                          <p class="separator"> / </p>
                          <p class="video-duration">00:00</p>
                        </div>
                      </li>
                      <li class="options center">
                        <button class="skip-backward">
                          <i class="fas fa-backward"></i>
                        </button>
                        <button class="play-pause">
                          <i class="fas fa-play"></i>
                        </button>
                        <button class="skip-forward">
                          <i class="fas fa-forward"></i>
                        </button>
                      </li>
                      <li class="options right">
                        <div class="playback-content">
                          <button class="playback-speed">
                            <span class="material-symbols-rounded">slow_motion_video</span>
                          </button>
                          <ul class="speed-options">
                            <li data-speed="2">2x</li>
                            <li data-speed="1.5">1.5x</li>
                            <li data-speed="1" class="active">
                              Normal
                            </li>
                            <li data-speed="0.75">0.75x</li>
                            <li data-speed="0.5">0.5x</li>
                          </ul>
                        </div>
                        <button class="pic-in-pic">
                          <span class="material-icons">picture_in_picture_alt</span>
                        </button>
                        <button class="fullscreen">
                          <i class="fa-solid fa-expand"></i>
                        </button>
                      </li>
                    </ul>
                  </div>
                  <video autoplay></video>
                </div>
              </Spin>
            </Modal>
          </div>
        </>
      )
    }
  },
  {
    name: 'StreamingVideoPlayer',
    props: ['open', 'data', 'index'],
    emits: ['update:open'],
  }
)
