import { _decorator, Component, Node, sp } from 'cc';
import CCUtil from '../../../util/CCUtil';
import { ViewsManager } from '../../../manager/ViewsManager';
import { PrefabType } from '../../../config/PrefabType';
import { MapProcessRewardView } from '../common/MapProcessRewardView';
const { ccclass, property } = _decorator;

@ccclass('MapRewardBoxItem')
export class MapRewardBoxItem extends Component {
    @property(sp.Skeleton)
    skeleton: sp.Skeleton = null;
    private _data: any;
    start() {
        CCUtil.onTouch(this.node, this.onClick, this);
    }

    async onClick() {
        console.log("clickBox", this._data);
        let node: Node = await ViewsManager.instance.showPopup(PrefabType.MapProcessRewardView);
        let nodeScript: MapProcessRewardView = node.getComponent(MapProcessRewardView);
        nodeScript.updateRewardScroll([]);
    }

    setData(data: any) {
        this._data = data;
    }

    onDestroy() {
        CCUtil.offTouch(this.node, this.onClick, this);
    }
}


