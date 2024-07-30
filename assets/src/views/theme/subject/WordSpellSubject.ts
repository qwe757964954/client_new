import { _decorator, instantiate, Label, Node, Prefab, Sprite, SpriteFrame } from 'cc';
import { BaseView } from '../../../script/BaseView';
import { SentenceData, UnitWord, WordGroupData, WordGroupModel, WordsDetailData } from '../../../models/AdventureModel';
import { InterfacePath } from '../../../net/InterfacePath';
import CCUtil from '../../../util/CCUtil';
import { SpellWordItem } from '../../adventure/sixModes/items/SpellWordItem';
import { EventMgr } from '../../../util/EventManager';
import { EventType } from '../../../config/EventType';
import { ServiceMgr } from '../../../net/ServiceManager';
import { ToolUtil } from '../../../util/ToolUtil';
import GlobalConfig from '../../../GlobalConfig';
import { NetConfig } from '../../../config/NetConfig';
import { RemoteSoundMgr } from '../../../manager/RemoteSoundManager';
import { WordBaseData } from '../../../models/SubjectModel';
const { ccclass, property } = _decorator;

@ccclass('WordSpellSubject')
export class WordSpellSubject extends BaseView {
    @property({ type: Prefab, tooltip: "选项item" })
    wordItem: Prefab = null;
    @property({ type: Node, tooltip: "选项节点" })
    itemNode: Node = null;
    @property({ type: Label, tooltip: "句子Label" })
    sentenceLabel: Label = null;
    @property({ type: Label, tooltip: "中文Label" })
    cnLabel: Label = null;
    @property({ type: Node, tooltip: "结果图片" })
    resultSprite: Node = null;
    @property({ type: SpriteFrame, tooltip: "正确图片" })
    rightSprite: SpriteFrame = null;
    @property({ type: SpriteFrame, tooltip: "错误图片" })
    wrongSprite: SpriteFrame = null;
    @property({ type: Node, tooltip: "播放例句按钮" })
    playSentenceBtn: Node = null;

    private _word: WordBaseData;
    private _wordGroup: WordGroupModel;
    private _detailData: WordsDetailData;
    private _sentenceData: SentenceData;
    private _items: Node[] = [];
    protected _selectIdxs: number[] = []; //当前选中的索引
    protected _selectItems: Node[] = []; //选中item

    private _selectLock: boolean = false;

    setData(word: WordBaseData, wordGroup: WordGroupModel) {
        this._word = word;
        this._wordGroup = wordGroup;
        ServiceMgr.studyService.getAdventureWord(word.w_id);
        this.initItemNode();
    }

    onInitModuleEvent() {
        this.addModelListener(InterfacePath.Adventure_Word, this.onWordDetail);
    }

    playSentence() {
        if (!this._sentenceData) return;
        let soundName = ToolUtil.md5(this._sentenceData.sentence);
        let type = GlobalConfig.USE_US ? "us" : "en";
        let url = NetConfig.assertUrl + "/sounds/sentence/" + type + "/" + soundName + ".wav"
        RemoteSoundMgr.playSound(url);
    }

    protected initEvent(): void {
        CCUtil.onTouch(this.playSentenceBtn, this.playSentence, this);
    }
    protected removeEvent(): void {
        CCUtil.offTouch(this.playSentenceBtn, this.playSentence, this);
        for (let i = 0; i < this._items.length; i++) {
            CCUtil.offTouch(this._items[i], this.onItemClick, this);
        }
    }

