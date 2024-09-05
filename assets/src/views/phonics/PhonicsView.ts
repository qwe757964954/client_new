import { _decorator, Color, Component, Label, Node, Vec3 } from 'cc';
import { BaseView } from '../../script/BaseView';
import CCUtil from '../../util/CCUtil';
const { ccclass, property } = _decorator;

@ccclass('PhonicsView')
export class PhonicsView extends BaseView {
    @property(Node)
    public symbolLabel: Node = null;
    @property(Node)
    public phoincsLabel: Node = null;
    @property(Node)
    public tabBg: Node = null;
    protected initUI(): void {

    }

    onSymbolLabelClick() {
        this.symbolLabel.getComponent(Label).color = Color.BLACK;
        this.phoincsLabel.getComponent(Label).color = Color.WHITE;
        let pos = this.tabBg.position;
        this.tabBg.position = new Vec3(-95, pos.y);
    }
    onPhoincsLabelClick() {
        this.symbolLabel.getComponent(Label).color = Color.WHITE;
        this.phoincsLabel.getComponent(Label).color = Color.BLACK;
        let pos = this.tabBg.position;
        this.tabBg.position = new Vec3(95, pos.y);
    }

    protected initEvent(): void {
        CCUtil.onTouch(this.symbolLabel, this.onSymbolLabelClick, this);
        CCUtil.onTouch(this.phoincsLabel, this.onPhoincsLabelClick, this);
    }

    protected removeEvent(): void {
        CCUtil.offTouch(this.symbolLabel, this.onSymbolLabelClick, this);
        CCUtil.offTouch(this.phoincsLabel, this.onPhoincsLabelClick, this);
    }

    onClose() {
        this.node.destroy();
    }
}


