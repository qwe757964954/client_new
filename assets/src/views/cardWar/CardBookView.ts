import { _decorator, Color, Component, instantiate, Label, Node, Prefab, ScrollView, Sprite } from 'cc';
import { EventType } from '../../config/EventType';
import { NetConfig } from '../../config/NetConfig';
import { PrefabType } from '../../config/PrefabType';
import { LoadManager } from '../../manager/LoadManager';
import { ViewsManager } from '../../manager/ViewsManager';
import AudioUtil from '../../util/AudioUtil';
import CCUtil from '../../util/CCUtil';
import EventManager from '../../util/EventManager';
import { NetWordSimpleData, WordSimpleData2 } from '../TextbookVocabulary/SearchWordView';
import { WordCardBackItem } from './WordCardBackItem';
import { WordLearnMonestItem } from './WordLearnMonestItem';
import { CardSimpleInfo, WordMonestTabItem } from './WordMonestTabItem';
const { ccclass, property } = _decorator;

//Tab页需要的数据  // { name: "S级卡", level: "S", lock: false }
export interface CardTabItemData {
    name: string; //tab名
    level: string; //level名
    lock: boolean; //是否锁定
}

//有关卡牌UI的简单信息
export interface CardUISimpleInfo {
    Level: string | number; //等级
    CardImg: string; //图片路径名
    CardNo: string; //卡号
}

//有关卡牌的详细信息  //{"Level": "S", "CardImg": "1-1", "CardNo": 1001, "CardName": "绿龙", "Type": 0, "Cost": 2}
export interface CardUIDetailInfo {
    CardNo: number;  //卡牌index
    CardImg: string; //卡牌图片资源url
    Level: string | number; //等级
    CardName: string; //卡牌名字
    Type: number;  //类型
    Cost: number;  //需要消耗
}

@ccclass('CardBookView')
export class CardBookView extends Component {
    @property({ type: Node, tooltip: "返回按钮" }) // 
    public closeBtn: Node = null;

    @property({ type: Node, tooltip: "获取卡牌按钮" })
    public getBtn: Node = null;

    @property({ type: Node, tooltip: "显示已经获取卡牌按钮" }) //hideCardBtn
    public haveBtn: Node = null;

    @property({ type: Node, tooltip: "隐藏已经获取卡牌按钮" }) //
    public hideCardBtn: Node = null;

    @property({ type: Sprite, tooltip: "当前卡牌图片" })
    public monsterImg: Sprite = null;

    @property({ type: Label, tooltip: "当前卡牌名字" })
    public monsterNameTxt: Label = null;

    @property({ type: Label, tooltip: "当前卡牌详细名字" })
    public cardMsg: Label = null;

    @property({ type: Label, tooltip: "总共多少单词" })
    public totalWordTxt: Label = null;

    @property({ type: Node, tooltip: "获取卡牌按钮" })
    public cardShowBox: Node = null;

    @property({ type: Node, tooltip: "获取卡牌按钮" })
    public cardListBox: Node = null;

    @property({ type: ScrollView, tooltip: "标题卡牌Tab页" })
    public typeList: ScrollView = null;

    @property({ type: ScrollView, tooltip: "CardList列表" }) //
    public cardList: ScrollView = null;

    @property({ type: ScrollView, tooltip: "单词列表" }) //
    public wordList: ScrollView = null;

    @property({ type: Prefab, tooltip: "标题卡牌Tab预制体" }) //
    private preWordCardTabItem: Prefab = null;

    @property({ type: Prefab, tooltip: "卡牌列表里卡片的预制体" })
    private preWordCardItem: Prefab = null;

    @property({ type: Prefab, tooltip: "词条列表里词条的预制体" })
    private preWordLearnCardItem: Prefab = null;

    private selectType: string = "S";
    private typeItems: Node[] = [];
    private cardItems: Node[] = [];
    private haveList: NetWordSimpleData[] = [];
    private soundBtnList: Node[] = [];
    private learnTxtList: Node[] = [];
    private starImgList: Node[] = [];
    private selectCard: CardUIDetailInfo = null; //选中的卡牌数据
    private loadImgs = {};

