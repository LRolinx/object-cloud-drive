/**
 * <p>
 * 默认主题
 * </p>
 *
 * @version: v1.0
 * @author: Clover
 * @create: 2022-11-25 11:37
 */
import { theme } from 'antd'
import { AliasToken } from 'antd/es/theme'

export const lightTheme: Partial<AliasToken> = {
  ...theme.defaultSeed,
  colorPrimary: '#00a846'
}
