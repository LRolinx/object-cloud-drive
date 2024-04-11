import { StreamingImage } from '@/components/streaming_image'
import { StreamingVideoPlayer } from '@/components/streaming_video_player'
import { StreamingAudio } from '@/components/streaming_audio'
import { Button, Space } from 'ant-design-vue'
import { defineComponent, ref } from 'vue'

export const StreamingVideo = defineComponent(
  () => {
    const openVideoModal = ref(false)
    const openImageModal = ref(false)
    const openAudioModal = ref(false)
    const videoList = ref(['F:\\Videos/hls-1080p-0494f.mp4','F:\\Videos/hls-1080p-f5e9f.mp4'])

    const showVideoModal = () => {
      openVideoModal.value = true
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
            <StreamingAudio v-model:open={openAudioModal.value}></StreamingAudio>
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
