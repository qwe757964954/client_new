import { assetManager, ImageAsset, Sprite } from "cc";
import { NetConfig } from "../config/NetConfig";
import { ToolUtil } from "../util/ToolUtil";
import { LoadManager } from "./LoadManager";

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
        return LoadManager.loadRemoteSprite(url, sprite);
        // return new Promise<any>((resolve, reject) => {
        //     assetManager.loadRemote<ImageAsset>(url, (err, imageAsset) => {
        //         if (err) {
        //             console.log("加载错误", err);
        //             resolve(false);
        //             return;
        //         }
        //         this._cacheAsset.set(url, imageAsset);
        //         if (sprite) {
        //             const spriteFrame = new SpriteFrame();
        //             const texture = new Texture2D();
        //             texture.image = imageAsset;
        //             spriteFrame.texture = texture;
        //             sprite.spriteFrame = spriteFrame;
        //         }
        //         resolve(true);
        //     });
        // });
    }

    /**清理缓存资源（图片资源没必要调用） */
    clearImageAsset() {
        this._cacheAsset.forEach(asset => {
            assetManager.releaseAsset(asset);
        });
        this._cacheAsset.clear();
    }
    /**加载远程单词图片 */
    loadWordImg(word: string, sprite: Sprite) {
        let url = ToolUtil.replace("{0}/imgs/words/{1}.jpg", NetConfig.assertUrl, word);
        return LoadManager.loadRemoteSprite(url, sprite);
    }

    /**加载远程书籍封面 */
    loadBookCover(bookName: string, grade: string, sprite: Sprite) {
        let url = ToolUtil.replace("{0}/imgs/bookcover/{1}/{2}.jpg", NetConfig.assertUrl, bookName, grade);
        return LoadManager.loadRemoteSprite(url, sprite);
    }
}

export const RemoteImgMgr = RemoteImageManager.i;