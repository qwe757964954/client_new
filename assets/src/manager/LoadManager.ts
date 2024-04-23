/** 资源加载单例 */
import { Asset, EffectAsset, JsonAsset, Material, Prefab, SpriteAtlas, SpriteFrame, TTFFont, Texture2D, assetManager, resources, sp } from "cc";

export class LoadManager {
    // private _assetManagerMap:Map<string, Asset>;//资源管理器map<资源名,资源>

    //单例
    // private static _instance: LoadManager = null;
    // public static get instance():LoadManager{
    //     if(!this._instance){
    //         this._instance = new LoadManager();
    //     }
    //     return this._instance;
    // }
    // private constructor() {
    //     // this._assetManagerMap = new Map<string, Asset>();
    // }

    // 加载资源
    public static load(path: string, type: typeof Asset): Promise<Asset> {
        return new Promise((resolve, reject) => {
            resources.load(path, type, (error: Error, assets: Asset) => {
                if (error) {
                    console.log("load->resource load failed:" + path);
                    console.log("failed msg:" + error.message);
                    reject(error);
                    return;
                }

                assets.addRef();//引用计数加一

                resolve(assets);
            });
        });
    }
    // 加载预制体
    public static loadPrefab(path: string): Promise<Prefab> {
        return new Promise((resolve, reject) => {
            resources.load("prefab/" + path, Prefab, (error: Error, assets: Prefab) => {
                if (error) {
                    console.log("load->resource loadPrefab failed:" + path);
                    console.log("failed msg:" + error.message);
                    reject(error);
                    return;
                }

                assets.addRef();//引用计数加一

                resolve(assets);
            });
        });
    }
    //加载json资源
    public static loadJson(name: string): Promise<any | undefined> {
        return new Promise((resolve, reject) => {
            resources.load(`config/${name}`, JsonAsset, (error: Error, assets: JsonAsset) => {
                if (error) {
                    console.log("load->resource loadJson failed:" + name);
                    console.log("failed msg:" + error.message);
                    reject(error);
                }
                resolve(assets?.json);
            });
        });
    }
    // 释放资源
    public static releaseAsset(asset: Asset) {
        if (asset) {
            asset.decRef();
            if (0 == asset.refCount) {
                assetManager.releaseAsset(asset);
            }
        }
    }
    public static releaseAssets(assets: Asset[]) {
        if (!assets) return;
        for (let i = 0; i < assets.length; i++) {
            LoadManager.releaseAsset(assets[i]);
        }
    }
    // 强制释放资源
    public static forceReleaseAsset(asset: Asset) {
        assetManager.releaseAsset(asset);
    }



    // //按名称加载spine动画
    // public static loadSpineByName(name: string): Promise<sp.SkeletonData | undefined> {
    //     return new Promise((resolve, reject) => {
    //         resources.load(name, sp.SkeletonData, (error: Error, assets: sp.SkeletonData) => {
    //             if (error) {
    //                 console.log("loadSpineByName->resource load failed:" + error.message);
    //                 reject(error);
    //             }
    //             resolve(assets);
    //         });
    //     });
    // }

    // //创建帧动画对象，name:文件名, aniName:动画名, speed:动画的播放速度 sample:每秒播放帧数,wrapMode:播放模式 1播放一次 2循环播放
    // public static loadAnimate(name: string, aniName: string, speed: number, sample: number = 10, wrapMode: number = 1): Promise<AnimationClip | undefined> {
    //     return new Promise((resolve, reject) => {
    //         resources.load(`plist/${name}`, SpriteAtlas, (error: Error, spFrame: SpriteAtlas) => {
    //             if (error) {
    //                 console.log("loadAnimate->resource load failed:" + error.message);
    //                 reject(error);
    //             }
    //             let frames: SpriteFrame[] = spFrame.getSpriteFrames();
    //             var clip = AnimationClip.createWithSpriteFrames(frames, frames.length);//创建动画帧图
    //             clip.name = aniName;
    //             clip.speed = speed;         //速度
    //             clip.sample = sample;       //每秒播放帧数
    //             clip.wrapMode = wrapMode;   //模式     
    //             resolve(clip);
    //         });
    //     });
    // }

