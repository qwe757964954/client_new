import { _decorator, instantiate, Label, Node, NodePool, Prefab, Sprite, tween, UIOpacity, UITransform, Vec3 } from 'cc';
import { NetConfig } from '../../../config/NetConfig';
import { PrefabType } from '../../../config/PrefabType';
import { DataMgr } from '../../../manager/DataMgr';
import RemoteImageManager from '../../../manager/RemoteImageManager';
import { RemoteSoundMgr } from '../../../manager/RemoteSoundManager';
import { ViewsManager } from '../../../manager/ViewsManager';
import { GameMode } from '../../../models/AdventureModel';
import { UnitWordModel } from '../../../models/TextbookModel';
import CCUtil from '../../../util/CCUtil';
import { WordDetailView } from '../../common/WordDetailView';
import { TransitionView } from '../common/TransitionView';
import { BaseModeView } from './BaseModeView';
import { WordSplitItem } from './items/WordSplitItem';
import { WordMeaningView } from './WordMeaningView';
const { ccclass, property } = _decorator;

/**学习模式页面 何存发 2024年4月15日15:38:41 */
@ccclass('StudyModeView')
export class StudyModeView extends BaseModeView {

    @property({ type: Node, tooltip: "更多按钮" })
    public btn_more: Node = null;
    @property({ type: Prefab, tooltip: "单词拆分item" })
    public wordSplitItem: Prefab = null;
    @property({ type: Label, tooltip: "单词Label" })
    wordLabel: Label = null;
    @property({ type: Label, tooltip: "音标Label" })
    symbolLabel: Label = null;
    @property({ type: Label, tooltip: "中文Label" })
    cnLabel: Label = null;
    @property({ type: Node, tooltip: "拆分节点容器" })
    splitNode: Node = null;
    @property({ type: Node, tooltip: "完整单词节点" })
    wholeWordNode: Node = null;
    @property({ type: Label, tooltip: "完整单词Label" })
    wholeWordLabel: Label = null;
    @property({ type: Sprite, tooltip: "单词图片" })
    wordImg: Sprite = null;
    @property({ type: Node, tooltip: "单词详情面板" })
    wordDetailNode: Node = null;
    @property({ type: Node, tooltip: "隐藏详情面板按钮" })
    btn_hideDetail: Node = null;

    protected _spilitData: any = null;
    protected _wordsData: UnitWordModel[] = null;
    protected _wordIndex: number = 0; //当前单词序号
    protected _splits: any[] = null; //当前单词拆分数据
    protected _spliteItems: Node[] = []; //当前单词拆分节点
    protected _detailData: any = null; //当前单词详情数据
    protected _levelData: any = null; //当前关卡配置
    //事件
    protected _getWordsEveId: string;

    protected _isSplitPlaying: boolean = false; //正在播放拆分音频
    protected _currentSplitIdx: number = 0; //当前播放拆分音频的索引
    protected _isCombine: boolean = false; //是否已经合并单词
    protected _monster: Node = null; //主怪动画节点

    protected _nodePool: NodePool = new NodePool("wordSplitItem");
    onLoad(): void {
        this.initEvent();
        this.gameMode = GameMode.Study;
    }

    async initData(wordsdata: UnitWordModel[], levelData: any) {
        wordsdata = this.updateTextbookWords(wordsdata, levelData);
        this._spilitData = await DataMgr.instance.getWordSplitConfig();
        this.initWords(wordsdata);
        this.initMonster(); //初始化怪物
    }

    //获取关卡单词回包
    initWords(data: UnitWordModel[]) {
        console.log('initWords', data);
        this._wordsData = data;
        let splits = [];
        for (let i = 0; i < this._wordsData.length; i++) {
            let word = this._wordsData[i].word;
            let splitData = this._spilitData[word];
            if (splitData) {
                splits.push(splitData.split(" "));
            } else {
                if (word.indexOf(" ") != -1) {
                    let word_sp = word.split(" ");
                    splits.push(word_sp);
                } else {
                    splits.push([]);
                }
            }
        }
        this._splits = splits;
        this.showCurrentWord();
    }

