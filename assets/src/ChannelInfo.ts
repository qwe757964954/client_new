// import { WxApi } from "./util/third/WxApi"

import GlobalConfig from "./GlobalConfig";

export const ChannelType = {
    Default: 200,//默认
    XiaoDu: 101,//小度
    XiWo: 102,//希沃
    IFLYTEK: 103,//科大讯飞
    BuBuGao: 104,//步步高
    XueErSi: 105,//学而思
    DuShuLang: 106,//读书郎
    YouXuePai: 107,//优学派
    ZuoYeBang: 108,//作业帮
    Apple: 201,//苹果
    HuaWei: 202,//华为
    RongYao: 203,//荣耀
    OPPO: 204,//OPPO
    Vivo: 205,//vivo
    Mi: 206,//小米
}

let cfgs = {
    [ChannelType.Default]: {
        name: "官方",
        // useSdk : WxApi,
    },
    [ChannelType.XiaoDu]: {
        name: "小度",
    }
}

export class ChannelInfo {
    public name: string;//渠道名字

    private constructor() { }
    private static _instance: ChannelInfo = null;
    public static instance() {
        if (!this._instance) {
            this._instance = new ChannelInfo();
        }
        return this._instance;
    }
    private clearData() {
        this.name = null;
    }
    /**刷新 渠道id获取会延迟 */
    public refresh() {
        this.clearData();
        let cfg = cfgs[GlobalConfig.CHANNEL_ID];
        this.name = cfg.name;
    }
}

export const ChannelCfg = ChannelInfo.instance();