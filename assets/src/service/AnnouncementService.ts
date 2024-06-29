import { c2sAnnouncement } from "../models/AnnouncementModel";
import { InterfacePath } from "../net/InterfacePath";
import { NetMgr } from "../net/NetManager";
import { NetNotify } from "../net/NetNotify";
import { BaseControll } from "../script/BaseControll";


export class _AnnouncementService extends BaseControll {
    private static _instance: _AnnouncementService = null;
    public static get instance(): _AnnouncementService {
        if (this._instance == null) {
            this._instance = new _AnnouncementService("_AnnouncementService");
        }
        return this._instance;
    }
    constructor(name: string) {
        super(name);
    }

    /** 初始化模块事件 */
    protected onInitModuleEvent() {
        this.addModelListeners([
            [InterfacePath.Classification_Announcement, this.onAnnouncement],
        ]);
    }

    reqAnnouncement() {
        let param: c2sAnnouncement = new c2sAnnouncement();
        NetMgr.sendMsg(param);
    }

    onAnnouncement(data:any){
        this.handleResponse(data, NetNotify.Classification_Announcement);
    }
}

export const ATServer = _AnnouncementService.instance;