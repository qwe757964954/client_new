import { _decorator, Component, Label, Node, UITransform } from 'cc';
import { BaseView } from '../../script/BaseView';
import List from '../../util/list/List';
const { ccclass, property } = _decorator;

@ccclass('SymbolNode')
export class SymbolNode extends BaseView {
    @property(Label)
    public titleLabel: Label = null;
    @property(List)
    symbolList: List = null;
    @property(UITransform)
    contentUt: UITransform = null;

    protected initUI(): void {
        this.symbolList.numItems = 20;
        this.node.getComponent(UITransform).height = this.contentUt.height;
    }
}


