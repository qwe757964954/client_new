import { _decorator, Button, Component, instantiate, Label, Layout, Node, NodePool, Prefab, Sprite, tween, UITransform, Vec3 } from 'cc';
import CCUtil from '../../../util/CCUtil';
import { EventType } from '../../../config/EventType';
import { PrefabType } from '../../../config/PrefabType';
import { DataMgr } from '../../../manager/DataMgr';
import { RemoteSoundMgr } from '../../../manager/RemoteSoundManager';
import { ViewsManager } from '../../../manager/ViewsManager';
import { ServiceMgr } from '../../../net/ServiceManager';
import EventManager from '../../../util/EventManager';
import { BaseRemindView } from '../../common/BaseRemindView';
import { WordSplitItem } from './items/WordSplitItem';
import RemoteImageManager from '../../../manager/RemoteImageManager';
import { WordDetailView } from '../../common/WordDetailView';
import { NetConfig } from '../../../config/NetConfig';
import { RoleBaseModel } from '../../../models/RoleBaseModel';
import { SmallMonsterModel } from '../../common/SmallMonsterModel';
import { LoadManager } from '../../../manager/LoadManager';
import { PetModel } from '../../../models/PetModel';
import { MonsterModel } from '../common/MonsterModel';
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
    @property({ type: Node, tooltip: "主面板" })
    mainNode: Node = null;
    @property(Prefab)
    public roleModel: Prefab = null;//角色动画
    @property({ type: Node, tooltip: "角色容器" })
    public roleContainer: Node = null;
    @property({ type: Node, tooltip: "精灵容器" })
    public petContainer: Node = null;
    @property({ type: Prefab, tooltip: "精灵预制体" })
    public petModel: Prefab = null;
    @property({ type: Node, tooltip: "所有怪物容器" })
    public monsterContainer: Node = null;
    @property({ type: Prefab, tooltip: "小怪物预制体" })
    public smallMonsterModel: Prefab = null;
    @property({ type: Node, tooltip: "主怪物容器" })
    public monster: Node = null;
    @property(Prefab)
    public monsterModel: Prefab = null;//怪物动画

    private _pet: Node = null; //精灵
    private _role: Node = null; //人物
    private _smallMonsters: Node[] = []; //小怪物

    private _spilitData: any = null;
    private _wordsData: any = null;
    private _wordIndex: number = 0; //当前单词序号
    private _splits: any[] = null; //当前单词拆分数据
    private _spliteItems: Node[] = []; //当前单词拆分节点
    private _detailData: any = null; //当前单词详情数据
    private _levelData: any = null; //当前关卡配置
    //事件
    private _getWordsEveId: string;
    private _wordDetailEveId: string;

    private _isSplitPlaying: boolean = false; //正在播放拆分音频
    private _currentSplitIdx: number = 0; //当前播放拆分音频的索引
    private _isCombine: boolean = false; //是否已经合并单词
    private _monster: Node = null; //主怪动画节点

    private _nodePool: NodePool = new NodePool("wordSplitItem");
    start() {
        this.initRole(); //初始化角色
        this.initPet(); //初始化精灵
    }
    onLoad(): void {
        this.initEvent();
    }

    async initData(wordsdata: any, levelData: any) {
        this._spilitData = await DataMgr.instance.getWordSplitConfig();
        this.initWords(wordsdata);
        this._levelData = levelData;
        this.initMonster(); //初始化怪物
    }

    async initRole() {
        this._role = instantiate(this.roleModel);
        this.roleContainer.addChild(this._role);
        let roleModel = this._role.getComponent(RoleBaseModel);
        await roleModel.init(101, 1, [9500, 9700, 9701, 9702, 9703]);
    }
    async initPet() {
        this._pet = instantiate(this.petModel);
        this.petContainer.addChild(this._pet);
        let roleModel = this._pet.getComponent(RoleBaseModel);
        await roleModel.init(101, 1);
    }
    async initMonster() {
        // let monsterId = this._monsterData.monsterId;
        // LoadManager.loadSprite("adventure/monster/" + monsterId + "/spriteFrame", this.monster.getComponent(Sprite));
        this._monster = instantiate(this.monsterModel);
        this.monster.addChild(this._monster);
        let monsterModel = this._monster.getComponent(MonsterModel);
        monsterModel.init("spine/monster/adventure/" + this._levelData.monsterAni);
        let len = this._wordsData.length - 1;
        if (len > 4) {
            len = 4;
        }
        for (let i = 0; i < len; i++) {
            let sPoint = this.monsterContainer.getChildByName("spoint" + (i + 1));
            let monster = instantiate(this.smallMonsterModel);
            sPoint.addChild(monster);
            let monsterModel = monster.getComponent(SmallMonsterModel);
            monsterModel.init("spine/monster/adventure/" + this._levelData.miniMonsterAni);
            this._smallMonsters.push(monster);
        }
    }
    //获取关卡单词回包
    initWords(data: any) {
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
        this._isCombine = false;
        let wordData = this._wordsData[this._wordIndex];
        console.log('word', wordData);
        let word = wordData.word;
        this.wordLabel.string = this.wholeWordLabel.string = word;
        this.symbolLabel.string = wordData.Symbol;
        this.cnLabel.string = wordData.Cn;
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

    //初始化单词详情
    initWordDetail(word: string) {
        ServiceMgr.studyService.getClassificationWord(word);
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
            item.getComponent(WordSplitItem).init(splits[i]);
            item.parent = this.splitNode;
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
            tween(this._spliteItems[i]).to(0.3, { position: pos }).start();
        }
        this.scheduleOnce(() => {
            this.wholeWordNode.active = true;
            let labelWidth = this.wholeWordLabel.getComponent(UITransform).contentSize.width;
            this.wholeWordNode.getComponent(UITransform).width = labelWidth + 150;
            this.splitNode.active = false;
            this.playWordSound().then(() => {
                this._wordIndex++;
                this.attackMonster().then(() => {
                    if (this._wordIndex == this._wordsData.length) {
                        console.log('学习完成,跳转词意模式');
                        this.monsterEscape().then(() => {
                            // ViewsManager.instance.showView(PrefabType.WordMeaningView, (node: Node) => {
                            //     node.getComponent(WordMeaningView).initData(this._wordsData, this._levelData);
                            // });
                        });
                    } else {
                        this.showCurrentWord();
                    }
                });
            });
        }, 0.3);
    }

    //怪物逃跑
    monsterEscape() {
        return new Promise((resolve, reject) => {
            let pos = this.monster.position;
            let scale = this.monster.getScale();
            this.monster.scale = new Vec3(-scale.x, scale.y, 1);
            tween(this.monster).to(1, { position: new Vec3(pos.x + 1000, pos.y, pos.z) }).call(() => {
                resolve(true);
            }).start();
        });
    }

    //精灵攻击
    attackMonster() {
        return new Promise((resolve, reject) => {
            this._pet.getComponent(PetModel).hit().then(() => {
                if (this._wordIndex == this._wordsData.length) { //最后一个单词攻击主怪
                    this._monster.getComponent(MonsterModel).injury().then(() => {
                        resolve(true);
                    });
                } else { //小怪受到攻击
                    this._smallMonsters[this._wordIndex - 1].getComponent(SmallMonsterModel).hit();
                    resolve(true);
                }
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

    onClassificationWord(data: any) {
        if (data.Code != 200) {
            console.error("获取单词详情失败", data);
            return;
        }
        this._detailData = data.Data;
        console.log("获取单词详情", data);
    }

    private initEvent(): void {
        CCUtil.onTouch(this.btn_close.node, this.closeView, this);
        CCUtil.onTouch(this.btn_more, this.showWordDetail, this);
        CCUtil.onTouch(this.btn_hideDetail, this.hideWordDetail, this);
        this._wordDetailEveId = EventManager.on(EventType.Classification_Word, this.onClassificationWord.bind(this));
    }
    private removeEvent(): void {
        console.log('移除事件', this.btn_close);
        CCUtil.offTouch(this.btn_close.node, this.closeView, this);
        CCUtil.offTouch(this.btn_more, this.showWordDetail, this);
        CCUtil.offTouch(this.btn_hideDetail, this.hideWordDetail, this);
        EventManager.off(EventType.Classification_Word, this._wordDetailEveId);
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
    }
    onDestroy(): void {
        this.removeEvent();
        this._nodePool.clear();
        RemoteSoundMgr.clearAudio();
    }

    update(deltaTime: number) {

    }
    /**是否收藏 */
    private setCollect(isCollect: boolean) {
        this.btn_collect.getComponent(Sprite).grayscale = !isCollect
    }


}

