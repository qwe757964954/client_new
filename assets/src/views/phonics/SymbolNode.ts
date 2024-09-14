import { _decorator, Component, Label, Node, UITransform } from 'cc';
import { BaseView } from '../../script/BaseView';
import List from '../../util/list/List';
import { SymbolItem } from './item/SymbolItem';
import { PhonicsConfigData } from '../../manager/DataMgr';
const { ccclass, property } = _decorator;

@ccclass('SymbolNode')
export class SymbolNode extends BaseView {
    @property(Label)
    public titleLabel: Label = null;
    @property(List)
    symbolList: List = null;
    @property(UITransform)
    contentUt: UITransform = null;

    private _data: { title: string, list: PhonicsConfigData[] };

    public setData(data: { title: string, list: PhonicsConfigData[] }) {
        this._data = data;
        this.titleLabel.string = data.title;
    }

    protected onEnable(): void {
        this.symbolList.numItems = this._data.list.length;
    }

    public changeSelectStatus(data: PhonicsConfigData) {
        for (let i = 0; i < this.symbolList.numItems; i++) {
            let itemNode = this.symbolList.getItemByListId(i);
            if (!itemNode) continue;
            let item: SymbolItem = itemNode.getComponent(SymbolItem);
            item.isSelect = item.data == data;
        }
    }

    onSymbolItemRender(item: Node, index: number) {
        item.getComponent(SymbolItem).setData(this._data.list[index]);
    }
}


