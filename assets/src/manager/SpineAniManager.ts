import { Node, Vec3, _decorator, assetManager, error, sp } from 'cc';
import { EventType } from '../config/EventType';
import { BaseControll } from '../script/BaseControll';
import ImgUtil from '../util/ImgUtil';
import { ObjectUtil } from '../util/ObjectUtil';
import { inf_SpineAniCreate, inf_UIConfig } from './InterfaceDefines';

const { ccclass } = _decorator;

/**
 * Spine 动画管理器
 * 负责加载和播放 Spine 动画。
 */
@ccclass('SpineAniManager')
export class SpineAniManager extends BaseControll {
    private static _instance: SpineAniManager | null = null;
    private _skinAniMapping: { [key: string]: sp.SkeletonData } = {};
    public AniNodeMap: Map<string, Node> = new Map();

    // 私有构造函数，确保单例模式
    private constructor() {
        super("SpineAniManager");
    }

    /**
     * 获取 SpineAniManager 的单例实例
     * @returns SpineAniManager 实例
     */
    public static getInstance(): SpineAniManager {
        if (!this._instance) {
            this._instance = new SpineAniManager();
        }
        return this._instance;
    }

    /**
     * 初始化模块事件
     */
    protected onInitModuleEvent(): void {
        this.addModelListener(EventType.Sys_Ani_Play, this.startPlayAni);
        this.addModelListener(EventType.Sys_Ani_Stop, this.stopPlayAni);
    }

    /**
     * 初始化 SpineAniManager 实例
     * @returns SpineAniManager 实例
     */
    public static init(): SpineAniManager {
        this._instance?.clear();
        this._instance = null;
        return this.getInstance();
    }

    /**
     * 预加载指定目录中的 Spine 动画资源
     * @param bundle - 资源包名称
     * @param dirPath - 目录路径
     * @param upFunc - 进度更新回调函数
     * @param cb - 完成回调函数
     */
    public preLoadSkinAniDir(bundle: string, dirPath: string, upFunc?: (finished: number, total: number, item: any) => void, cb?: (err: Error | null, data: any) => void): void {
        if (!dirPath) return;

        const filePathList = dirPath.split("/");
        const preKey = `${bundle}|${filePathList.length > 1 ? filePathList[0] : ""}`;
		if(filePathList.length > 1){
			dirPath = filePathList[0];
		}
        assetManager.loadBundle(bundle, (err, bundle) => {
            if (err) {
                error("加载资源包时出错:", err);
                cb?.(err, bundle);
                return;
            }
            bundle.loadDir(dirPath, sp.SkeletonData,
                (finished: number, total: number, item) => upFunc?.(finished, total, item),
                (err, data: any) => {
                    if (err) {
                        error("加载目录时出错:", err);
                        cb?.(err, data);
                        return;
                    }
                    data.forEach((item: any) => {
                        const fileName = item["_name"];
                        if (fileName) {
                            const keyName = `${preKey}|${fileName}`;
                            this._skinAniMapping[keyName] = item;
                        }
                    });
                    cb?.(null, data);
                }
            );
        });
    }

    /**
     * 预加载 Spine 动画目录列表
     * @param list - 资源配置列表
     * @param updateFunc - 进度更新回调函数
     * @param cb - 完成回调函数
     */
    public preLoadSkinAniDirList(list: Array<inf_UIConfig>, updateFunc?: (finished: number, total: number, item: any) => void, cb?: (err: Error | null, data: any) => void): void {
        if (!list || list.length <= 0) return;
        list.forEach(resConf => {
            if (ObjectUtil.isNotNull(resConf.bundle, resConf.prefab)) {
                this.preLoadSkinAniDir(resConf.bundle, resConf.prefab, updateFunc, cb);
            }
        });
    }

