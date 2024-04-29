import { _decorator, Button, Component, instantiate, Label, Layout, Node, NodePool, Prefab, Sprite, tween, UITransform, Vec3 } from 'cc';
import CCUtil from '../../../util/CCUtil';
import { EventType } from '../../../config/EventType';
import { PrefabType } from '../../../config/PrefabType';
import { RemoteSoundMgr } from '../../../manager/RemoteSoundManager';
import { ViewsManager } from '../../../manager/ViewsManager';
import { ServiceMgr } from '../../../net/ServiceManager';
import EventManager from '../../../util/EventManager';
import { BaseRemindView } from '../../common/BaseRemindView';
import { WordDetailView } from '../../common/WordDetailView';
import { NetConfig } from '../../../config/NetConfig';
import { BaseModeView } from './BaseModeView';
const { ccclass, property } = _decorator;

/**词意模式页面*/
@ccclass('WordMeaningView')
export class WordMeaningView extends BaseModeView {

    @property({ type: Label, tooltip: "单词Label" })
    wordLabel: Label = null;
    @property({ type: Label, tooltip: "音标Label" })
    symbolLabel: Label = null;
    @property({ type: Node, tooltip: "更多按钮" })
    public btn_more: Node = null;
    @property({ type: Node, tooltip: "单词详情面板" })
    wordDetailNode: Node = null;
    @property({ type: Node, tooltip: "隐藏详情面板按钮" })
    btn_hideDetail: Node = null;

    private _wordDetailEveId: string;

    async initData(wordsdata: any, levelData: any) {
        this.initWords(wordsdata);
        this._levelData = levelData;
        this.initMonster(); //初始化怪物
    }

    //获取关卡单词回包
    initWords(data: any) {
        console.log('initWords', data);
        this._wordsData = data;
        this.showCurrentWord();
    }

    //显示当前单词
    showCurrentWord() {
        let wordData = this._wordsData[this._wordIndex];
        console.log('word', wordData);
        let word = wordData.word;
        this.wordLabel.string = word;
        this.symbolLabel.string = wordData.Symbol;
        this.initWordDetail(word);
        this.playWordSound();
    }

    //初始化单词详情
    initWordDetail(word: string) {
        ServiceMgr.studyService.getClassificationWord(word);
    }

    playWordSound() {
        let word = this._wordsData[this._wordIndex].word;
        let wordSoundUrl = "";
        wordSoundUrl = "/sounds/glossary/words/en/" + word + ".wav";
        return RemoteSoundMgr.playSound(NetConfig.assertUrl + wordSoundUrl);
    }

    showWordDetail() {
        if (!this._detailData) {
            ViewsManager.showTip("未获取到单词详情数据");
            return;
        }
        let pos = this.mainNode.position;
        if (pos.y == -100) return;
        this.wordDetailNode.active = true;
        this.btn_hideDetail.active = true;
        this.btn_more.active = false;

        this.wordDetailNode.getComponent(WordDetailView).init(this._wordsData[this._wordIndex].word, this._detailData);
        this.mainNode.setPosition(pos.x, -360, 0);
        tween(this.mainNode).to(0.2, { position: new Vec3(pos.x, -100, 0) }).start();
    }

    hideWordDetail() {
        this.wordDetailNode.active = false;
        this.btn_hideDetail.active = false;
        this.btn_more.active = true;
        let pos = this.mainNode.position;
        tween(this.mainNode).to(0.2, { position: new Vec3(pos.x, -360, 0) }).start();
    }

    onClassificationWord(data: any) {
        if (data.Code != 200) {
            console.error("获取单词详情失败", data);
            return;
        }
        this._detailData = data.Data;
        console.log("获取单词详情", data);
    }

    protected initEvent(): void {
        super.initEvent();
        CCUtil.onTouch(this.btn_more, this.showWordDetail, this);
        CCUtil.onTouch(this.btn_hideDetail, this.hideWordDetail, this);
        this._wordDetailEveId = EventManager.on(EventType.Classification_Word, this.onClassificationWord.bind(this));
    }
    protected removeEvent(): void {
        super.removeEvent();
        CCUtil.offTouch(this.btn_more, this.showWordDetail, this);
        CCUtil.offTouch(this.btn_hideDetail, this.hideWordDetail, this);
        EventManager.off(EventType.Classification_Word, this._wordDetailEveId);

    }
    protected closeView() {
        ViewsManager.instance.showView(PrefabType.BaseRemindView, (node: Node) => {
            node.getComponent(BaseRemindView).init("确定退出学习吗?", () => {
                ViewsManager.instance.closeView(PrefabType.WordMeaningView);
            }, () => {
                ViewsManager.instance.closeView(PrefabType.BaseRemindView);
            });
        });
    }
    onDestroy(): void {
        this.removeEvent();
        RemoteSoundMgr.clearAudio();
    }

    update(deltaTime: number) {

    }
    /**是否收藏 */
    protected setCollect(isCollect: boolean) {
        this.btn_collect.getComponent(Sprite).grayscale = !isCollect
    }


}