    private isClose: boolean = false; //当前界面是否已经关闭

    private SlevelList: CardUISimpleInfo[] = [];
    private AlevelList: CardUISimpleInfo[] = [];
    private BlevelList: CardUISimpleInfo[] = [];
    private ClevelList: CardUISimpleInfo[] = [];
    private typeData: CardTabItemData[] = [];

    private _testCardShowEveId: string = ""; //测试显示卡牌信号
    private _testCardTypeSelectEveId: string = ""; //测试切换卡牌tab页
    private _testCardClickEveId: string = ""; //测试点击卡牌
    private _testCardWordEveId: string = "";  //测试显示卡牌列表

    protected async onLoad() {
        this.selectType = "S";
        this.typeItems = [];
        this.cardItems = [];
        this.haveList = [];

        this.soundBtnList = [];
        this.learnTxtList = [];
        this.starImgList = [];
        this.typeData = [];
        this.selectCard = null;
        this.loadImgs = {}; //加载的怪物卡片
        await this.init();
    }

    async init() {
        this.addEvent();
        this.cardShowBox.active = false;
        this.cardListBox.active = true;
        this.typeList.content.removeAllChildren();
        //Laya.loader.load("json/cards.json", Laya.Handler.create(this, this.onJSONLoaded), null, Laya.Loader.JSON);
        let json = await LoadManager.loadJson("cards")
            .then((json) => {
                //console.log(json);
                this.onJSONLoaded(json);
                this.initView();
                //测试代码,接口没送到
                EventManager.emit(EventType.CardBookView_CardShow, { Code: 200, Word: "", Cn: "你好，一种敬语。" });
            },
                (error) => {
                    console.log(error);
                });
        //SoundUtil.playLocalMusic("sound/bgm/card_book.mp3");
        AudioUtil.playMusic("sound/bgm/card_book");


    }

    onJSONLoaded(data: CardUIDetailInfo) {
        this.SlevelList = [];
        this.AlevelList = [];
        this.BlevelList = [];
        this.ClevelList = [];
        for (let k in data) {
            if (data[k].Level == "S") {
                this.SlevelList.push(data[k]);
            }
            else if (data[k].Level == "A") {
                this.AlevelList.push(data[k]);
            }
            else if (data[k].Level == "B") {
                this.BlevelList.push(data[k]);
            }
            else if (data[k].Level == "C") {
                this.ClevelList.push(data[k]);
            }
        }
    }

    addEvent() {
        //this.closeBtn.on(Laya.Event.CLICK, this, this.onClose);
        CCUtil.onTouch(this.closeBtn, this.onClose, this);//
        CCUtil.onTouch(this.getBtn, this.onGetCard, this);
        CCUtil.onTouch(this.haveBtn, this.showHaveCard, this);
        CCUtil.onTouch(this.hideCardBtn, this.onHideCard, this);
        this._testCardShowEveId = EventManager.on(EventType.CardBookView_CardShow, this.onCardShow.bind(this)); //
        this._testCardTypeSelectEveId = EventManager.on(EventType.CardBookView_TypeSelect, this.onTypeSelect.bind(this));
        //this._testCardTypeSelectEveId = EventManager.on(EventType.CardBookView_TypeSelect, this.onTypeSelect.bind(self));
        this._testCardClickEveId = EventManager.on(EventType.CardBookView_CardClick, this.onCardClick.bind(this));
        this._testCardWordEveId = EventManager.on(EventType.CardBookView_CardWord, this.onShowWordList.bind(this));
    }

