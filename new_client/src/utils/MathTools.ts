import { JSEncrypt } from 'JSEncrypt'
import { useUserStore } from '@/store/models/user'
import { useAppStore } from '@/store/models/app'


export default class MathTools {
  /**
   * 使用公开密匙加密
   * @param value 需要加密的内容
   */
  public static encryptForKey(value: any): string {
	const appStore = useAppStore()
    const encryptor = new JSEncrypt()
    encryptor.setPublicKey(appStore.publickey)

    return encryptor.encrypt(value).toString()
  }

  //   /**
  //    * 使用私有密匙解密
  //    * @param value 需要解密的内容
  //    */
  //   public static decryptForKey(encrypt: any): string {
  //     const encryptor = new JSEncrypt()
  //     const key = new NodeRSA(appStore.publickey)
  //     return key.decryptPublic(encrypt, 'utf8')
  //   }
}
