import { _decorator, Component, Label, Node, Sprite, Toggle } from 'cc';
import { EventType } from '../../config/EventType';
import { LoadManager } from '../../manager/LoadManager';
import EventManager from '../../util/EventManager';
import { MyMedalInfo, SelectMedalInfo } from './AchieveDialogView';
const { ccclass, property } = _decorator;

@ccclass('AcieveMedalItem')
export class AcieveMedalItem extends Component {
    @property({ type: Node, tooltip: "图标" })
    public icon: Node = null;

    @property({ type: Label, tooltip: "名字图标" })
    public nameTxt: Label = null;

    @property({ type: Toggle, tooltip: "勾选框控件" })
    public toggle: Toggle = null;

    _data: MyMedalInfo = null;

    _isSelected: boolean = false; //勋章是否被选中
    _enabled: boolean = true; //勋章是否已经可用

    async init(data: MyMedalInfo) {
        this._data = data;
        this.nameTxt.string = data.nameTxt;
        this.toggle.isChecked = false;
        this._enabled = !this._data.icon.gray;
        if (!this.enabled) {
            this.toggle.enabled = false;
        }
        await LoadManager.loadSprite(this._data.icon.skin, this.icon.getComponent(Sprite)).then(() => { },
            (error) => {
                // console.log("loadShowSprite->resource load failed:" + this._data.icon.skin + "," + error.message);
            });
        if (this._data.icon.gray) {
            this.icon.getComponent(Sprite).grayscale = true;
        }
        else {
            this.icon.getComponent(Sprite).grayscale = false;
        }
        this.initEvent();
    }

    initEvent() {

        this.toggle.node.on(Toggle.EventType.TOGGLE, this.checkToggleEvent, this);
    }

    removeEvent() {

        this.toggle.node?.off(Toggle.EventType.TOGGLE, this.checkToggleEvent, this);
    }

    protected onDestroy(): void {
        this.removeEvent();
    }

    public checkToggleEvent(toggle: Toggle, data: string) {
        if (!this.enabled) {
            return;
        }
        const isCheck: boolean = toggle.isChecked;
        this._isSelected = isCheck;

        let medalData: SelectMedalInfo = {
            Selected: this._isSelected,
            MedalId: this._data.data.MedalId,
        }

        EventManager.emit(EventType.Achieve_SelectMedal, medalData)
    }

    start() {

    }

    update(deltaTime: number) {

    }
}


