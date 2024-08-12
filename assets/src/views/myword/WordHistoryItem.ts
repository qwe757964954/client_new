import { _decorator, Label, Node, Sprite } from 'cc';
import { EventType } from '../../config/EventType';
import { NetConfig } from '../../config/NetConfig';
import { TextConfig } from '../../config/TextConfig';
import { RemoteSoundMgr } from '../../manager/RemoteSoundManager';
import CCUtil from '../../util/CCUtil';
import { EventMgr } from '../../util/EventManager';
import ListItem from '../../util/list/ListItem';
import { SearchWordItem } from './MyWordInfo';
const { ccclass, property } = _decorator;

@ccclass('WordHistoryItem')
export class WordHistoryItem extends ListItem {
    @property(Sprite)
    private bg: Node = null;

    @property(Label)
    private lblWord: Label = null;

    @property(Label)
    private cnTxt: Label = null;

    @property(Label)
    private symbolLabel: Label = null;
    
    @property({ type: Node })
    public btn_more: Node = null;

    @property({ type: Node })
    public btn_horn: Node = null;
    
    @property({ type: Node })
    public btn_collect: Node = null;

    private _data: SearchWordItem = null;

    onLoad(): void {
        this.initEvent();
    }

    public updateWordProps(data: SearchWordItem) {
        this._data = data;
        this.lblWord.string = data.word;
        this.cnTxt.string = data.cn;
        this.symbolLabel.string = TextConfig.US + data.symbolus + "";
        this.btn_collect.getComponent(Sprite).grayscale = data.is_collect ? false : true;
    }

    initEvent() {
        CCUtil.onBtnClick(this.btn_more, this.onShowMore.bind(this));
        CCUtil.onBtnClick(this.btn_collect, this.onCollect.bind(this));
        CCUtil.onBtnClick(this.btn_horn, this.onPlaySound.bind(this));
    }

    onShowMore() {
        EventMgr.dispatch(EventType.Search_Word_Item_Detail,this._data);
    }
    onPlaySound(){
        let wordSoundUrl = "/sounds/glossary/words/uk/" + this._data.word + ".wav";
        RemoteSoundMgr.playSound(NetConfig.assertUrl + wordSoundUrl);
    }
    onCollect(){
        EventMgr.dispatch(EventType.Search_Collect_Work,this._data);
    }
}


