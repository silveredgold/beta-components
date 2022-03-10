import { NButton, NIcon, NIconWrapper, NImage, NPopover, ThemeCommonVars } from "naive-ui"
import { Checkmark, Close, Help, Images } from "@vicons/ionicons5";
import { Component, h } from "vue"
import { Placement } from "naive-ui/lib/drawer/src/DrawerBodyWrapper";

export const stateIcon = (themeVars: ThemeCommonVars) => {
    return (state?: boolean) => h(
        NIconWrapper,
        {
            size: 24,
            borderRadius: 10,
            color: state === undefined ? themeVars.warningColor : state ? themeVars.successColor : themeVars.errorColor
        }, () => h(
            NIcon, {
            component: state === undefined ? Help : state ? Checkmark : Close
        })
    )
}

export const wrappedIcon = (icon: Component, color?: string) => {
    return h(
        NIconWrapper,
        {
            size: 24,
            borderRadius: 10,
            color
        }, () => h(
            NIcon, {
            component: icon
        })
    )
}

export const imagePreviewPopover = (placement: Placement = 'left', previewSize: number = 400) => {
    return (imageSrc?: string) => h(
        NPopover, {
        trigger: "click",
        placement: placement
    }, {
        trigger: () => h(
            NPopover, {
            trigger: 'hover',
            placement: placement
        }, {
            'trigger': () => h(
                NButton, {
                strong: true,
                circle: true,
                type: 'primary'
            }, {
                icon: () => h(NIcon, { component: Images })
            }
            ),
            default: () => 'Preview'
        }),
        default: () => h(
            NImage, {
            height: previewSize,
            width: previewSize,
            src: imageSrc,
            objectFit: 'contain'
        })
    });
}