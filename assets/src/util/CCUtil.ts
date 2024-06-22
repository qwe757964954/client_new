import { Button, EventKeyboard, Input, KeyCode, Layers, Node, NodeEventType, SpriteFrame, UITransform, Vec3, Widget, director, gfx, input, isValid } from "cc";
import { SoundMgr } from "../manager/SoundMgr";

export default class CCUtil {
    // public static clickCall(event: EventTouch) {
    // console.log("clickCall", event.currentTarget._name);
    public static clickCall(node: Node) {
        console.log("clickCall", node.name);
        SoundMgr.click();
    }
    private static lastClickTime = 0;
    // 触摸事件监听
    public static onTouch(obj: any, callback: Function, target?: any) {
        if (!obj) return;
        let node = obj.node ? obj.node : obj;
        if (node && node.on && isValid(node, true)) {
            let touchFun = () => {
                let now = new Date().getTime();
                let dt = now - this.clickLastTime;
                if (dt < 150) {
                    console.log("点击间隔过于频繁,过滤", dt);
                    return;
                }
                this.clickLastTime = now;
                CCUtil.clickCall(node);
                if (callback) { callback.call(target); }
            }
            node.on(NodeEventType.TOUCH_END, touchFun);
            node["touchFun"] = touchFun;
            // node.on(NodeEventType.TOUCH_END, CCUtil.clickCall, node);
            // node.on(NodeEventType.TOUCH_END, callback, target);
        }
    }
    private static clickLastTime = 0;
    /**
     * 注册按钮事件
     * @param {node} node 
     * @param {function} cb 
     * @param {boolean} clean 是否去除节点的已存在点击事件
     */
    static onBtnClick(node: Node, cb: Function, clean: boolean = true) {
        if (node.getComponent && !node.getComponent(Button)) {
            node.addComponent(Button).target = node;
        }
        if (clean) {
            node.off("click");
        }
        node.on("click", (event, arg2, arg3, arg4, arg5) => {
            let now = new Date().getTime();
            if (now - this.clickLastTime < 150) {
                console.log("点击间隔过于频繁，打回", (now - this.clickLastTime));
                this.clickLastTime = new Date().getTime();
                return;
            }
            cb(event, arg2, arg3, arg4, arg5);
            SoundMgr.click();
            this.clickLastTime = new Date().getTime();
        });
    }
    // 触摸事件解除
    public static offTouch(obj: any, callback?: Function, target?: any) {
        if (!obj) return;
        let node = obj.node ? obj.node : obj;
        if (node && node.off && isValid(node, true)) {
            if (node["touchFun"]) {
                node.off(NodeEventType.TOUCH_END, node["touchFun"]);
                node["touchFun"] = null;
            } else {
                node.off(NodeEventType.TOUCH_END, CCUtil.clickCall, node);
                node.off(NodeEventType.TOUCH_END, callback, target);
            }
            // node.off(NodeEventType.TOUCH_END, CCUtil.clickCall, node);
            // node.off(NodeEventType.TOUCH_END, callback, target);
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

    public static addWidget(nd: Node, paddings: { left?: number; right?: number; top?: number, bottom?: number }) {
        if (!nd) return;

        let wgt = nd.getComponent(Widget);
        if (!isValid(wgt)) {
            wgt = nd.addComponent(Widget);
        }
        if (typeof paddings.left === "number") {
            wgt.isAlignLeft = true;
            wgt.left = paddings.left;
        }

        if (typeof paddings.right === "number") {
            wgt.isAlignRight = true;
            wgt.right = paddings.right;
        }

        if (typeof paddings.top === "number") {
            wgt.isAlignTop = true;
            wgt.top = paddings.top;
        }

        if (typeof paddings.bottom === "number") {
            wgt.isAlignBottom = true;
            wgt.bottom = paddings.bottom;
        }

        return wgt;
    }
    /**设置2D节点缩放 */
    public static setNodeScale(obj: any, scale: number) {
        if (!obj) return;
        let node = obj.node ? obj.node : obj;
        node.scale = new Vec3(scale, scale, 1);
    }
    public static setNodeScaleEx(obj: any, scaleX: number, scaleY: number) {
        if (!obj) return;
        let node = obj.node ? obj.node : obj;
        node.scale = new Vec3(scaleX, scaleY, 1);
    }
    /**自适应图片大小 */
    public static fixNodeScale(node: Node, maxWidth: number, maxHeight: number, mustSet: boolean = false) {
        let scale = new Vec3(1, 1, 1);
        let transform = node.getComponent(UITransform);
        let scaleX = maxWidth / (transform.width * scale.x);
        let scaleY = maxHeight / (transform.height * scale.y);
        if (scaleX < 1.0 || scaleY < 1.0) {
            let minScale = Math.min(scaleX, scaleY);
            scale.x *= minScale;
            scale.y *= minScale;
            node.scale = scale;
        } else if (mustSet) {
            node.scale = scale;
        }
    }
    /**自适应填充图片 */
    public static fillNodeScale(node: Node, maxWidth: number, maxHeight: number, mustSet: boolean = false) {
        let scale = new Vec3(1, 1, 1);
        let transform = node.getComponent(UITransform);
        let scaleX = maxWidth / (transform.width * scale.x);
        let scaleY = maxHeight / (transform.height * scale.y);
        if (scaleX > 1.0 || scaleY > 1.0) {
            let maxScale = Math.max(scaleX, scaleY);
            scale.x *= maxScale;
            scale.y *= maxScale;
            node.scale = scale;
        } else if (mustSet) {
            node.scale = scale;
        }
    }
    /**设置节点相机 */
    public static setNodeCamera(node: Node, layer: Layers.Enum) {
        node.layer = layer;
        for (let i = 0; i < node.children.length; i++) {
            let child = node.children[i];
            CCUtil.setNodeCamera(child, layer);
        }
    }
    /**设置节点相机2D_UI */
    public static setNodeCamera2DUI(node: Node) {
        CCUtil.setNodeCamera(node, Layers.Enum.UI_2D);
    }
}