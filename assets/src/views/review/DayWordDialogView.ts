import { _decorator, Component, Label, Node } from 'cc';
import EventManager from '../../util/EventManager';
import { EventType } from '../../config/EventType';
import { WordSimpleData2 } from '../TextbookVocabulary/SearchWordView';
import { ViewsManager } from '../../manager/ViewsManager';
import { PrefabType } from '../../config/PrefabType';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { DayWordItem } from './DayWordItem';
import { StudyRecordScoreData } from './StudyRecordView';
import { ToolUtil } from '../../util/ToolUtil';
import { TextConfig } from '../../config/TextConfig';
const { ccclass, property } = _decorator;

@ccclass('DayWordDialog')
export class DayWordDialogView extends Component {

    @property({ type: Node, tooltip: "返回按钮" }) //titleImg
    public btnClose: Node = null;

    @property({ type: Label, tooltip: "返回按钮旁边的标题文本" }) //totalNumTxt
    public titleText: Label = null;

    @property({ type: Label, tooltip: "学习单词总数文本" }) //totalNumTxt
    public totalNumTxt: Label = null;

    @property({ type: List, tooltip: "复习单词列表" })
    public wordList: List = null;

    private _words: string[] = []; //当日学习的单词列表

    private _soundBtnList: Node[] = [];
    private _learnTxtList: Node[] = [];
    private _starImgList: Node[] = [];

    private _reportDay: number = -1;  //点击的时间戳

    private _wordStudyEveId: string = ""; //当日学习单词列表事件

    private _myStudyWordsDay: WordSimpleData2[] = [];

    private _isClose: boolean = false; //界面是否关闭

    private _studyData: StudyRecordScoreData = null;

    init(reportData: StudyRecordScoreData) {

        this._words = [];
        this._soundBtnList = [];
        this._learnTxtList = [];
        this._starImgList = [];
        this._studyData = reportData;
        this._reportDay = reportData.ReportDate;
        this._isClose = false;

        let dateMy: Date = new Date(this._reportDay);
        let year = dateMy.getFullYear(); //年
        let month = dateMy.getMonth(); //月
        let date = dateMy.getDate(); //日
        this.titleText.string = year + "/" + (month + 1) + "/" + date;

        this.addEvent();
    }

    private addEvent() {
        CCUtil.onTouch(this.btnClose, this.closeView, this);
        this._wordStudyEveId = EventManager.on(EventType.StudyRecord_DayPrizeWord, this.onDayStudyWord.bind(this));
    }

    private removeEvent() {
        EventManager.off(EventType.StudyRecord_DayPrizeWord, this._wordStudyEveId);
    }

    protected onDestroy(): void {
        this.removeEvent();
    }

    start() {
        let wordDatas: WordSimpleData2[] = [
            { "Word": "please", "Cn": "请，一种敬语", "Symbol": "美[/ ˈtiːtʃə(r) /]" },
            { "Word": "give", "Cn": "给，赠予", "Symbol": "英[/ ˈtiːtʃə(r) /]" },
            { "Word": "apple", "Cn": "苹果", "Symbol": "美[/ ˈtiːtʃə(r) /]" },
            { "Word": "banana", "Cn": "香蕉", "Symbol": "美[/ ˈtiːtʃə(r) /]" },
            { "Word": "today", "Cn": "今天", "Symbol": "英[/ ˈtiːtʃə(r) /]" },
            { "Word": "dog", "Cn": "狗, 一种可爱的宠物", "Symbol": "美[/ ˈtiːtʃə(r) /]" },
            { "Word": "bird", "Cn": "鸟", "Symbol": "美[/ ˈtiːtʃə(r) /]" },
            { "Word": "game", "Cn": "游戏，电子游戏", "Symbol": "美[/ ˈtiːtʃə(r) /]" },
            { "Word": "plane", "Cn": "飞机，天上飞的", "Symbol": "美[/ ˈtiːtʃə(r) /]" },
            { "Word": "god", "Cn": "上帝，人类世界的造物主，天神", "Symbol": "英[/ ˈtiːtʃə(r) /]" },
        ];
        EventManager.emit(EventType.StudyRecord_DayPrizeWord, wordDatas); //模拟网络消息发送数据
    }

    //收到网络复习单词列表消息
    onDayStudyWord(datas: WordSimpleData2[]) {
        //判断data是数组，并且长度大于1
        if (Array.isArray(datas) && datas.length > 0) {
            this._myStudyWordsDay = datas;
            this.wordList.numItems = datas.length;
            this.wordList.update();

            // this.totalNumTxt.string = "共计" + datas.length + "词";

            let strTotalNum: string = ToolUtil.replace(TextConfig.Word_Learn_Count, datas.length);
            this.totalNumTxt.string = strTotalNum;
        }
        else {
            this._myStudyWordsDay = []
            this.wordList.numItems = this._myStudyWordsDay.length;
            this.wordList.update();
            //this.totalNumTxt.string = "共计" + 0 + "词";
            let strTotalNum: string = ToolUtil.replace(TextConfig.Word_Learn_Count, 0);
            this.totalNumTxt.string = strTotalNum;
        }

    }

    //加载单词列表一项
    onLoadMyTextBookVerticalList(item: Node, idx: number) {
        let myWordLearnItemScript: DayWordItem = item.getComponent(DayWordItem);
        let itemInfo: WordSimpleData2 = this._myStudyWordsDay[idx];
        myWordLearnItemScript.initUI(itemInfo);
    }

    /**关闭页面 TODO*/
    private closeView() {
        this._isClose = true;
        ViewsManager.instance.closeView(PrefabType.DayWordDialogView);
    }

    update(deltaTime: number) {

    }
}


