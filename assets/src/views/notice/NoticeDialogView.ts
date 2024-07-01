import { _decorator, isValid, Label, Node } from 'cc';
import { AnnouncementDataResponse, AnnouncementItem } from '../../models/AnnouncementModel';
import { NetNotify } from '../../net/NetNotify';
import { BasePopup } from '../../script/BasePopup';
import { ATServer } from '../../service/AnnouncementService';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { NoticeItem } from './NoticeItem';
const { ccclass, property } = _decorator;

@ccclass('NoticeDialogView')
export class NoticeDialogView extends BasePopup {
    @property(Node)
    public content: Node = null;
    @property(Label)
    public txtNotice: Label = null;

    @property(Node)
    public btnClose: Node = null;

    @property(List)
    public noticeList: List = null;
    private _announcement_list: AnnouncementItem[] = [];
    protected initUI(): void {
        ATServer.reqAnnouncement();
        this.enableClickBlankToClose([this.node.getChildByName("content")]).then(()=>{
        });
    }
    onInitModuleEvent() {
        this.addModelListeners([
            [NetNotify.Classification_Announcement, this.onAnnouncement],
        ]);
        
    }

    onAnnouncement(response: AnnouncementDataResponse){
        console.log('onAnnouncement', response);
        this._announcement_list = response.announcement_list;
        this.noticeList.numItems = this._announcement_list.length;
    }

    onLoadAnnouncementVertical(item:Node, idx:number){
        let item_script = item.getComponent(NoticeItem);
        let friendData: any = this._announcement_list[idx];
        item_script.updateProps(friendData);
    }

    onAnnouncementVerticalSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        console.log("onTabLeftVerticalSelected",selectedId);
        // this._clickListener?.(selectedId);
    }

    protected initEvent(): void {
        CCUtil.onBtnClick(this.btnClose, this.onBtnCloseClick.bind(this));
    }
    // 关闭按钮点击
    onBtnCloseClick() {
        this.closePop();
    }
}


