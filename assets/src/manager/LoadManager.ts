/** 资源加载单例 */
import { Asset, Component, EffectAsset, ImageAsset, JsonAsset, Material, Node, Prefab, Sprite, SpriteAtlas, SpriteFrame, TTFFont, Texture2D, assetManager, instantiate, isValid, resources, sp } from "cc";
import { TimerMgr } from "../util/TimerMgr";
/**缓存资源信息 */
class CacheInfo {
    private timer: number = 0;//定时器
    public asset: Asset = null;//资源
    public setReleaseTime(time: number) {
        this.clearTimer();
        this.timer = TimerMgr.once(this.clearAsset.bind(this), time * 1000);
    }
    public clearTimer() {
        if (this.timer) {
            TimerMgr.stop(this.timer);
            this.timer = 0;
        }
    }
    public clearAsset() {
        if (!this.asset || !this.asset.isValid || 1 != this.asset.refCount) return;
        LoadManager.clearCache(this.asset);
        this.asset = null;
    }
}

class LoadManagerClass {
    private _cacheReleaseTime: number = 10;//缓存释放时间
    private _cacheAssets: Map<string, CacheInfo> = new Map();

    /**单例 */
    private static _instance: LoadManagerClass = null;
    public static get instance(): LoadManagerClass {
        if (this._instance == null) {
            this._instance = new LoadManagerClass();
        }
        return this._instance;
    }

