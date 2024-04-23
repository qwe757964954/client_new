import { _decorator, Button, Component, instantiate, Label, Node, Prefab, Sprite } from 'cc';
import CCUtil from '../../../util/CCUtil';
import { EventType } from '../../../config/EventType';
import EventManager from '../../../util/EventManager';
import { ViewsManager } from '../../../manager/ViewsManager';
import { PrefabType } from '../../../config/PrefabType';
import { BaseRemindView } from '../../common/BaseRemindView';
import { PopView } from '../../common/PopView';
import { DataMgr } from '../../../manager/DataMgr';
import ServiceManager from '../../../net/ServiceManager';
import { WordSplitItem } from './items/WordSplitItem';
import AudioUtl from '../../../util/AudioUtl';
const { ccclass, property } = _decorator;

/**学习模式页面 何存发 2024年4月15日15:38:41 */
@ccclass('StudyModeView')
export class StudyModeView extends Component {


    @property({ type: Button, tooltip: "关闭按钮" })
    public btn_close: Button = null;
    @property({ type: Node, tooltip: "收藏按钮" })
    public btn_collect: Node = null;
    @property({ type: Node, tooltip: "更多按钮" })
    public btn_more: Node = null;
    @property({ type: Prefab, tooltip: "单词拆分item" })
    public wordSplitItem: Prefab = null;
    @property(Label)
    wordLabel: Label = null;
    @property(Label)
    symbolLabel: Label = null;
    @property(Label)
    cnLabel: Label = null;
    @property(Node)
    splitNode: Node = null;

    private _spilitData: any = null;
    private _wordsData: any = null;
    private _wordIndex: number = 0; //当前单词序号
    private _splits: any[] = null; //当前单词拆分数据
    private _spliteItems: Node[] = []; //当前单词拆分节点
    //事件
    private _getWordsEveId: string;
    start() {

    }
    onLoad(): void {
        this.initEvent();
        this.initData();
    }

    async initData() {
        this._spilitData = await DataMgr.instance.getWordSplitConfig();
        ServiceManager.i.studyService.getWordGameWords(1, 1, 1, 0);
        this.initUI();

    }
    private initUI(): void {

    }
    onWordGameWords(data: any) {
        console.log('wordsData', data);
        if (data.Code != 200) {
            ViewsManager.showTip('获取单词失败');
            return;
        }
        this._wordsData = data.Data;
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

    showCurrentWord() {
        let wordData = this._wordsData[this._wordIndex];
        console.log('word', wordData);
        let word = wordData.word;
        this.wordLabel.string = word;
        this.symbolLabel.string = wordData.Symbol;
        this.cnLabel.string = wordData.Cn;

        let phonics = "";
        let splitData = this._spilitData[word];
        if (splitData && word.indexOf(" ") == -1) {
            phonics = splitData.replace(/ /g, "·");
        } else {
            phonics = word;
        }
        this.initSplitNode();
    }

    initSplitNode() {
        let splits = this._splits[this._wordIndex];
        console.log('splits', splits);
        if (splits.length == 0) {
            splits = [this._wordsData[this._wordIndex].word];
        }
        for (let i = 0; i < splits.length; i++) {
            let item = instantiate(this.wordSplitItem);
            item.getComponent(WordSplitItem).init(splits[i]);
            item.parent = this.splitNode;
            CCUtil.onTouch(item, this.onSplitItemClick.bind(this, item), this);
            this._spliteItems.push(item);
        }
    }

    onSplitItemClick(item: Node) {
        console.log('item', item);
        let splitWord = item.getComponent(WordSplitItem).word;
        let url = "https://www.chuangciyingyu.com/assets/sounds/splitwords/" + this._wordsData[this._wordIndex].word + "/" + splitWord;
        if (this._splits[this._wordIndex].length == 0) {
            url = "https://www.chuangciyingyu.com/assets/sounds/glossary/words/en/" + this._wordsData[this._wordIndex].word;
        }
        AudioUtl.playEffect(url + ".wav");
        // SoundUtil.playSound(url + ".wav");
    }

    private initEvent(): void {
        CCUtil.onTouch(this.btn_close.node, this.closeView, this);
        this._getWordsEveId = EventManager.on(EventType.WordGame_Words, this.onWordGameWords.bind(this));
    }
    private removeEvent(): void {
        console.log('移除事件', this.btn_close);
        CCUtil.offTouch(this.btn_close.node, this.closeView, this);
        EventManager.off(EventType.WordGame_Words, this._getWordsEveId);
        for (let i = 0; i < this._spliteItems.length; i++) {
            CCUtil.offTouch(this._spliteItems[i], this.onSplitItemClick.bind(this, this._spliteItems[i]), this);
        }

    }
    private closeView() {
        ViewsManager.instance.showView(PrefabType.BaseRemindView, (node: Node) => {
            node.getComponent(BaseRemindView).init("确定退出学习吗?", () => {
                ViewsManager.instance.closeView(PrefabType.StudyModeView);
            }, () => {
                ViewsManager.instance.closeView(PrefabType.BaseRemindView);
            });
        });
        // ViewsManager.instance.showView(PrefabType.BaseRemindView, (node: Node) => {
        //     node.getComponent(BaseRemindView).init('确定退出学习吗?', () => {
        //     })
        // });
    }
    onDestroy(): void {
        this.removeEvent();
    }

    update(deltaTime: number) {

    }
    /**是否收藏 */
    private setCollect(isCollect: boolean) {
        this.btn_collect.getComponent(Sprite).grayscale = !isCollect
    }


}

