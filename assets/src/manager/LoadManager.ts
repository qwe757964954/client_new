/** 资源加载单例 */
import { Asset, Component, EffectAsset, ImageAsset, JsonAsset, Material, Node, Prefab, Sprite, SpriteAtlas, SpriteFrame, TTFFont, Texture2D, assetManager, instantiate, isValid, resources, sp } from "cc";

export class LoadManager {

    //加载json资源
    public static loadJson(name: string): Promise<any | undefined> {
        return new Promise((resolve, reject) => {
            resources.load(`config/${name}`, JsonAsset, (error: Error, assets: JsonAsset) => {
                if (error) {
                    console.log("load->resource loadJson failed:" + name);
                    console.log("failed msg:" + error.message);
                    reject(error);
                    return;
                }
                resolve(assets?.json);
            });
        });
    }
    /**加载远程资源 url需要有扩展名*/
    public static loadRemote(url: string): Promise<any | undefined> {
        return new Promise((resolve, reject) => {
            assetManager.loadRemote(url, (error: Error, assets: any) => {
                if (error) {
                    console.log("load->resource loadRemote failed:" + url);
                    console.log("failed msg:" + error.message);
                    reject(error);
                    return;
                }
                resolve(assets);
            });
        });
    }
    // 释放资源
    public static releaseAsset(asset: Asset) {
        if (asset) {
            // if ("default_sprite_splash" == asset.name) return;
            if (asset.isDefault) return;//默认资源不移除
            // console.log("releaseAsset", asset.name);
            asset.decRef();
            if (0 == asset.refCount) {
                // console.log("releaseAsset 2", asset.name);
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

    private static updateObjAsset(obj: Component, assets: Asset, resolve: (value?: any) => void, reject: (value?: any) => void) {
        //如果父节点不存或已经被销毁则直接返回
        if (!obj || !isValid(obj, true)) {
            assets.addRef();
            LoadManager.releaseAsset(assets);
            reject(new Error("parent is null or invalid"));
            return;
        }
        if (obj instanceof sp.Skeleton) {
            // if (obj.skeletonData) {
            //     LoadManager.releaseAsset(obj.skeletonData);
            // }
            obj.skeletonData = assets as sp.SkeletonData;
        } else if (obj instanceof Sprite) {
            if (assets instanceof ImageAsset) {
                // if (obj.spriteFrame) {
                //     obj.spriteFrame.texture
                // }
                // 远程的assets有uuid，赋值的spriteFrame的uuid为空
                const texture = new Texture2D();
                texture.image = assets;
                const spriteFrame = new SpriteFrame();
                spriteFrame.texture = texture;

                obj.spriteFrame = spriteFrame;
            } else if (assets instanceof SpriteFrame) {
                // if (obj.spriteFrame) {
                //     LoadManager.releaseAsset(obj.spriteFrame);
                // }
                obj.spriteFrame = assets;
            }
        }
        // 多次设置会多次增加监听
        obj.node.once(Node.EventType.NODE_DESTROYED, () => {
            LoadManager.releaseAsset(assets);
        });
        assets.addRef();
        resolve(obj);
    }

    /**加载并显示spine */
    public static loadSpine(path: string, skeleton: sp.Skeleton): Promise<any | undefined> {
        return new Promise((resolve, reject) => {
            resources.load(path, sp.SkeletonData, (error: Error, assets: sp.SkeletonData) => {
                if (error) {
                    console.log("loadShowSpine->resource load failed:" + path + "," + error.message);
                    reject(error);
                    return;
                }
                LoadManager.updateObjAsset(skeleton, assets, resolve, reject);
            });
        });
    }
    /**加载并显示sprite */
    public static loadSprite(path: string, sprite: Sprite): Promise<any | undefined> {
        return new Promise((resolve, reject) => {
            resources.load(path, SpriteFrame, (error: Error, assets: SpriteFrame) => {
                if (error) {
                    console.log("loadShowSprite->resource load failed:" + path + "," + error.message);
                    reject(error);
                    return;
                }
                LoadManager.updateObjAsset(sprite, assets, resolve, reject);
            });
        });
    }
    public static loadRemoteSprite(urlPath: string, sprite: Sprite): Promise<any | undefined> {
        return new Promise((resolve, reject) => {
            console.log("loadRemote", urlPath);
            assetManager.loadRemote(urlPath, (error: Error, assets: ImageAsset) => {
                if (error) {
                    console.log("load->resource loadRemoteSprite failed:" + urlPath);
                    console.log("failed msg:" + error.message);
                    reject(error);
                    return;
                }
                LoadManager.updateObjAsset(sprite, assets, resolve, reject);
            });
        });
    }
    /**加载并显示prefab */
    public static loadPrefab(path: string, parent: Node): Promise<any | undefined> {
        return new Promise((resolve, reject) => {
            resources.load("prefab/" + path, Prefab, (error: Error, assets: Prefab) => {
                if (error) {
                    console.log("loadShowPrefab->resource load failed:" + path + "," + error.message);
                    reject(error);
                    return;
                }
                //如果父节点不存或已经被销毁则直接返回
                if (!parent || !isValid(parent, true)) {
                    assets.addRef();
                    LoadManager.releaseAsset(assets);
                    reject(new Error("parent is null or invalid"));
                    return;
                }
                let node = instantiate(assets);
                parent.addChild(node);
                node.once(Node.EventType.NODE_DESTROYED, () => {
                    LoadManager.releaseAsset(assets);
                });
                assets.addRef();
                resolve(node);
            });
        });
    }

    /**button */

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