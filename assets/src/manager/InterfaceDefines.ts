/**
 * Name = InterfaceDefines
 * URL = db://assets/framework/InterfaceDefines.ts
 * Time = Thu Apr 14 2022 12:03:00 GMT+0800 (中国标准时间)
 * Author = xueya
 * Gui模块常用接口类型定义
 */

import { Node, Vec3, sp } from "cc";

// /** UI出现的类型 */
// export enum inf_LayerType {
//     Game = "LayerGame",     //游戏界面
//     UI = "LayerUI",         //ui界面(相同路径的预制体可同时存在)
//     PopUp = "LayerPopUp",   //弹窗(底部有黑色蒙版 屏蔽往下传递点击 多个节点可同时存在 不区分路径)
//     Dialog = "LayerDialog", //弹窗(继承LayerPopUp) 该层的节点将一次只显示一个
//     DialogTip = "LayerDialogTip", //弹窗(继承LayerPopUp) 该层的节点将一次只显示一个 dialog的子级
//     Alert = "LayerAlert",   //系统弹窗(继承LayerPopUp) 该层的节点将一次只显示一个
//     Animal = "LayerDialogAnimal",   //动画弹窗(继承LayerPopUp) 该层的节点将一次只显示一个
//     NetWindow = "LayerNet",//网络弹窗(继承LayerPopUp)该层的弹窗一次只能显示一个 且删除时会删除队列
//     Notify = "LayerNotify", //通知(吐司)同一个路径 会存入队列中 依次弹出
//     Guide = "LayerGuide"    //引导层 普通node
// }

/** UI配置结构体 */
export interface inf_UIConfig {
    /** 预制体路径(必填) */
    prefab: string;
    /** 包名(非必填 默认resource) */
    bundle?: string;
    /** ui类型 */
    // layer?: inf_LayerType;
    animation?: number;
    isSpine?: boolean;
}

/** Spine动画的添加创建 */
export interface inf_SpineAniCreate {
    /** 动画资源路径 */
    resConf: { bundle: string, path: string },
    /** 动画名 */
    aniName: string,
    /** 动画节点key */
    aniKey?: string,
    /** 父节点 Node */
    parentNode?: Node,
    /** 帧位置 number */
    trackIndex?: number,
    /** 是否循环播放 */
    isLoop?: boolean,
    /** 是否预乘 */
    isPremult?: boolean,
    /** 要添加的位置 */
    toPos?: Vec3,
    /** skin:皮肤 */
    skin?: any,
    /** 动画开始的监听 */
    callStartFunc?: (trackEntry: sp.spine.TrackEntry, skeleton: sp.Skeleton) => void,
    /** 动画结束的监听 */
    callEndFunc?: (trackEntry: sp.spine.TrackEntry, skeleton: sp.Skeleton) => void,
    /** 一次循环结束的监听 */
    oneLoopEndcallFunc?: (trackEntry: sp.spine.TrackEntry, skeleton: sp.Skeleton) => void,
    /** 执行过程中的动作监听 */
    processCallFunc?: (trackEntry: sp.spine.TrackEntry, event: sp.spine.Event | number, skeleton: sp.Skeleton) => void,
    /** 帧刷数量 值越大 刷新越快 不能超过当前最大帧率 */
    frameNum?: number,
}