    //显示当前单词
    showCurrentWord() {
        super.updateConstTime();
        this._isCombine = false;
        let wordData = this._wordsData[this._wordIndex];
        console.log('word', wordData);
        let word = wordData.word;
        this.wordLabel.string = this.wholeWordLabel.string = word;
        this.symbolLabel.string = wordData.symbol;
        this.cnLabel.string = wordData.cn;
        this.splitNode.active = true;
        this.wholeWordNode.active = false;

        let imgUrl = NetConfig.assertUrl + "/imgs/words/" + word + ".jpg";
        RemoteImageManager.i.loadImage(imgUrl, this.wordImg);

        let phonics = "";
        let splitData = this._spilitData[word];
        if (splitData && word.indexOf(" ") == -1) {
            phonics = splitData.replace(/ /g, "·");
        } else {
            phonics = word;
        }
        this.initSplitNode();
        this.initWordDetail(word);
        this.playWordSound();
    }

    //初始化拆分节点
    initSplitNode() {
        this.clearSplitItems();
        this._currentSplitIdx = 0;
        let splits = this._splits[this._wordIndex];
        console.log('splits', splits);
        if (splits.length == 0) {
            splits = [this._wordsData[this._wordIndex].word];
        }
        for (let i = 0; i < splits.length; i++) {
            let item = this.getSplitItem();
            // item.parent = this.splitNode;
            item.getComponent(WordSplitItem).init(splits[i]);
            this.splitNode.addChild(item);
            CCUtil.onTouch(item, this.onSplitItemClick.bind(this, item, i), this);
            this._spliteItems.push(item);
        }
    }

    getSplitItem() {
        let item = this._nodePool.get();
        if (!item) {
            item = instantiate(this.wordSplitItem);
        }
        return item;
    }

    clearSplitItems() {
        for (let i = 0; i < this._spliteItems.length; i++) {
            this._spliteItems[i].parent = null;
            this._nodePool.put(this._spliteItems[i]);
        }
        this._spliteItems = [];
    }

    playWordSound() {
        let word = this._wordsData[this._wordIndex].word;
        let wordSoundUrl = "";
        if (this._spilitData[word] || this._spilitData[word] === "") { //配置中有
            let dirWord = word;
            wordSoundUrl = "/sounds/splitwords/" + dirWord + "/" + word + ".wav";
        } else {
            wordSoundUrl = "/sounds/glossary/words/en/" + word + ".wav";
        }

        return RemoteSoundMgr.playSound(NetConfig.assertUrl + wordSoundUrl);
    }