    removeEvent() {
        CCUtil.offTouch(this.closeBtn, this.onClose, this);
        CCUtil.offTouch(this.getBtn, this.onGetCard, this);
        CCUtil.offTouch(this.haveBtn, this.showHaveCard, this);
        CCUtil.offTouch(this.hideCardBtn, this.onHideCard, this);
        EventManager.off(EventType.CardBookView_CardShow, this._testCardShowEveId);
        EventManager.off(EventType.CardBookView_TypeSelect, this._testCardTypeSelectEveId);
        EventManager.off(EventType.CardBookView_CardClick, this._testCardClickEveId);
        EventManager.off(EventType.CardBookView_CardWord, this._testCardWordEveId);
    }

    protected onDestroy(): void {
        this.removeEvent();
    }

    /**关闭页面 TODO*/
    private onClose() {
        //director.loadScene(SceneType.MainScene);
        ViewsManager.instance.closeView(PrefabType.CardBookView);
    }

    /**获取卡牌 TODO*/
    private onGetCard() {
        console.log("没有网络后端接口功能暂未实现");
    }

    /**显示获取的卡牌 TODO*/
    private showHaveCard() {

    }

    /**隐藏本人有的卡片栏 */
    onHideCard() {
        this.cardShowBox.active = false;
        this.cardListBox.active = true;
        // this.haveBtn.visible = true;
    }

    /**显示已经拥有的卡牌 */
    onCardShow(data: NetWordSimpleData) {
        this.haveList?.push(data);
        //this.initView();
    }

    initView() {
        this.typeData = [{ name: "S级卡", level: "S", lock: false },
        { name: "A级卡", level: "A", lock: false },
        { name: "B级卡", level: "B", lock: false },
        { name: "C级卡", level: "C", lock: false }];
        /*this.typeList.array = this.typeData;
        this.typeList.renderHandler = Laya.Handler.create(this, this.onTypeRender, null, false);
        this.updateCardList();*/

        this.typeList.content.removeAllChildren();
        this.typeItems = [];
        for (let i = 0; i < this.typeData.length; i++) {
            let data = this.typeData[i];
            let itemTab: Node = this.addTypeListItem(data);
            this.typeItems.push(itemTab);
        }
        this.typeList.scrollToTop();

        this.updateCardList();
    }

    private addTypeListItem(data: CardTabItemData): Node { // { name: "S级卡", level: "S", lock: false }
        console.log("addTypeListItem data:", data);
        if (!data) {
            return null;
        }

        let itemTab = instantiate(this.preWordCardTabItem);
        itemTab.getComponent(WordMonestTabItem).Init(data, this.selectType);

        this.typeList.content.addChild(itemTab);
        return itemTab;
    }

    private addCardListItem(data: CardUISimpleInfo): Node { // {"Level": "B", "CardImg": "1-14", "CardNo": "1014"}
        console.log("addCardListItem data:", data);
        if (!data) {
            return null;
        }

        let itemCard = instantiate(this.preWordCardItem);
        itemCard.getComponent(WordCardBackItem).init(data);
        this.cardList.content.addChild(itemCard);
        return itemCard;
    }

    updateCardList() {
        this.clearCardItem();
        let dataList: CardUISimpleInfo[] = [];
        if (this.selectType == "S") {
            dataList = this.SlevelList;
        } else if (this.selectType == "A") {
            dataList = this.AlevelList;
        } else if (this.selectType == "B") {
            dataList = this.BlevelList;
        } else if (this.selectType == "C") {
            dataList = this.ClevelList;
        }

        for (let i = 0; i < dataList.length; i++) {
            let data = dataList[i];
            let itemCard: Node = this.addCardListItem(data);
            this.cardItems.push(itemCard);
        }
        this.cardList.scrollToTop();
    }

    clearCardItem() {
        this.cardItems = [];
        this.cardList.content.removeAllChildren();
    }

