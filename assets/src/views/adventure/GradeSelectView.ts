import { _decorator, Component, Label, Node } from 'cc';
import { BaseView } from '../../script/BaseView';
import List from '../../util/list/List';
const { ccclass, property } = _decorator;

@ccclass('GradeSelectView')
export class GradeSelectView extends BaseView {
    @property(Node)
    public closeBtn: Node = null;
    @property(List)
    public levelList: List = null;
    @property(Node)
    public sureBtn: Node = null;
    @property(Label)
    public selectLabel: Label = null;

    setData() {

    }

    onLevelListRender(item: Node, index: number) {

    }

    protected initEvent(): void {

    }

    protected removeEvent() {

    }

}


