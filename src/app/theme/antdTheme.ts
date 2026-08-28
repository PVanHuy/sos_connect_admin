import type { ThemeConfig } from 'antd'
import { appColors } from './colors'

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: appColors.appColor,
    colorSuccess: appColors.green47Color,
    colorWarning: appColors.yellow22Color,
    colorError: appColors.red26Color,
    colorInfo: appColors.blue8FFColor,
    colorText: appColors.gray37Color,
    colorTextSecondary: appColors.gray80Color,
    colorBorder: appColors.grayEBColor,
    colorBgLayout: appColors.grayF5Color,
    colorBgContainer: appColors.whiteColor,
    borderRadius: 10,
    fontFamily:
      "Poppins, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: 15,
    controlHeight: 44,
  },
  components: {
    Layout: {
      siderBg: appColors.background,
      headerBg: appColors.whiteColor,
      bodyBg: appColors.grayF5Color,
    },
    Menu: {
      darkItemBg: appColors.background,
      darkSubMenuItemBg: appColors.gray50Color,
      darkItemSelectedBg: appColors.appColor,
      darkItemHoverBg: appColors.gray50Color,
      itemBorderRadius: 0,
      itemMarginInline: 0,
      itemPaddingInline: 20,
    },
    Button: {
      controlHeight: 44,
      borderRadius: 50,
      fontWeight: 600,
    },
    Input: {
      controlHeight: 44,
      borderRadius: 12,
    },
    Table: {
      headerBg: appColors.grayF6Color,
    },
  },
}
