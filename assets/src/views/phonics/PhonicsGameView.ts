import { _decorator, Component, Label, Node, Sprite } from 'cc';
import { BaseView } from '../../script/BaseView';
import List from '../../util/list/List';
import { DataMgr, PhonicsGameData } from '../../manager/DataMgr';
import { PhonicsGameItem } from './item/PhonicsGameItem';
import { EventMgr } from '../../util/EventManager';
import { EventType } from '../../config/EventType';
import { PhoincsGameOptItem } from './item/PhoincsGameOptItem';
import RemoteImageManager, { RemoteImgMgr } from '../../manager/RemoteImageManager';
import { NetConfig } from '../../config/NetConfig';
import { RemoteSoundMgr } from '../../manager/RemoteSoundManager';
const { ccclass, property } = _decorator;

@ccclass('PhonicsGameView')
export class PhonicsGameView extends BaseView {
    @property(List)
    public symbolList: List = null;
    @property(Sprite)
    public wordImg: Sprite = null;
    @property(Label)
    public wordLabel: Label = null;
    @property(List)
    public optinList: List = null;

    private _optionsData: PhonicsGameData;
    private _dataArray: any[] = [];

    protected initUI(): void {
        this._dataArray = DataMgr.getPhonicsGameConfig();
        this.symbolList.numItems = this._dataArray.length;
        EventMgr.dispatch(EventType.Phonics_Game_Item_Click, this._dataArray[0]);
        RemoteImageManager.i.loadImage(
            `${NetConfig.assertUrl}/phonics/imgs/game/doubt.jpg`,
            this.wordImg
        );
    }

    onGameItemRender(item: Node, index: number) {
        item.getComponent(PhonicsGameItem).setData(this._dataArray[index]);
    }

    onItemClick(data: PhonicsGameData) {
        RemoteImageManager.i.loadImage(
            `${NetConfig.assertUrl}/phonics/imgs/game/doubt.jpg`,
            this.wordImg
        );
        for (let i = 0; i < this.symbolList.numItems; i++) {
            let itemNode = this.symbolList.getItemByListId(i);
            if (!itemNode) continue;
            let item: PhonicsGameItem = itemNode.getComponent(PhonicsGameItem);
            item.isSelect = item.data == data;
            if (item.data == data) {
                this._optionsData = data;
                this.optinList.numItems = data.options.length;
                this.wordLabel.string = "_" + data.content;
            }
        }
    }

    onOptionsRender(item: Node, index: number) {
        item.getComponent(PhoincsGameOptItem).setData(this._optionsData.options[index]);
    }

    onOptClick(data: string) {
        for (let i = 0; i < this.optinList.numItems; i++) {
            let itemNode = this.optinList.getItemByListId(i);
            if (!itemNode) continue;
            let item: PhoincsGameOptItem = itemNode.getComponent(PhoincsGameOptItem);
            item.isSelect = item.data == data;
        }
        let word = data + this._optionsData.content;
        this.wordLabel.string = word;
        RemoteImageManager.i.loadImage(
            `${NetConfig.assertUrl}/imgs/words/${word}.jpg`,
            this.wordImg
        );

        const wordSoundUrl = `/sounds/glossary/words/en/${word}.wav`;
        RemoteSoundMgr.playSound(`${NetConfig.assertUrl}${wordSoundUrl}`);
    }

    protected initEvent(): void {
        EventMgr.addListener(EventType.Phonics_Game_Item_Click, this.onItemClick, this);
        EventMgr.addListener(EventType.Phonics_Game_Opt_Click, this.onOptClick, this);
    }

    protected removeEvent(): void {
        EventMgr.removeListener(EventType.Phonics_Game_Item_Click, this);
        EventMgr.removeListener(EventType.Phonics_Game_Opt_Click, this);
    }

    onDestroy(): void {
        super.onDestroy();
        RemoteSoundMgr.clearAudio();
        RemoteImgMgr.clearImageAsset();
    }
}


