import { _decorator, Component, instantiate, isValid, Node, Prefab, Widget } from 'cc';
import { ViewsManager } from '../../manager/ViewsManager';
import { PrefabType } from '../../config/PrefabType';
import { LoadManager } from '../../manager/LoadManager';
import { AmoutItemData, AmoutType, TopAmoutView } from '../common/TopAmoutView';
const { ccclass, property } = _decorator;

@ccclass('MemberCentreView')
export class MemberCentreView extends Component {
    @property(Node)
    public top_layout:Node = null;          // 个人中心

    protected onLoad(): void {
        
    }
    
    protected initUI(){
        this.initAmout();
    }
    /**初始化游戏数值 */
    initAmout(){
        LoadManager.loadPrefab(PrefabType.TopAmoutView.path).then((prefab: Prefab) => {
            let node = instantiate(prefab);
            this.top_layout.addChild(node);
            let widgetCom = node.getComponent(Widget);
            if(!isValid(widgetCom)){
                widgetCom = node.addComponent(Widget);
                widgetCom.isAlignRight = true;
                widgetCom.isAlignVerticalCenter = true;
            }
            widgetCom.right = 22.437;
            widgetCom.verticalCenter = 15.78;
            widgetCom.updateAlignment();
            let amoutScript = node.getComponent(TopAmoutView);
            let dataArr:AmoutItemData[] = [{type:AmoutType.Diamond,num:0},
                {type:AmoutType.Coin,num:0},
                {type:AmoutType.Energy,num:0}];
            amoutScript.loadAmoutData(dataArr);
            console.log("initAmout______________",this.top_layout);
        });
    }
    
    start() {
        this.initUI();
    }

    update(deltaTime: number) {
        
    }

    
    // 关闭
    btnCloseFunc() {
        console.log("btnCloseFunc");
        ViewsManager.instance.closeView(PrefabType.MemberCentreView);
    }
}


