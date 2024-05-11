import { EventKeyboard, Input, KeyCode, NodeEventType, SpriteFrame, director, gfx, input, isValid } from "cc";
import { SoundMgr } from "../manager/SoundMgr";

export default class CCUtil {
    public static clickCall() {
        SoundMgr.click();
    }
    // 触摸事件监听
    public static onTouch(obj: any, callback: Function, target?: any) {
        if (!obj) return;
        let node = obj.node ? obj.node : obj;
        if (node && node.on && isValid(node, true)) {
            node.on(NodeEventType.TOUCH_END, callback, target);
            node.on(NodeEventType.TOUCH_END, CCUtil.clickCall, CCUtil);
        }
    }
    // 触摸事件解除
    public static offTouch(obj: any, callback: Function, target?: any) {
        if (!obj) return;
        let node = obj.node ? obj.node : obj;
        if (node && node.off && isValid(node, true)) {
            node.off(NodeEventType.TOUCH_END, callback, target);
            node.off(NodeEventType.TOUCH_END, CCUtil.clickCall, CCUtil);
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

    //所有像素获取（合图后，图片旋转还有bug）
    public static readAllPixels(spriteFrame: SpriteFrame, flipY = true): Uint8Array {
        // RenderTexture
        const rect = spriteFrame.rect;
        const size = spriteFrame.originalSize;
        const width = size.width;
        const height = size.height;
        console.log("readPixels", width, height);
        console.log("readPixels 2", rect.x, rect.y, rect.width, rect.height);
        const gfxTexture = spriteFrame.getGFXTexture();
        const bufferViews = [];
        const region = new gfx.BufferTextureCopy;
        const buffer = new Uint8Array(width * height * 4);
        region.texOffset.x = rect.x;
        region.texOffset.y = rect.y;
        region.texExtent.width = rect.width;
        region.texExtent.height = rect.height;
        bufferViews.push(buffer);
        director.root.device.copyTextureToBuffers(gfxTexture, bufferViews, [region]);
        if (flipY) {
            let i = 0, len1 = height / 2, len2 = width * 4, j: number, idx0: number, idx1: number;
            while (i < len1) {
                j = 0;
                while (j < len2) {
                    idx0 = i * len2 + j;
                    idx1 = (height - i - 1) * len2 + j;
                    [buffer[idx0], buffer[idx1]] = [buffer[idx1], buffer[idx0]];
                    j++;
                }
                i++;
            }
        }
        return buffer;
    }
    /**获取指定位置像素 */
    public static readPixels(spriteFrame: SpriteFrame, x: number, y: number): Uint8Array {
        const size = spriteFrame.originalSize;
        if (x > size.width || y > size.height) return null;
        const rect = spriteFrame.rect;
        const offset = spriteFrame.offset;
        // console.log("readPixels start", x, y, size.width, size.height, spriteFrame.width, spriteFrame.height);
        // console.log("spriteFrame.rect offset", rect.x, rect.y, rect.width, rect.height, offset.x, offset.y, spriteFrame.rotated);
        // console.log("spriteFrame original", spriteFrame.original);
        const px = x - offset.x + (rect.width - size.width) / 2;
        const py = y - offset.y + (rect.height - size.height) / 2;
        // console.log("readPixels 1:", px, py);
        const gfxTexture = spriteFrame.getGFXTexture();
        const bufferViews = [];
        const region = new gfx.BufferTextureCopy;
        const buffer = new Uint8Array(4);
        if (spriteFrame.rotated) {
            region.texOffset.x = rect.x + py;
            region.texOffset.y = rect.y + px;
        } else {
            region.texOffset.x = rect.x + px;
            region.texOffset.y = rect.y + rect.height - py;
        }
        // console.log("readPixels 2:", region.texOffset.x, region.texOffset.y);
        region.texExtent.width = 1;
        region.texExtent.height = 1;
        bufferViews.push(buffer);
        director.root.device.copyTextureToBuffers(gfxTexture, bufferViews, [region]);
        // console.log("readPixels return", buffer[0], buffer[1], buffer[2], buffer[3]);
        return buffer;
    }
}