import { _decorator, Label, Node, Sprite } from 'cc';
import { EventType } from '../../config/EventType';
import { NetConfig } from '../../config/NetConfig';
import { TextConfig } from '../../config/TextConfig';
import { RemoteSoundMgr } from '../../manager/RemoteSoundManager';
import { WordsDetailData } from '../../models/AdventureModel';
import { InterfacePath } from '../../net/InterfacePath';
import { ServiceMgr } from '../../net/ServiceManager';
import { BaseView } from '../../script/BaseView';
import CCUtil from '../../util/CCUtil';
import { EventMgr } from '../../util/EventManager';
import ImgUtil from '../../util/ImgUtil';
import { WordDetailView } from '../common/WordDetailView';
import { SearchWordItem } from './MyWordInfo';

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
    public btnZoom: Node = null;

    @property(Node)
    public horn: Node = null;

    @property(Node)
    public star: Node = null;

    private _detailData: WordsDetailData = null;

    protected initEvent(): void {
        CCUtil.onBtnClick(this.btnZoom, this.onZoomChange.bind(this));
        CCUtil.onBtnClick(this.horn, this.onPlaySound.bind(this));
        CCUtil.onBtnClick(this.star, this.onCollectStart.bind(this));
    }

    private onZoomChange(): void {
        // Implement zoom change logic here
    }

    private onCollectStart(): void {
        const searchData: SearchWordItem = {
            ...this._detailData,
            is_collect: this._detailData.collect_flag
        };
        EventMgr.dispatch(EventType.Search_Collect_Work, searchData);
        let status = searchData.is_collect ? 0:1;
        ServiceMgr.studyService.totalCollectWord(searchData.word,status);
    }

    protected onInitModuleEvent(): void {
        this.addModelListeners([
            [InterfacePath.Total_Collect_Word, this.onTotalCollectWord.bind(this)]
        ]);
    }

    private async onTotalCollectWord(data: any): Promise<void> {
        this._detailData.collect_flag = this._detailData.collect_flag ? 0 : 1;
        this.updateStarIcon(this._detailData.collect_flag === 1);
    }

    private updateStarIcon(isCollected: boolean): void {
        const sprite = this.star.getComponent(Sprite);
        if (sprite) {
            sprite.grayscale = !isCollected;
        }
    }

    private onPlaySound(): void {
        const wordSoundUrl = `${NetConfig.assertUrl}/sounds/glossary/words/uk/${this._detailData.word}.wav`;
        RemoteSoundMgr.playSound(wordSoundUrl);
    }

    public updateWordData(data: WordsDetailData): void {
        this._detailData = data;
        this.updateWordLabels(data);
        this.loadWordImage(data.word);
        this.wordDetailView.init(data.word, this._detailData);
        this.updateStarIcon(data.collect_flag === 1);
    }

    private updateWordLabels(data: WordsDetailData): void {
        this.wordLabel.string = data.phonic;
        this.symbolLabel.string = `${TextConfig.US}${data.symbolus}`;
        this.cnLabel.string = data.cn;
    }

    private loadWordImage(word: string): void {
        const wordImgUrl = `${NetConfig.assertUrl}/imgs/words/${word}.jpg`;
        ImgUtil.loadRemoteImage(wordImgUrl, this.wordImg, 416, 246);
    }
}
