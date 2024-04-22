import { Modal } from 'ant-design-vue'
import { defineComponent, nextTick, ref, watch } from 'vue'
import { StreamingImageEmits, StreamingImageProps } from './type'

export const StreamingImage = defineComponent<StreamingImageProps, StreamingImageEmits>(
  (props, ctx) => {
    const imgRef = ref()

    //返回
    const onCancel = () => {
      ctx.emit('update:open', false)
    }

    watch(
      () => props.open,
      () => {
        if (props.open) {
          nextTick(() => {
            //请求回来的数据
            //https://tse4-mm.cn.bing.net/th/id/OIP-C.gPJ41ZwWXgeAo53WpXuUUgAAAA?pid=ImgDet&rs=1
            fetch('https://tse4-mm.cn.bing.net/th/id/OIP-C.gPJ41ZwWXgeAo53WpXuUUgAAAA?pid=ImgDet&rs=1').then((resp) => {
              resp.blob().then((blob) => {
                imgRef.value.src = URL.createObjectURL(blob)
              })
            })
          })
        } else {
          URL.revokeObjectURL(imgRef.value.src)
        }
      }
    )

    return () => {
      return (
        <>
          <Modal onCancel={onCancel} style="width:80vw" v-model:open={props.open} title="流图片" footer={<></>}>
            <img ref={imgRef} class="picture" src="" />
          </Modal>
        </>
      )
    }
  },
  {
    name: '',
    props: ['open'],
    emits: ['update:open'],
  }
)
