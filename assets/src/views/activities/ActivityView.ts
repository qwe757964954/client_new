import { _decorator, Node } from 'cc';
import { PrefabType, PrefabTypeEntry } from '../../config/PrefabType';
import { ViewsManager } from '../../manager/ViewsManager';
import { User } from '../../models/User';
import { BaseView } from '../../script/BaseView';
import { AmoutItemData, AmoutType, TopAmoutView } from '../common/TopAmoutView';
const { ccclass, property } = _decorator;

@ccclass('RankView')
export class RankView extends BaseView {
    @property(Node)
    public top_layout: Node = null;

    @property(Node)
    public content_layout: Node = null;
    
    protected async initUI() {
        this.initNavTitle();
        this.initAmout();
        this.viewAdaptScreen();
    }

    private async initViewComponent(prefabType: PrefabTypeEntry, onComponentInit: (node: Node) => void, alignOptions?: object) {
        let node = await this.loadAndInitPrefab(prefabType, this.node, alignOptions);
        onComponentInit(node);
    }
    private initNavTitle() {
        this.createNavigation("新人豪礼",this.top_layout, () => {
            ViewsManager.instance.closeView(PrefabType.ActivityView);
        });
    }

    private initAmout() {
        this.createTopAmout([
            { type: AmoutType.Diamond, num: User.diamond },
            { type: AmoutType.Coin, num: User.coin },
            { type: AmoutType.Energy, num: User.stamina }
        ]);
    }

    private async createTopAmout(dataArr: AmoutItemData[]) {
        let amoutScript: TopAmoutView = await ViewsManager.addAmout(this.top_layout, 6.501, 71.254);
        amoutScript.loadAmoutData(dataArr);
    }
}

