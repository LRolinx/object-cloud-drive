import { StreamingVideoPlayer } from '@/components/streaming_video_player'
import { Button } from 'ant-design-vue'
import { defineComponent, ref } from 'vue'

export const StreamingVideo = defineComponent(
  () => {
    const openVideoModal = ref(false)
    const videoList = ref([])
    const lsSrc = ref('')

    const showVideoModal = () => {
      openVideoModal.value = true
      videoList.value.push(
        'm2+c7R+kU2IF4Kn8v9c/kCJqZGx5f2Ioj3XOX6HxXjTg7X1gXnTXMz9C4lTvk7ql4m39H6UXqdcKF8SbUzI5VU0ronOI+aYmYMRglsAVGWawtXD41vrJEfonMiM3fdD9+ehR+LDcjfAuPYc/aoAbzJcxnBBkwD7YKyvPB+hrvDA='
      )
    }

    const destroyBlobUrl = (blob) => {
      //销毁blob地址
      window.URL.revokeObjectURL(blob)
    }

    return () => {
      return (
        <>
          <div>
            <Button onClick={showVideoModal}>显示视频模态窗</Button>

            <StreamingVideoPlayer v-model:open={openVideoModal.value} data={videoList.value}></StreamingVideoPlayer>
          </div>
        </>
      )
    }
  },
  {
    name: 'StreamingVideo',
    props: [],
    emits: [],
  }
)
