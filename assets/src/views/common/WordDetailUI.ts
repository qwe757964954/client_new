import { _decorator, Label, Node, Sprite, tween, UITransform, Vec3 } from 'cc';
import { TextConfig } from '../../config/TextConfig';
import { WordModel, WordSourceType } from '../../config/WordConfig';
import GlobalConfig from '../../GlobalConfig';
import { RemoteImgMgr } from '../../manager/RemoteImageManager';
import { RemoteSoundMgr } from '../../manager/RemoteSoundManager';
import { ViewsMgr } from '../../manager/ViewsManager';
import { WordsDetailData } from '../../models/AdventureModel';
import { s2cWordbookCorrectWord, s2cWordbookWordDetail } from '../../models/NetModel';
import { InterfacePath } from '../../net/InterfacePath';
import { ServiceMgr } from '../../net/ServiceManager';
import { BaseComponent } from '../../script/BaseComponent';
import CCUtil from '../../util/CCUtil';
import { TimerMgr } from '../../util/TimerMgr';
import { WordDetailView } from './WordDetailView';
const { ccclass, property } = _decorator;

@ccclass('WordDetailUI')
export class WordDetailUI extends BaseComponent {
    @property(Node)
    public pl: Node = null;
    @property(Node)
    public plFrame: Node = null;
    @property(WordDetailView)
    public wordDetailView: WordDetailView = null;
    @property(Label)
    public wordLabel: Label = null;
    @property(Label)
    public symbolLabel: Label = null;
    @property(Label)
    public cnLabel: Label = null;
    @property(Sprite)
    public wordImg: Sprite = null;
    @property(Node)
    public horn: Node = null;
    @property(Sprite)
    public star: Sprite = null;
    @property(Node)
    public btnZoom: Node = null;

    private _wordData: WordModel = null;
    private _timer: number = null;
    private _wordDetailData: s2cWordbookWordDetail = null;
    private _framePos: Vec3 = null;
    private _isCollect: number = 0;

    protected onDestroy(): void {
        this.clearEvent();
        this.clearTimer();
    }
    protected onLoad(): void {
        this.initEvent();
    }

    private initEvent() {
        CCUtil.onTouch(this.btnZoom, this.onBtnClose, this);
        CCUtil.onTouch(this.horn, this.onBtnHorn, this);
        CCUtil.onTouch(this.star, this.onBtnStar, this);
        this.addEvent(InterfacePath.c2sWordbookWordDetail, this.onRepWordDetail.bind(this));
        this.addEvent(InterfacePath.c2sWordbookCorrectWord, this.onRepCorrectWord.bind(this));
    }
    private clearTimer() {
        if (this._timer) {
            TimerMgr.stop(this._timer);
            this._timer = null;
        }
    }

    init(wordData: WordModel) {
        this._framePos = this.plFrame.position.clone();
        this.pl.active = false;

        this._wordData = wordData;
        ServiceMgr.wordbookSrv.reqWordDetail(this._wordData.w_id, this._wordData.source);
        this.clearTimer();
        this._timer = TimerMgr.once(() => {
            this.clearTimer();
            ViewsMgr.showTip(TextConfig.Net_Error);
            this.node.destroy();
        }, 3000);
    }

    private showUI() {
        let transform = this.plFrame.getComponent(UITransform);
        this.plFrame.position = new Vec3(0, -GlobalConfig.WIN_SIZE.height * 0.5 - transform.height * 0.5, 0);
        this.pl.active = true;
        tween(this.plFrame).to(0.2, { position: this._framePos })
            .call(() => {
                this.btnZoom.angle = 0;
            })
            .start();
        this.wordLabel.string = this._wordDetailData.word;
        this.symbolLabel.string = this._wordDetailData.symbolus;
        this.cnLabel.string = this._wordDetailData.cn;
        RemoteImgMgr.loadWordImg(this._wordDetailData.word, this.wordImg);
        this.star.grayscale = !this._isCollect;
        let detailData = new WordsDetailData();
        detailData.word = this._wordDetailData.word;
        detailData.sentence_list = this._wordDetailData.sentence_list as any;
        detailData.speech = this._wordDetailData.speech;
        detailData.similar_list = this._wordDetailData.similar_list;
        // detailData.ancillary = this._wordDetailData.ancillary as any;
        this.wordDetailView.init(this._wordDetailData.word, detailData);
    }

    private onBtnClose() {
        this.node.destroy();
    }
    private onBtnHorn() {
        RemoteSoundMgr.playWord(this._wordData.word);
    }
    private onBtnStar() {
        if (!this._wordDetailData) return;
        let w_id = WordSourceType.total == this._wordData.source ? this._wordData.word : this._wordData.w_id;
        this._isCollect = 1 - this._isCollect;
        ServiceMgr.wordbookSrv.reqCollectWord(w_id, this._isCollect, this._wordData.source);
        this.star.grayscale = !this._isCollect;
    }

    private isSelfWord(source: number, w_id: string) {
        if (source != this._wordData.source) return false;
        if (WordSourceType.total == source && w_id != this._wordData.word) return false;
        if (w_id != this._wordData.w_id) return false;
        return true;
    }

    private onRepWordDetail(data: s2cWordbookWordDetail) {
        if (200 != data.code) {
            ViewsMgr.showAlert(data.msg);
            this.node.destroy();
            return;
        }
        if (!this.isSelfWord(data.source_type, data.w_id)) {
            return;
        }
        this.clearTimer();
        this._wordDetailData = data;
        this._isCollect = data.is_collect;
        this.showUI();
    }

    private onRepCorrectWord(data: s2cWordbookCorrectWord) {
        if (200 != data.code) {
            ViewsMgr.showAlert(data.msg);
            return;
        }
        if (!this.isSelfWord(data.source_type, data.w_id)) {
            return;
        }
        this._isCollect = data.action;
        this.star.grayscale = !this._isCollect;
    }
}