    //拆分部分点击
    onSplitItemClick(item: Node, idx: number) {
        if (this._isSplitPlaying) return;
        if (idx != this._currentSplitIdx) return;
        this._isSplitPlaying = true;
        console.log('item', item);
        let wordSplitItem = item.getComponent(WordSplitItem);
        let splitWord = wordSplitItem.word;
        wordSplitItem.select();
        let url = NetConfig.assertUrl + "/sounds/splitwords/" + this._wordsData[this._wordIndex].word + "/" + splitWord;
        if (this._splits[this._wordIndex].length == 0) {
            url = NetConfig.assertUrl + "/sounds/glossary/words/en/" + this._wordsData[this._wordIndex].word;
        }
        RemoteSoundMgr.playSound(url + ".wav").then(() => {
            this._isSplitPlaying = false;
            this._currentSplitIdx++;
            if (this._currentSplitIdx == this._splits[this._wordIndex].length) {
                this.combineWord();
            }
        });
    }
    //拆分点击结束合并单词
    combineWord() {
        this._isCombine = true;
        let targetX: number;
        let total = this._spliteItems.length;
        let halfIdx = (total % 2 == 0) ? (Math.ceil(total / 2) - 0.5) : ((total + 1) / 2 - 1);
        for (let i = 0; i < this._spliteItems.length; i++) {
            if (total % 2 != 0 && i == halfIdx) continue;
            let oldPos = this._spliteItems[i].position;
            targetX = i < halfIdx ? (oldPos.x + 35 * (halfIdx - i)) : (oldPos.x - 35 * (i - halfIdx));
            let pos = new Vec3(targetX, oldPos.y, 0);
            tween(this._spliteItems[i]).to(0.2, { position: pos }).start();
        }
        this.wholeWordNode.active = true;
        this.wholeWordNode.getComponent(UIOpacity).opacity = 0;
        this.scheduleOnce(() => {
            this.wholeWordNode.getComponent(UIOpacity).opacity = 255;
            let labelWidth = this.wholeWordLabel.getComponent(UITransform).contentSize.width;
            this.wholeWordNode.getComponent(UITransform).width = labelWidth + 100;
            this.splitNode.active = false;
            this.playWordSound().then(() => {
                this._wordIndex++;
                this._rightNum++;
                this.attackMonster().then(() => {
                    if (this._wordIndex == this._wordsData.length) {
                        this.monsterEscape();
                    } else {
                        this.showCurrentWord();
                    }
                });
            });
        }, 0.2);
        let word = this._wordsData[this._wordIndex].word
        this.onGameSubmit(word, true);
    }

    protected modeOver(): void {
        console.log('学习完成,跳转词意模式');
        ViewsManager.instance.showView(PrefabType.TransitionView, (node: Node) => {
            let wordData = JSON.parse(JSON.stringify(this._wordsData));
            let levelData = JSON.parse(JSON.stringify(this._levelData));
            node.getComponent(TransitionView).setTransitionCallback(() => {
                console.log("过渡界面回调_________________________");
                ViewsManager.instance.showView(PrefabType.WordMeaningView, (node: Node) => {
                    node.getComponent(WordMeaningView).initData(wordData, levelData);
                    ViewsManager.instance.closeView(PrefabType.StudyModeView);
                });
            });
        });
    }

    showWordDetail() {
        if (this._isCombine || this._isSplitPlaying) return;
        if (!this._detailData) {
            ViewsManager.showTip("未获取到单词详情数据");
            return;
        }
        let pos = this.mainNode.position;
        if (pos.y == -100) return;
        this.splitNode.active = false;
        this.wordDetailNode.active = true;
        this.btn_hideDetail.active = true;
        this.btn_more.active = false;

        this.wordDetailNode.getComponent(WordDetailView).init(this._wordsData[this._wordIndex].word, this._detailData);
        this.mainNode.setPosition(pos.x, -360, 0);
        tween(this.mainNode).to(0.2, { position: new Vec3(pos.x, -100, 0) }).start();
    }

    hideWordDetail() {
        this.splitNode.active = true;
        this.wordDetailNode.active = false;
        this.btn_hideDetail.active = false;
        this.btn_more.active = true;
        let pos = this.mainNode.position;
        tween(this.mainNode).to(0.2, { position: new Vec3(pos.x, -360, 0) }).start();
    }

    protected initEvent(): void {
        super.initEvent();
        CCUtil.onTouch(this.btn_more, this.showWordDetail, this);
        CCUtil.onTouch(this.btn_hideDetail, this.hideWordDetail, this);
    }
    protected removeEvent(): void {
        super.removeEvent();
        CCUtil.offTouch(this.btn_more, this.showWordDetail, this);
        CCUtil.offTouch(this.btn_hideDetail, this.hideWordDetail, this);
        for (let i = 0; i < this._spliteItems.length; i++) {
            CCUtil.offTouch(this._spliteItems[i], this.onSplitItemClick.bind(this, this._spliteItems[i], i), this);
        }

    }
    onDestroy(): void {
        super.onDestroy();
        this._nodePool.clear();
    }
}

