import { assetManager, ImageAsset, Sprite, SpriteFrame, Texture2D } from "cc";

export default class RemoteImageManager {
    private static _instance: RemoteImageManager = null;
    private _cacheAsset: Map<string, ImageAsset> = new Map();

    public static get i(): RemoteImageManager {
        if (this._instance == null) {
            this._instance = new RemoteImageManager();
        }
        return this._instance;
    }

    public async loadImage(url: string, sprite: Sprite = null) {
        return new Promise<any>((resolve, reject) => {
            assetManager.loadRemote<ImageAsset>(url, (err, imageAsset) => {
                if (err) {
                    console.log("加载错误", err);
                    resolve(false);
                    return;
                }
                this._cacheAsset.set(url, imageAsset);
                if (sprite) {
                    const spriteFrame = new SpriteFrame();
                    const texture = new Texture2D();
                    texture.image = imageAsset;
                    spriteFrame.texture = texture;
                    sprite.spriteFrame = spriteFrame;
                }
                resolve(true);
            });
        });
    }

    /**清理音频资源 */
    clearImageAsset() {
        this._cacheAsset.forEach(asset => {
            assetManager.releaseAsset(asset);
        });
        this._cacheAsset.clear();
    }
}