import { _decorator, Component, Node, sp } from 'cc';
import CCUtil from '../../../util/CCUtil';
import { ViewsManager } from '../../../manager/ViewsManager';
import { PrefabType } from '../../../config/PrefabType';
import { MapProcessRewardView } from '../common/MapProcessRewardView';
import { ProgressRewardData } from '../../../models/AdventureModel';
const { ccclass, property } = _decorator;

@ccclass('MapRewardBoxItem')
export class MapRewardBoxItem extends Component {
    @property(sp.Skeleton)
    skeleton: sp.Skeleton = null;
    private _data: ProgressRewardData;
    private _passNum: number;
    start() {

    }

    async onClick() {
        console.log("clickBox", this._data);
        let node: Node = await ViewsManager.instance.showPopup(PrefabType.MapProcessRewardView);
        let nodeScript: MapProcessRewardView = node.getComponent(MapProcessRewardView);
        nodeScript.updateRewardScroll(this._data, this._passNum, this);
    }

    setData(data: ProgressRewardData, passNum: number) {
        this._data = data;
        this._passNum = passNum;
        if (this._data.open == 1) {
            this.skeleton.setAnimation(0, "idle_open", true);
        } else {
            if (this._passNum >= data.pass_count) {
                this.skeleton.setAnimation(0, "idle_jump", true);
            } else {
                this.skeleton.setAnimation(0, "idle", true);
            }
            CCUtil.onTouch(this.node, this.onClick, this);
        }
    }

    openBox() {
        this._data.open = 1;
        CCUtil.offTouch(this.node, this.onClick, this);
        return new Promise<void>((resolve, reject) => {
            this.skeleton.setCompleteListener(() => {
                this.skeleton.setCompleteListener(null);
                this.skeleton.setAnimation(0, "idle_open", true);
                resolve();
            });
            this.skeleton.setAnimation(0, "open", false);

        });
    }

    onDestroy() {
        CCUtil.offTouch(this.node, this.onClick, this);
    }
}


