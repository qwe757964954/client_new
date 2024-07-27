import { _decorator, Label, Node } from 'cc';
import { NetConfig } from '../../config/NetConfig';
import { TextConfig } from '../../config/TextConfig';
import { RemoteSoundMgr } from '../../manager/RemoteSoundManager';
import { WordsDetailData } from '../../models/AdventureModel';
import { BaseView } from '../../script/BaseView';
import CCUtil from '../../util/CCUtil';
import ImgUtil from '../../util/ImgUtil';
import { WordDetailView } from '../common/WordDetailView';
const { ccclass, property } = _decorator;

@ccclass('WordPanel')
export class WordPanel extends BaseView {
    @property(WordDetailView)
    public wordDetailView: WordDetailView = null;

    @property(Label)
    public wordLabel: Label = null;

    @property(Label)
    public symbolLabel: Label = null;

    @property(Label)
    public cnLabel: Label = null;

    @property(Node)
    public wordImg: Node = null;

    @property(Node)
    public btn_zoom:Node = null;

    @property(Node)
    public horn:Node = null;

    private _detailData:WordsDetailData = null;

    protected initEvent(): void {
        CCUtil.onBtnClick(this.btn_zoom,this.onZoomChange.bind(this));
        CCUtil.onBtnClick(this.horn,this.onPlaySound.bind(this));
    }

    onZoomChange(){

    }

    onPlaySound(){
        let wordSoundUrl = "/sounds/glossary/words/uk/" + this._detailData.word + ".wav";
        RemoteSoundMgr.playSound(NetConfig.assertUrl + wordSoundUrl);
    }

    public updateWordData(data: WordsDetailData): void {
        this._detailData = data;
        this.wordLabel.string = data.phonic;
        this.symbolLabel.string = TextConfig.US + data.symbolus + "";
        this.cnLabel.string = data.cn;
        let wordImgUrl: string = NetConfig.assertUrl + "/imgs/words/" + data.word + ".jpg";
        ImgUtil.loadRemoteImage(wordImgUrl, this.wordImg, 416, 246);
        this.wordDetailView.init(data.word, this._detailData);
    }
}

