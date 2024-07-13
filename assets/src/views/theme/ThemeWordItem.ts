import { _decorator, Component, Label, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ThemeWordItem')
export class ThemeWordItem extends Component {
    @property(Sprite)
    public wordImg: Sprite = null;
    @property(Label)
    public wordLabel: Label = null;
    @property(Label)
    public symbolLable: Label = null;
    private _data: any;
    start() {

    }

    initData(data: any) {
        this._data = data;
    }
}