    /**
     * 开始播放 Spine 动画
     * @param param - 动画参数
     */
    private startPlayAni(param: inf_SpineAniCreate): void {
        if (!param || !param.resConf || !param.aniName) return;
		this._skinAniMapping = {}
        param.isLoop = param.isLoop ?? false;
        param.isPremult = param.isPremult ?? false;
        param.toPos = param.toPos ?? new Vec3(0, 0, 0);
        param.trackIndex = param.trackIndex ?? 0;

        if (!param.parentNode) {
            error("父节点不存在。");
            return;
        }

        this.setSpineAni(param.parentNode, param.resConf, param.trackIndex, param.aniName, param.isLoop, param.isPremult, param.skin, param.toPos, param.callStartFunc, param.callEndFunc, param.oneLoopEndcallFunc, param.processCallFunc, param.frameNum, param.aniKey);
    }

    /**
     * 停止播放 Spine 动画
     * @param param - 动画参数
     */
    private stopPlayAni(param: inf_SpineAniCreate): void {
        if (!param || !param.resConf || !param.aniName) return;

        const key = `${param.resConf.bundle}|${param.resConf.path}|${param.aniName}`;
        const aniNode = this.getSpineNode(key);

        if (!aniNode || !aniNode.isValid) {
            this.AniNodeMap.set(key, null);
            return;
        }

        if (aniNode.parent !== param.parentNode) return;

        if (aniNode.isValid) {
            aniNode.destroy();
        }

        this.AniNodeMap.set(key, null);
    }

    /**
     * 根据关键字获取 Spine 动画节点
     * @param key - 关键字
     * @returns 动画节点或 null
     */
    public getSpineNode(key: string): Node | null {
        return this.AniNodeMap.get(key) ?? null;
    }

    /**
     * 移除 Spine 动画节点
     * @param aniNode - 动画节点
     */
    public removeSpineNode(aniNode: Node): void {
        const key = aniNode?.["Anikey"];
        if (key && aniNode.isValid) {
            aniNode.destroy();
            this.AniNodeMap.set(key, null);
        }
    }

    /**
     * 设置并播放 Spine 动画
     * @param parentNode - 父节点
     * @param resData - 资源数据
     * @param trackIndex - 轨道索引
     * @param name - 动画名称
     * @param loop - 是否循环
     * @param premultipliedAlpha - 是否使用预乘 Alpha
     * @param skin - 皮肤
     * @param pos - 位置
     * @param startCallFunc - 开始回调
     * @param endCallFunc - 结束回调
     * @param oneLoopEndCallFunc - 单次循环结束回调
     * @param processCallFunc - 进程回调
     * @param frameNum - 帧数
     * @param aniKey - 动画关键字
     */
    public setSpineAni(
        parentNode: Node,
        resData: { bundle: string, path: string },
        trackIndex: number,
        name: string,
        loop: boolean = false,
        premultipliedAlpha: boolean = false,
        skin: string | null = null,
        pos: Vec3 | null = null,
        startCallFunc?: (trackEntry: sp.spine.TrackEntry, skeleton: sp.Skeleton) => void,
        endCallFunc?: (trackEntry: sp.spine.TrackEntry, skeleton: sp.Skeleton) => void,
        oneLoopEndCallFunc?: (trackEntry: sp.spine.TrackEntry, skeleton: sp.Skeleton) => void,
        processCallFunc?: (trackEntry: sp.spine.TrackEntry, event: sp.spine.Event | number, skeleton: sp.Skeleton) => void,
        frameNum?: number,
        aniKey: string = ""
    ): Node | undefined {
        const key = `${resData.bundle}|${resData.path}|${name}|${aniKey}`;
        if (!parentNode || !parentNode.isValid) {
            error("父节点无效。");
            return;
        }

        const oldAniNode = parentNode.getChildByName(key);
        oldAniNode?.destroy();

        const node = ImgUtil.create_2DNode(key);
        node.addComponent(sp.Skeleton);

        this.setAnimationData(node, resData, trackIndex, name, loop, premultipliedAlpha, skin, startCallFunc, endCallFunc, oneLoopEndCallFunc, processCallFunc, frameNum);

        if (pos) {
            node.position = pos;
        }

        parentNode.addChild(node);
        node["Anikey"] = key;
        this.AniNodeMap.set(key, node);
        return node;
    }

