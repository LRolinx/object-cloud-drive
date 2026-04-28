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
  colorPrimary: '#8b93ff',
  colorBgBase: '#0c1020',
  colorBgLayout: '#0f1426',
  colorBgContainer: '#171d31',
  colorBgElevated: '#1d2438',
  colorBorder: 'rgba(148, 163, 184, 0.18)',
  colorText: '#e6ebff',
  colorTextSecondary: '#98a4bf',
}
