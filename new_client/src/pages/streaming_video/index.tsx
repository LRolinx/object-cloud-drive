import { StreamingImage } from '@/components/streaming_image'
import { StreamingVideoPlayer } from '@/components/streaming_video_player'
import { Button, Space } from 'ant-design-vue'
import { defineComponent, ref } from 'vue'

export const StreamingVideo = defineComponent(
  () => {
    const openVideoModal = ref(false)
    const openImageModal = ref(false)
    const openAudioModal = ref(false)
    const videoList = ref([])

    const showVideoModal = () => {
      openVideoModal.value = true
      videoList.value.push(
        'm2+c7R+kU2IF4Kn8v9c/kCJqZGx5f2Ioj3XOX6HxXjTg7X1gXnTXMz9C4lTvk7ql4m39H6UXqdcKF8SbUzI5VU0ronOI+aYmYMRglsAVGWawtXD41vrJEfonMiM3fdD9+ehR+LDcjfAuPYc/aoAbzJcxnBBkwD7YKyvPB+hrvDA='
      )
    }

    const showImageModal = () => {
      openImageModal.value = true
    }

    const showAudioModal = () => {
      openAudioModal.value = true
    }

    return () => {
      return (
        <>
          <div>
            <StreamingVideoPlayer v-model:open={openVideoModal.value} data={videoList.value}></StreamingVideoPlayer>
            <StreamingImage v-model:open={openImageModal.value}></StreamingImage>
            <Space>
              <Button onClick={showVideoModal}>显示流视频模态窗</Button>
              <Button onClick={showImageModal}>显示流图片模态窗</Button>
              <Button onClick={showAudioModal}>显示流音频模态窗</Button>
            </Space>
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
