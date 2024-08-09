import { Label, Node, Sprite, _decorator } from 'cc';
import { EventType } from '../../config/EventType';
import { NetConfig } from '../../config/NetConfig';
import { RemoteSoundMgr } from '../../manager/RemoteSoundManager';
import { CheckWordItem, ReqCollectWord } from '../../models/TextbookModel';
import { TBServer } from '../../service/TextbookService';
import CCUtil from '../../util/CCUtil';
import { EventMgr } from '../../util/EventManager';
import ListItem from '../../util/list/ListItem';
const { ccclass, property } = _decorator;

@ccclass('WordCheckSubItem')
export class WordCheckSubItem extends ListItem {
    @property(Label)
    public sentenceTxt:Label = null;

    @property(Label)
    public CntTxt:Label = null;

    @property(Node)
    public starNd:Node = null;

    @property(Node)
    public soundBtn:Node = null;

    private _subData:CheckWordItem = null;
    start() {
        this.initEvent();
    }
    initEvent(): void {
        CCUtil.onTouch(this.starNd, this.clickCollectEvent, this);
        CCUtil.onTouch(this.node, this.onShowMore, this);
        CCUtil.onTouch(this.soundBtn, this.playWordSound, this);
    }
    /**移除监听 */
    removeEvent() {
        CCUtil.offTouch(this.starNd, this.clickCollectEvent, this);
        CCUtil.offTouch(this.node, this.onShowMore, this);
        CCUtil.offTouch(this.soundBtn, this.playWordSound, this);
    }

    onShowMore() {
        EventMgr.dispatch(EventType.Word_Check_Item_Detail,this._subData);
    }

    updateSubItem(subData: CheckWordItem){
        this._subData = subData;
        this.CntTxt.string = subData.cn;
        this.sentenceTxt.string = subData.word;
        this.starNd.getComponent(Sprite).grayscale = !subData.collect;
    }
    playWordSound() {
        let wordSoundUrl = "/sounds/glossary/words/en/" + this._subData.word + ".wav";
        return RemoteSoundMgr.playSound(NetConfig.assertUrl + wordSoundUrl);
    }

    clickCollectEvent(){
        let reqParam: ReqCollectWord = {
            w_id: this._subData.w_id,
            action: this._subData.collect ? 0 : 1,
        }
        TBServer.reqCollectWord(reqParam);
        // this.starNd.getComponent(Sprite).grayscale = !this.starNd.getComponent(Sprite).grayscale;
    }

    onDestroy(): void {
        super.onDestroy();
        this.removeEvent();
    }
    
}