    /**预加载资源 */
    public preload(path: string | string[]): Promise<any | undefined> {
        return new Promise((resolve, reject) => {
            resources.preload(path, (error: Error, assets: any) => {
                if (error) {
                    console.log("load->resource preload failed:" + path);
                    console.log("failed msg:" + error.message);
                    reject(error);
                    return;
                }
                resolve(assets);
            })
        });
    }
    public preloadPrefab(path: string | string[]): Promise<any | undefined> {
        return LoadManager.preload("prefab/" + path);
    }
    /**加载资源 */
    public loadSpriteFrame(path: string, conNode?: Node, isCache: boolean = false): Promise<any | undefined> {
        return new Promise((resolve, reject) => {
            resources.load(path, SpriteFrame, (error: Error, assets: SpriteFrame) => {
                if (error) {
                    console.log("loadSpriteFrame->resource load failed:" + path + "," + error.message);
                    reject(error);
                    return;
                }
                if (!conNode || this.assetConnectNode(assets, conNode, isCache)) {
                    resolve(assets);
                } else {
                    reject(new Error("loadSpriteFrame->resource load failed:" + path + " not connect node!"));
                }
            });
        });
    }
    //加载json资源
    public loadJson(name: string): Promise<any | undefined> {
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
    public loadRemote(url: string): Promise<any | undefined> {
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
    public loadRemoteEx(url: string, options: { [k: string]: any; ext?: string; }): Promise<any | undefined> {
        return new Promise((resolve, reject) => {
            assetManager.loadRemote(url, options, (error: Error, assets: any) => {
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
    /**清理缓存数据 */
    public clearCache(asset: Asset) {
        let key = asset.nativeUrl || asset.uuid;
        if (this._cacheAssets.has(key)) {
            // console.log("clearCache", key);
            let info = this._cacheAssets.get(key);
            let asset = info.asset;
            asset.decRef();
            if (0 == asset.refCount) {
                assetManager.releaseAsset(asset);
            }
            this._cacheAssets.delete(key);
        }
    }
    /**资源增加引用 */
    public addRefAsset(asset: Asset, isCache: boolean = false) {
        if (!asset) return;
        asset.addRef();
        let key = asset.nativeUrl || asset.uuid;
        if (this._cacheAssets.has(key)) {
            this._cacheAssets.get(key).clearTimer();
        } else if (isCache) {
            asset.addRef();//缓存多增加一次引用，防止被自动释放
            let info = new CacheInfo();
            info.asset = asset;
            this._cacheAssets.set(key, info);
        }
    }
    // 释放资源
    public releaseAsset(asset: Asset) {
        if (asset) {
            // if ("default_sprite_splash" == asset.name) return;
            if (asset.isDefault) return;//默认资源不移除
            // console.log("releaseAsset", asset.name);
            asset.decRef();
            if (0 == asset.refCount) {
                // console.log("releaseAsset 2", asset.refCount,asset.name);
                assetManager.releaseAsset(asset);
                return;
            }
            let key = asset.nativeUrl || asset.uuid;
            if (this._cacheAssets.has(key)) {
                if (1 == asset.refCount) {
                    this._cacheAssets.get(key).setReleaseTime(this._cacheReleaseTime);
                }
            }
        }
    }
    public releaseAssets(assets: Asset[]) {
        if (!assets) return;
        for (let i = 0; i < assets.length; i++) {
            LoadManager.releaseAsset(assets[i]);
        }
    }
    // 强制释放资源
    public forceReleaseAsset(asset: Asset) {
        this.clearCache(asset);
        assetManager.releaseAsset(asset);
    }

    private assetConnectNode(assets: Asset, conNode: Node, isCache: boolean = false) {
        if (!assets) return false;
        if (!conNode || !isValid(conNode, true)) {
            this.addRefAsset(assets, isCache);
            LoadManager.releaseAsset(assets);
            return false;
        }
        // 多次设置会多次增加监听
        conNode.once(Node.EventType.NODE_DESTROYED, () => {
            LoadManager.releaseAsset(assets);
        });
        this.addRefAsset(assets, isCache);
        return true;
    }
    private updateObjAsset(obj: Component, assets: Asset, resolve: (value?: any) => void, reject: (value?: any) => void, isCache: boolean = false) {
        //如果父节点不存或已经被销毁则直接返回
        if (!obj || !isValid(obj, true)) {
            // assets.addRef();
            this.addRefAsset(assets, isCache);
            LoadManager.releaseAsset(assets);
            // reject(new Error("parent is null or invalid"));
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
        // assets.addRef();
        this.addRefAsset(assets, isCache);
        resolve(obj);
    }

    /**加载并显示spine */
    public loadSpine(path: string, skeleton: sp.Skeleton, isCache: boolean = false): Promise<any | undefined> {
        return new Promise((resolve, reject) => {
            resources.load(path, sp.SkeletonData, (error: Error, assets: sp.SkeletonData) => {
                if (error) {
                    console.log("loadShowSpine->resource load failed:" + path + "," + error.message);
                    reject(error);
                    return;
                }
                LoadManager.updateObjAsset(skeleton, assets, resolve, reject, isCache);
            });
        });
    }
    /**加载并显示sprite */
    public loadSprite(path: string, sprite: Sprite, isCache: boolean = false): Promise<any | undefined> {
        return new Promise((resolve, reject) => {
            resources.load(path, SpriteFrame, (error: Error, assets: SpriteFrame) => {
                if (error) {
                    console.log("loadShowSprite->resource load failed:" + path + "," + error.message);
                    reject(error);
                    return;
                }
                LoadManager.updateObjAsset(sprite, assets, resolve, reject, isCache);
            });
        });
    }
    public loadRemoteSprite(urlPath: string, sprite: Sprite, isCache: boolean = false): Promise<any | undefined> {
        return new Promise((resolve, reject) => {
            console.log("loadRemote", urlPath);
            assetManager.loadRemote(urlPath, (error: Error, assets: ImageAsset) => {
                if (error) {
                    console.log("load->resource loadRemoteSprite failed:" + urlPath);
                    console.log("failed msg:" + error.message);
                    reject(error);
                    return;
                }
                LoadManager.updateObjAsset(sprite, assets, resolve, reject, isCache);
            });
        });
    }
    /**加载并显示prefab */
    public loadPrefab(path: string, parent: Node, isCache: boolean = false): Promise<any | undefined> {
        return new Promise((resolve, reject) => {
            resources.load("prefab/" + path, Prefab, (error: Error, assets: Prefab) => {
                if (error) {
                    console.log("loadShowPrefab->resource load failed:" + path + "," + error.message);
                    reject(error);
                    return;
                }
                //如果父节点不存或已经被销毁则直接返回
                if (!parent || !isValid(parent, true)) {
                    // assets.addRef();
                    this.addRefAsset(assets, isCache);
                    LoadManager.releaseAsset(assets);
                    // reject(new Error("parent is null or invalid"));
                    return;
                }
                let node = instantiate(assets);
                parent.addChild(node);
                node.once(Node.EventType.NODE_DESTROYED, () => {
                    LoadManager.releaseAsset(assets);
                });
                // assets.addRef();
                this.addRefAsset(assets, isCache);
                resolve(node);
            });
        });
    }
    /**加载prefab（同一parent同名预制体同时只加载1次） */
    public loadPrefabOne(path: string, parent: Node, isCache: boolean = false): Promise<any | undefined> {
        return new Promise((resolve, reject) => {
            let tmpName = "tmp_" + path.replaceAll("/", "_");
            if (parent.getChildByName(tmpName)) {
                return;
            }
            let tmpNode = new Node();
            tmpNode.name = tmpName;
            parent.addChild(tmpNode);
            this.loadPrefab(path, parent, isCache).then((node: Node) => {
                let tmp = parent.getChildByName(tmpName);
                if (tmp) {
                    tmp.destroy();
                }
                resolve(node);
            });
        });
    }

    // 获取资源包名
    public getBundleName(uuid: string) {
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
    public dumpResInfo() {
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

export const LoadManager = LoadManagerClass.instance;