    /**
     * 配置节点的动画数据
     * @param node - 节点
     * @param resData - 资源数据
     * @param trackIndex - 轨道索引
     * @param name - 动画名称
     * @param loop - 是否循环
     * @param premultipliedAlpha - 是否使用预乘 Alpha
     * @param skin - 皮肤
     * @param startCallFunc - 开始回调
     * @param endCallFunc - 结束回调
     * @param oneLoopEndCallFunc - 单次循环结束回调
     * @param processCallFunc - 进程回调
     * @param frameNum - 帧数
     */
    private setAnimationData(
        node: Node,
        resData: { bundle: string, path: string },
        trackIndex: number,
        name: string,
        loop: boolean,
        premultipliedAlpha: boolean,
        skin: string | null = null,
        startCallFunc?: (trackEntry: sp.spine.TrackEntry, skeleton: sp.Skeleton) => void,
        endCallFunc?: (trackEntry: sp.spine.TrackEntry, skeleton: sp.Skeleton) => void,
        oneLoopEndCallFunc?: (trackEntry: sp.spine.TrackEntry, skeleton: sp.Skeleton) => void,
        processCallFunc?: (trackEntry: sp.spine.TrackEntry, event: sp.spine.Event | number, skeleton: sp.Skeleton) => void,
        frameNum?: number
    ): void {
        const filePathName = ObjectUtil.stringSplitFileName(resData.path);
        const filePathList = resData.path.split("/");
        const key = `${resData.bundle}|${filePathList.length > 1 ? `${filePathList[0]}|${filePathName}` : filePathName}`;

        let skinData = this._skinAniMapping[key];
        if (!skinData) {
            this.preLoadSkinAniDir(resData.bundle, resData.path, null, () => this.setAnimationData(node, resData, trackIndex, name, loop, premultipliedAlpha, skin, startCallFunc, endCallFunc, oneLoopEndCallFunc, processCallFunc, frameNum));
            return;
        }

        if (!node || !node.isValid) return;

        const skeleton = node.getComponent(sp.Skeleton)!;
        skeleton.skeletonData = skinData;
        if (skin) skeleton.setSkin(skin);
        let isEndCallback = false;

        skeleton.setStartListener((trackEntry: sp.spine.TrackEntry) => startCallFunc?.(trackEntry, skeleton));
        skeleton.setEndListener((trackEntry: sp.spine.TrackEntry) => {
            if (!isEndCallback) {
                isEndCallback = true;
                endCallFunc?.(trackEntry, skeleton);
            }
            this.removeSpineNode(node);
        });
        skeleton.setCompleteListener((trackEntry: sp.spine.TrackEntry) => {
            if (!loop) {
                this.removeSpineNode(node);
                if (!isEndCallback) {
                    isEndCallback = true;
                    endCallFunc?.(trackEntry, skeleton);
                }
                oneLoopEndCallFunc?.(trackEntry, skeleton);
            } else {
                oneLoopEndCallFunc?.(trackEntry, skeleton);
            }
        });
        skeleton.setEventListener((trackEntry: sp.spine.TrackEntry, event: sp.spine.Event | number) => processCallFunc?.(trackEntry, event, skeleton));

        if (frameNum != null && frameNum > 0) {
            if (!skeleton["realUpdateAnimation"]) {
                skeleton["realUpdateAnimation"] = skeleton.updateAnimation;
            }
            let interval = 0;
            skeleton.updateAnimation = (dt) => {
                if ((interval + dt) < (1 / frameNum)) {
                    interval += dt;
                    return;
                }
                interval = 0;
                skeleton["realUpdateAnimation"](dt);
            };
        }

        skeleton.premultipliedAlpha = premultipliedAlpha;
        skeleton.setAnimation(trackIndex, name, loop);
    }

    /**
     * 根据包路径获取 Spine 动画节点
     * @param param - 动画参数
     * @returns 动画节点或 null
     */
    public getSpineByBundlePath(param: inf_SpineAniCreate): Node | null {
        if (!param || !param.resConf || !param.aniName) return null;

        const key = `${param.resConf.bundle}|${param.resConf.path}|${param.aniName}|${param.aniKey ?? ""}`;
        return this.getSpineNode(key);
    }
}

export const SpMgr = SpineAniManager.getInstance();
