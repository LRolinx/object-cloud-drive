/**
 * <p>
 * 深色主题
 * </p>
 *
 * @version: v1.0
 * @author: Clover
 * @create: 2022-11-28 23:34
 */
import { theme } from 'antd'
import { AliasToken } from 'antd/es/theme/interface'
import { lightTheme } from './light'

const lightToDark = theme.darkAlgorithm(lightTheme as AliasToken)

export const darkTheme: Partial<AliasToken> = {
  ...lightToDark,
  colorBgContainer: '#282a2a',
}

console.log(darkTheme);
