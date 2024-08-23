import { _decorator, Label, Node, Sprite } from 'cc';
import { NetConfig } from '../../../config/NetConfig';
import { RemoteSoundMgr } from '../../../manager/RemoteSoundManager';
import { UnitWord } from '../../../models/AdventureModel';
import CCUtil from '../../../util/CCUtil';
import ListItem from '../../../util/list/ListItem';
const { ccclass, property } = _decorator;

@ccclass('ThemeWordItem')
export class ThemeWordItem extends ListItem {
    @property(Sprite)
    public bgSprite: Sprite = null;
    @property(Label)
    public wordLabel: Label = null;
    @property(Label)
    public symbolLable: Label = null;
    @property(Label)
    public cnLabel: Label = null;
    @property(Node)
    public soundNode: Node = null;
    @property(Node)
    public collectNode: Node = null;
    private _data: any;

    private _isCollect: boolean = false;

    protected start(): void {
        this.initEvent();
    }

    initData(data: UnitWord) {
        this._data = data;
        this.wordLabel.string = data.word;
        this.symbolLable.string = data.symbol;
        this.cnLabel.string = data.cn;
        this._isCollect = false;
        this.collectNode.getComponent(Sprite).grayscale = !this._isCollect;
    }

    protected onSoundClick() {
        let word = this._data.word;
        let wordSoundUrl = "";
        wordSoundUrl = "/sounds/glossary/words/en/" + word + ".wav";
        return RemoteSoundMgr.playSound(NetConfig.assertUrl + wordSoundUrl);
    }

    onCollect() {
        this._isCollect = !this._isCollect;
        this.collectNode.getComponent(Sprite).grayscale = !this._isCollect;
    }

    protected initEvent(): void {
        CCUtil.onBtnClick(this.soundNode, this.onSoundClick.bind(this));
        CCUtil.onBtnClick(this.collectNode, this.onCollect.bind(this));
    }


}


