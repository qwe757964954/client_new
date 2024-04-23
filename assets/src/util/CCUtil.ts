import { EventKeyboard, Input, KeyCode, NodeEventType, SpriteFrame, director, gfx, input, isValid } from "cc";

export default class CCUtil {
    // 触摸事件监听
    public static onTouch(obj: any, callback: Function, target?: any) {
        if (!obj) return;
        let node = obj.node ? obj.node : obj;
        if (node && node.on && isValid(node, true)) {
            node.on(NodeEventType.TOUCH_END, callback, target);
        }
    }
    // 触摸事件解除
    public static offTouch(obj: any, callback: Function, target?: any) {
        if (!obj) return;
        let node = obj.node ? obj.node : obj;
        if (node && node.off && isValid(node, true)) {
            node.off(NodeEventType.TOUCH_END, callback, target);
        }
    }
    // 按键事件监听
    public static onKeyBack(obj: any, callback: Function, target?: any) {
        obj._onKeyBack = (event: EventKeyboard) => {
            if (event.keyCode === KeyCode.MOBILE_BACK || event.keyCode === KeyCode.BACKSPACE) {
                if (callback) {
                    callback(target);
                }
            }
        }
        input.on(Input.EventType.KEY_UP, obj._onKeyBack);
    }
    // 按键事件解除
    public static offKeyBack(obj: any) {
        input.off(Input.EventType.KEY_UP, obj._onKeyBack);
    }

    //像素点击
    public static readPixels(spriteFrame: SpriteFrame, flipY = true): Uint8Array {
        const texture = spriteFrame!.texture;
        const { width, height } = texture;
        const gfxTexture = texture.getGFXTexture();
        // const gfxDevice = texture['_getGFXDevice']();
        const bufferViews = [];
        const region = new gfx.BufferTextureCopy;
        const buffer = new Uint8Array(width * height * 4);
        region.texExtent.width = width;
        region.texExtent.height = height;
        bufferViews.push(buffer);
        // gfxDevice?.copyTextureToBuffers(gfxTexture, bufferViews, [region]);
        director.root.device.copyTextureToBuffers(gfxTexture, bufferViews, [region]);
        if (flipY) {
            let i = 0, len1 = height / 2, len2 = width * 4, j: number, idx0: number, idx1: number;
            while (i < len1) {
                j = 0;
                while (j < len2) {
                    idx0 = i * len2 + j;
                    idx1 = (height - i - 1) * len2 + j++;
                    [buffer[idx0], buffer[idx1]] = [buffer[idx1], buffer[idx0]];
                }
                i++;
            }
        }
        return buffer;
    }
}