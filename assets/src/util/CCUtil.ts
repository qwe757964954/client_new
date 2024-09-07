import { Button, Camera, Color, Director, EventKeyboard, EventTouch, Input, KeyCode, Layers, Node, NodeEventType, RenderTexture, SpriteFrame, UIOpacity, UITransform, Vec3, Widget, director, gfx, input, isValid } from "cc";
import GlobalConfig from "../GlobalConfig";
import { SoundMgr } from "../manager/SoundMgr";
import { ToolUtil } from "./ToolUtil";

const s_cameraLayer: number = Layers.Enum["SCEEN_SHOT"];
export default class CCUtil {
    public static clickCall(event: EventTouch) {
        console.log("clickCall", event.currentTarget._name);
        // public static clickCall(node: Node) {
        // console.log("clickCall", node.name);
        SoundMgr.click();
    }
    private static lastClickTime = 0;
    // 触摸事件监听
    public static onTouch(obj: any, callback: Function, target?: any) {
        if (!obj) return;
        let node = obj.node ? obj.node : obj;
        if (node && node.on && isValid(node, true)) {
            let touchFun = (e: EventTouch) => {
                let now = new Date().getTime();
                let dt = now - this.lastClickTime;
                if (dt < 150) {
                    console.log("点击间隔过于频繁,过滤", now, this.lastClickTime, dt);
                    return;
                }
                this.lastClickTime = now;
                CCUtil.clickCall(e);
                if (callback) { callback.call(target, e); }
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
        let button = node.getComponent(Button);
        if (!button) {
            button = node.addComponent(Button);
            button.transition = Button.Transition.SCALE;
            button.zoomScale = 1.2;
            button.duration = 0.1;
        }

        if (clean) {
            node.off("click");
        }

        node.on("click", (event, ...args) => {
            const now = new Date().getTime();
            if (now - CCUtil.clickLastTime < 150) {
                console.log("点击间隔过于频繁，打回", (now - CCUtil.clickLastTime));
                return;
            }

            cb(event, ...args);
            SoundMgr.click();  // Ensure SoundMgr is imported or defined elsewhere
            CCUtil.clickLastTime = now;
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
    public static readPixel(spriteFrame: SpriteFrame, x: number, y: number): Uint8Array {
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
        const buffer = new Uint8Array(4);
        let offsetX = 0;
        let offsetY = 0;
        let width = 1;
        let height = 1;
        if (spriteFrame.rotated) {
            offsetX = rect.x + py;
            offsetY = rect.y + px;
        } else {
            offsetX = rect.x + px;
            offsetY = rect.y + rect.height - py;
        }
        if (offsetX > rect.x + rect.width || offsetY > rect.y + rect.height) return buffer;
        // console.log("readPixels 2:", offsetX, offsetY, texture);
        // 以下获取像素方式在android上压缩纹理会崩溃
        /** RenderTexture.readPixels强制类型转换了，只能在web上使用，android上会崩溃 */
        // let texture = spriteFrame.texture;
        // RenderTexture.prototype.readPixels.call(texture, offsetX, offsetY, width, height, buffer);
        const gfxTexture = spriteFrame.getGFXTexture();
        const bufferViews = [];
        const region = new gfx.BufferTextureCopy;
        region.texOffset.x = offsetX;
        region.texOffset.y = offsetY;
        region.texExtent.width = width;
        region.texExtent.height = height;
        bufferViews.push(buffer);
        director.root.device.copyTextureToBuffers(gfxTexture, bufferViews, [region]);
        // console.log("readPixels return", buffer[0], buffer[1], buffer[2], buffer[3]);
        return buffer;
    }
    /**获取指定位置像素，通过摄像机（注意：测试还有问题，同时多个一起调用有问题） */
    public static async readPixelByCamera(node: Node, x: number, y: number): Promise<Uint8Array> {
        let camera;
        if (null == camera) {
            let tmpNode = new Node();
            camera = tmpNode.addComponent(Camera);
            camera.projection = Camera.ProjectionType.ORTHO;
            camera.clearColor = Color.TRANSPARENT;
            camera.near = 0;
            camera.visibility = s_cameraLayer;
        }
        let layer = node.layer;
        camera.node.parent = node;
        camera.enabled = true;
        camera.node.active = true;
        node.layer = layer | s_cameraLayer;
        // CCUtil.setNodeCamera(node, s_cameraLayer);

        let transform = node.getComponent(UITransform);
        let size = transform.contentSize;
        // console.log("readPixelByCamera", x, y, size.width, size.height, transform.anchorX, transform.anchorY);
        let spriteFrame = new SpriteFrame();
        let renderTex = new RenderTexture();
        renderTex.reset({
            width: size.width,
            height: size.height,
        });
        camera.orthoHeight = size.height / 2;
        camera.node.position = new Vec3(size.width * (0.5 - transform.anchorX), size.height * (0.5 - transform.anchorY), 0);
        camera.targetTexture = renderTex;
        spriteFrame.texture = renderTex;
        spriteFrame.packable = false;
        // director.root.frameMove(0);
        let rect = spriteFrame.rect;
        const px = x + (rect.width - size.width) / 2;
        const py = y + (rect.height - size.height) / 2;
        const buffer = new Uint8Array(4);
        let offsetX = rect.x + px;
        let offsetY = rect.y + py;
        let width = 1;
        let height = 1;
        const gfxTexture = spriteFrame.getGFXTexture();
        const bufferViews = [];
        const region = new gfx.BufferTextureCopy;
        region.texOffset.x = offsetX;
        region.texOffset.y = offsetY;
        region.texExtent.width = width;
        region.texExtent.height = height;
        bufferViews.push(buffer);
        await new Promise<void>((resolve) => {
            director.once(Director.EVENT_AFTER_DRAW, () => {
                resolve();
            });
        });
        // let bufferAry = renderTex.readPixels(0, 0, size.width, size.height);
        // let count = 0;
        // for (let i = 0; i < bufferAry.length; i++) {
        //     if (0 != bufferAry[i]) {
        //         count++;
        //     }
        // }
        director.root.device.copyTextureToBuffers(gfxTexture, bufferViews, [region]);
        // console.log("readPixelByCamera 2：", count, buffer);
        camera.node.active = false;
        camera.node.parent = null;
        node.layer = layer;
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
    /** */
    public static viewAdaptScreen(nodes: Node[]) {
        let scale = ToolUtil.getValue(GlobalConfig.WIN_DESIGN_RATE, 0.1, 1.0);
        nodes.forEach(node => {
            CCUtil.setNodeScale(node, scale);
        });
    }
    /**设置node的UIOpacity */
    public static setNodeOpacity(node: Node, opacity: number) {
        if (!node) return;
        let uiOpacity = node.getComponent(UIOpacity);
        if (uiOpacity) {
            uiOpacity.opacity = opacity;
        }
    }
}