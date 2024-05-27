import { Label, Node, Sprite, _decorator } from 'cc';
import { NetConfig } from '../../config/NetConfig';
import { RemoteSoundMgr } from '../../manager/RemoteSoundManager';
import { CheckWordItem } from '../../models/TextbookModel';
import CCUtil from '../../util/CCUtil';
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
        CCUtil.onTouch(this.soundBtn, this.playWordSound, this);
    }
    /**移除监听 */
    removeEvent() {
        CCUtil.offTouch(this.starNd, this.clickCollectEvent, this);
        CCUtil.offTouch(this.soundBtn, this.playWordSound, this);
    }
    updateSubItem(subData: CheckWordItem){
        this._subData = subData;
        this.CntTxt.string = subData.cn;
        this.sentenceTxt.string = subData.word;
    }
    playWordSound() {
        let wordSoundUrl = "/sounds/glossary/words/en/" + this._subData.word + ".wav";
        return RemoteSoundMgr.playSound(NetConfig.assertUrl + wordSoundUrl);
    }

    clickCollectEvent(){
        this.starNd.getComponent(Sprite).grayscale = !this.starNd.getComponent(Sprite).grayscale;
    }

    onDestroy(): void {
        super.onDestroy();
        this.removeEvent();
    }
    
}


