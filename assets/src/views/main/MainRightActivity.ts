import { _decorator, isValid, Node, tween, UITransform, Vec3 } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ViewsManager } from '../../manager/ViewsManager';
import { BaseView } from '../../script/BaseView';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { MainActivityIds, MainActivityInfo, MainActivityInfos } from './MainInfo';
import { RightActivityItem } from './RightActivityItem';
const { ccclass, property } = _decorator;

@ccclass('MainRightActivity')
export class MainRightActivity extends BaseView {
    @property(List)
    public activity_list: List = null;

    @property(Node)
    public btn_hiden:Node = null;
    private _showPos:Vec3 = null;
    private _isShow:boolean = false;
    set showPos(pos:Vec3) {
        this._showPos = pos.clone();
    }
    protected initUI(): void {
        this.activity_list.numItems = MainActivityInfos.length;
    }
    protected initEvent(): void {
        CCUtil.onBtnClick(this.btn_hiden,this.onHidenClick.bind(this));
    }
    onLoadActivityListGrid(item:Node,idx:number){
        let item_script = item.getComponent(RightActivityItem);
        let itemInfo: MainActivityInfo = MainActivityInfos[idx];
        item_script.updateActivityItem(itemInfo);
    }
    onActivityListGridSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        console.log("onTaskListHorizontalSelected",selectedId);
        this.setActivityClick(MainActivityInfos[selectedId]);
    }

    setActivityClick(info:MainActivityInfo){
        switch (info.id) {
            case MainActivityIds.Package:
                this.onClickBag();
                break;
            case MainActivityIds.Collect:
                this.onClickCollect();
                break;
            case MainActivityIds.Rank:
                this.onClickRank();
                break;
            default:
                break;
        }
    }

    async onClickBag(){
        await ViewsManager.instance.showViewAsync(PrefabType.BagView);
    }

    async onClickCollect(){
        await ViewsManager.instance.showViewAsync(PrefabType.CollectView);
    }

    async onClickRank(){
        await ViewsManager.instance.showViewAsync(PrefabType.RankView);
    }
    public onHidenClick() {
        this._isShow = !this._isShow;
        this.showPlayerInfo(this._isShow);
    }

    public showPlayerInfo(isShow: boolean) {
        this._isShow = isShow;
        let node_size = this.node.getComponent(UITransform);
        let temp_width = node_size.width;
        let posx = this._isShow ? -temp_width : 0;
        tween(this.node).to(0.3, { position: new Vec3(this._showPos.x +posx, this._showPos.y, 0) }).call(() => {
        }).start();
    }


}