    // //加载图片资源
    // public static loadGameSpriteFrame(name: string): Promise<SpriteFrame | undefined> {
    //     return new Promise((resolve, reject) => {
    //         resources.load(`images/${name}/spriteFrame`, SpriteFrame, (error: Error, assets: SpriteFrame) => {
    //             if (error) {
    //                 console.log("loadGameSpriteFrame->resource load failed:" + error.message);
    //                 reject(error);
    //             }
    //             resolve(assets);
    //         });
    //     });
    // }

    // ///加载Bundle资源
    // public static loadBundleSpriteFrame(bundleName: string, path: string): Promise<SpriteFrame | undefined> {
    //     if (assetManager.bundles.has(bundleName)) {
    //         let bundle = assetManager.bundles.get(bundleName);
    //         return this.loadSpriteFrame(bundle!, `${path}/spriteFrame`);
    //     }
    //     else {
    //         return new Promise((resolve, reject) => {
    //             // 自动加载bundle
    //             assetManager.loadBundle(bundleName, (err, bundle) => {
    //                 if (!err) {
    //                     resolve(this.loadSpriteFrame(bundle, `${path}/spriteFrame`));
    //                 }
    //             })
    //         });
    //     }
    // }
    // //加载图集资源
    // private static loadSpriteFrame(bundle: AssetManager.Bundle, path: string): Promise<SpriteFrame | undefined> {
    //     return new Promise((resolve, reject) => {
    //         bundle.load(path, SpriteFrame, (error: Error, assets: SpriteFrame) => {
    //             if (error) {
    //                 reject(error);
    //             }
    //             resolve(assets);
    //         });
    //     });
    // }
    // //加载json资源
    // public static loadJson(name: string): Promise<any | undefined> {
    //     return new Promise((resolve, reject) => {
    //         resources.load(`config/${name}`, JsonAsset, (error: Error, assets: JsonAsset) => {
    //             if (error) {
    //                 console.log("loadJson->resource load failed:" + error.message);
    //                 reject(error);
    //             }
    //             resolve(assets.json);
    //         });
    //     });
    // }
    // //加载预制体
    // public static loadPrefab(name: string): Promise<Prefab | undefined> {
    //     return new Promise((resolve, reject) => {
    //         resources.load(`prefabs/${name}`, Prefab, (error: Error, assets: Prefab) => {
    //             if (error) {
    //                 console.log("loadPrefab->resource load failed:" + error.message);
    //                 reject(error);
    //             }
    //             resolve(assets);
    //         });
    //     });
    // }



    // 获取资源包名
    public static getBundleName(uuid: string) {
        let ret = "";
        let map = assetManager.bundles;
        map.forEach((value, key) => {
            if ("" == ret && value.getAssetInfo(uuid)) {
                ret = key;
            }
        });
        return ret;
    }
    //打印内存中占有资源
    public static dumpResInfo() {
        let map = {};
        let prefabMap = {};
        let spMap = {};
        let ary = [];
        let assets = assetManager.assets;
        assets.forEach((value, key) => {
            if (value instanceof SpriteFrame) {
                let name = this.getBundleName(key);
                if ("" != name) {
                    map[name] ||= [];
                    map[name].push(value.name);
                }
            } else if (value instanceof Prefab) {
                let name = this.getBundleName(key);
                if ("" != name) {
                    prefabMap[name] ||= [];
                    prefabMap[name].push(value.name);
                }
            } else if (value instanceof sp.SkeletonData) {
                let name = this.getBundleName(key);
                if ("" != name) {
                    spMap[name] ||= [];
                    spMap[name].push(value.name);
                }
            } else if (value instanceof Texture2D || value instanceof EffectAsset || value instanceof Material ||
                value instanceof SpriteAtlas || value instanceof TTFFont) {

            } else {
                ary.push(value);
            }
        });
        console.log(assets);
        console.log(map, prefabMap, spMap);
        console.log(ary);
        return true;
    }
}