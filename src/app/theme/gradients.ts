import type { CSSProperties } from 'react'
import { appColors } from './colors'

export const appGradients = {
  whiteAndBlueF4: `linear-gradient(180deg, ${appColors.blueF4Color} 0%, ${appColors.whiteColor} 100%)`,
  blueBFFAndAFF: 'linear-gradient(90deg, #006BFF 0%, #00AAFF 100%)',
  blueGenderMale: `linear-gradient(90deg, ${appColors.blueBFFColor} 0%, ${appColors.blueFFColor} 100%)`,
  pinkFemale: `linear-gradient(90deg, ${appColors.pinkA6Color} 0%, ${appColors.pink8CColor} 100%)`,
  pinkE5AndWhite: `linear-gradient(180deg, ${appColors.pinkE5Color} 0%, ${appColors.whiteColor} 100%)`,
  pinkEBAndWhite: `linear-gradient(90deg, ${appColors.pinkEBColor} 0%, ${appColors.whiteColor} 100%)`,
  red: `linear-gradient(90deg, ${appColors.red61Color} 0%, ${appColors.red25Color} 100%)`,
  redEBAndFF: `linear-gradient(135deg, ${appColors.appColor} 0%, ${appColors.red58Color} 100%)`,
  linearBlue: `linear-gradient(90deg, ${appColors.blueF4Color} 0%, ${appColors.whiteColor} 100%)`,
  purpleFFAndApp: `linear-gradient(90deg, ${appColors.purpleFFColor} 0%, ${appColors.appColor} 100%)`,
  blueAFFAndApp: `linear-gradient(90deg, ${appColors.appColor} 0%, ${appColors.blueAFFColor} 100%)`,
} as const

export type AppGradientName = keyof typeof appGradients

export function gradientStyle(name: AppGradientName): CSSProperties {
  return { backgroundImage: appGradients[name] }
}
