import { _decorator, instantiate, Layers, Node, Prefab } from 'cc';
import { EventType } from '../../../config/EventType';
import { PrefabType } from '../../../config/PrefabType';
import { ViewsManager } from '../../../manager/ViewsManager';
import { RoleBaseModel } from '../../../models/RoleBaseModel';
import { BaseView } from '../../../script/BaseView';
import CCUtil from '../../../util/CCUtil';
import { EventMgr } from '../../../util/EventManager';
import List from '../../../util/list/List';
import { NodeUtil } from '../../../util/NodeUtil';
const { ccclass, property } = _decorator;

@ccclass('WordReportView')
export class WordReportView extends BaseView {

    @property(Node)
    public level_list_btn:Node = null;

    @property(Node)
    public evaluation_btn:Node = null;

    @property(Node)
    public next_level_btn:Node = null;

    @property(List)
    public reward_scroll:List = null;

    @property(List)
    public condition_scroll:List = null;

    @property(Prefab)
    public roleModel: Prefab = null;//角色

    @property(Node)
    public role_node:Node = null;

    start() {
        this.initUI();
        this.initEvents();
    }

    initUI() {
        this.initRolePlayer();
        this.reward_scroll.numItems = 7;
        this.condition_scroll.numItems = 3;
    }

    initEvents() {
        CCUtil.onBtnClick(this.evaluation_btn,()=>{
            this.gotoEvaluation();
        });
        CCUtil.onBtnClick(this.level_list_btn,()=>{
            this.gotoLevelList();
        });
        CCUtil.onBtnClick(this.next_level_btn,()=>{
            this.gotoNextLevel();
        });
        
    }
    gotoEvaluation(){
        console.log("测评模式")
    }

    gotoNextLevel(){
        console.log("下一关卡")
        ViewsManager.instance.closeView(PrefabType.WordReportView);
        EventMgr.dispatch(EventType.Goto_Textbook_Next_Level);
    }

    gotoLevelList(){
        console.log("关卡列表")
        EventMgr.dispatch(EventType.Exit_Island_Level);
        ViewsManager.instance.closeView(PrefabType.WordReportView);
    }
    onInitModuleEvent(){
        
    }
    async initRolePlayer(){
        console.log("initRolePlayer  关卡列表")
        let role = instantiate(this.roleModel);
        this.role_node.addChild(role);
        NodeUtil.setLayerRecursively(role,Layers.Enum.UI_2D);
        let roleModel = role.getComponent(RoleBaseModel);
        await roleModel.init(101, 1, [9500, 9700, 9701, 9702, 9703]);
        roleModel.show(true);
        roleModel.standby();
    }

    onLoadRewardHorizontal(item:Node, idx:number){

        // let unitStatus:UnitItemStatus = this._unitListArr[idx];
        // item_sript.updateRewardStatus(unitStatus.studywordnum >=unitStatus.totalwordnum);
    }

    onLoadConditionVertical(item:Node, idx:number){
        
    }
}