    onTypeSelect(data: CardSimpleInfo) { //{ name: "S级卡", level: "S", lock: false }
        this.cardListBox.active = true;
        this.cardShowBox.active = false;
        if (data.level == 5) {
            //Tool.tip("该功能暂未解锁");
            ViewsManager.showTip("该功能暂未解锁");
            return;
        }
        this.selectType = data.level as string;
        for (let i = 0; i < this.typeItems.length; i++) {
            let wordTabItem: WordMonestTabItem = this.typeItems[i].getComponent(WordMonestTabItem);
            let bSelected = (wordTabItem.data.level == this.selectType);
            this.typeItems[i].getChildByName("focusImg").active = bSelected;
            if (bSelected) {
                this.typeItems[i].getChildByName("typeTxt").getComponent(Label).color = new Color("#ffffff");
            }
            else {
                this.typeItems[i].getChildByName("typeTxt").getComponent(Label).color = new Color("#53bf22");
            }
        }
        this.updateCardList();
    }

    /**点击卡牌 */
    onCardClick(data: CardUIDetailInfo) { // data = {"Level": "S", "CardImg": "1-1", "CardNo": 1001, "CardName": "绿龙", "Type": 0, "Cost": 2}
        if (!data) {
            return;
        }
        this.selectCard = data;
        let wordImgUrl: string = "";
        wordImgUrl = NetConfig.currentUrl + "/assets/imgs/newcard/" + data.CardNo + ".png";
        // 现在网址版图片暂时不可用，正式版才用，测试用本地图片
        // ImgUtil.loadRemoteImage(wordImgUrl, this.monsterImg.node, 275, 229);
        let imgUrl: string = "adventure/monster/" + data.CardImg + "/spriteFrame";
        LoadManager.loadSprite(imgUrl, this.monsterImg);
        this.monsterNameTxt.string = data.CardName;
        let typeStr = (data.Type == 0 || data.Type == 1) ? "攻击卡" : (data.Type == 2 ? "魔法卡" : "超级攻击卡");
        this.cardMsg.string = data.Level + "级（" + typeStr + "）-" + data.Cost + "消耗";

        this.onShowCard();
    }

    /**显示卡牌列表 */
    onShowCard() {
        if (!this.selectCard) return;
        //请求网络卡牌数据
        /*PbServiceManager.cardGameService.CardWord(this.selectCard.CardNo, (data) => {
            if (this.isClose) return;
            this.showWordList(data);
            this.totalWordTxt.text = "共计" + data.length + "词";
            this.cardListBox.visible = false;
            this.cardShowBox.visible = true;
            this.haveBtn.visible = false;
        })*/

        EventManager.emit(EventType.CardBookView_CardWord, [
            { Word: "give", Cn: "赠送，给予", Symbol: "[/ ˈtiːtʃə(r) /]" },
            { Word: "apple", Cn: "苹果", Symbol: "[/ ˈtiːtʃə(r) /]" },
        ]);

    }

    /**显示卡牌列表 */
    private onShowWordList(data: WordSimpleData2[]): void {
        if (this.isClose) return;
        this.showWordList(data);
        this.totalWordTxt.string = "共计" + data.length + "词";
        this.cardListBox.active = false;
        this.cardShowBox.active = true;
        this.haveBtn.active = false;
    }

    showWordList(dataList: Array<WordSimpleData2>) {
        this.clearItem();

        //this.wordList.array = data;
        //this.wordList.renderHandler = Laya.Handler.create(this, this.onWordRender, null, false);
        for (let i = 0; i < dataList.length; i++) {
            let data = dataList[i];
            let itemWord: Node = this.addWordListItem(data);
            this.cardItems.push(itemWord);
        }
        this.wordList.scrollToTop();
    }

    clearItem() {
        this.wordList.content.removeAllChildren();
        this.soundBtnList = [];
        this.learnTxtList = [];
        this.starImgList = [];
    }

    private addWordListItem(data: WordSimpleData2): Node { // { Word: "give", Cn: "赠送，给予", Symbol: "[/ ˈtiːtʃə(r) /]" }
        console.log("addWordListItem data:", data);
        if (!data) {
            return null;
        }

        let itemCard = instantiate(this.preWordLearnCardItem);
        itemCard.getComponent(WordLearnMonestItem).Init(data);
        this.wordList.content.addChild(itemCard);
        return itemCard;
    }

    start() {

    }

    update(deltaTime: number) {

    }
}