    onWordDetail(data: WordsDetailData) {
        if (data.code != 200) {
            console.error("获取单词详情失败", data.msg);
            return;
        }
        this._detailData = data;
        let sentences = this._detailData.sentence_list;
        if (sentences && sentences.length > 0) {
            this._sentenceData = sentences[0];
        }
        if (this._sentenceData) {
            let word = this._word.word;
            let sentence = this._sentenceData.sentence;
            let lowerSent = sentence.toLowerCase();
            let lowerWord = word.toLowerCase();
            let startIndex = lowerSent.indexOf(lowerWord);
            let endIndex = startIndex + word.length;

            while (endIndex <= sentence.length - 1 && sentence[endIndex] != " " && sentence[endIndex] != "," && sentence[endIndex] != "." && sentence[endIndex] != "!" && sentence[endIndex] != "?") {
                endIndex++;
            }
            let str = "";
            if (startIndex == 0) {
                str = "_____" + sentence.substring(endIndex);
            } else {
                str = sentence.substring(0, startIndex) + "_____" + sentence.substring(endIndex);
            }
            this.sentenceLabel.string = str;
            this.cnLabel.string = this._sentenceData.cn;
        }
    }


    //初始化拆分节点
    initItemNode() {
        this.clearSplitItems();
        let groupData = this._wordGroup;
        let splits = [];
        console.log('groupData', groupData);
        if (!groupData) {
            splits = [this._word.word];
        } else {
            splits = [groupData.opt1, groupData.opt2, groupData.opt3, groupData.opt4];
        }
        splits.sort((a, b) => {
            return Math.random() > 0.5 ? 1 : -1;
        }); //乱序

        for (let i = 0; i < splits.length; i++) {
            let item = instantiate(this.wordItem);
            item.getComponent(SpellWordItem).init(splits[i]);
            item.parent = this.itemNode;
            CCUtil.onTouch(item, this.onItemClick, this);
            this._items.push(item);
        }
    }

    onItemClick(e: any) {
        if (this._selectLock) return;
        let item = e.target;
        let wordItem = item.getComponent(SpellWordItem);
        let minIdx = this.getMinIdx(this._selectIdxs);
        let selectIdx = wordItem.selectIdx;
        wordItem.select(minIdx);
        if (wordItem.isSelect) {
            this._selectIdxs.push(minIdx);
            this._selectItems.push(item);
        } else {
            this._selectIdxs.splice(this._selectIdxs.indexOf(selectIdx), 1);
            this._selectItems.splice(this._selectItems.indexOf(item), 1);
        }
        let groupData = this._wordGroup;
        if (groupData.opt_num == this._selectIdxs.length) { //选择完毕
            this._selectLock = true;
            let isRight = true;
            for (let i = 0; i < this._selectIdxs.length; i++) {
                let idx = i + 1;
                let item = this.getItemBySelectIdx(idx);
                if (item.getComponent(SpellWordItem).word != groupData["opt" + idx]) {
                    isRight = false;
                }
            }
            this.resultSprite.active = true;
            if (isRight) { //回答正确
                this.resultSprite.getComponent(Sprite).spriteFrame = this.rightSprite;
                if (this._sentenceData) {
                    this.sentenceLabel.string = this._sentenceData.sentence;
                }
            } else { //回答错误
                this.resultSprite.getComponent(Sprite).spriteFrame = this.wrongSprite;
                wordItem.selectWrong();
            }
            EventMgr.dispatch(EventType.GradeSkip_Subject_Result, isRight);
        }
    }

    //获取不存在于数组中最小的值
    getMinIdx(arr: number[]) {
        let min = 1;
        while (arr.indexOf(min) != -1) {
            min++;
        }
        return min;
    }
    getItemBySelectIdx(idx: number) {
        for (let i = 0; i < this._selectItems.length; i++) {
            if (this._selectItems[i].getComponent(SpellWordItem).selectIdx == idx) {
                return this._selectItems[i];
            }
        }
        return null;
    }

    clearSplitItems() {
        for (let i = 0; i < this._items.length; i++) {
            this._items[i].getComponent(SpellWordItem).dispose();
            CCUtil.offTouch(this._items[i], this.onItemClick, this);
            this._items[i].destroy();
        }

        this._items = [];
        this._selectIdxs = [];
        this._selectItems = [];
    }
}


