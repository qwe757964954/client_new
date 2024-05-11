import { _decorator, Component, instantiate, Label, Node, Prefab, ScrollView } from 'cc';
import { ViewsManager } from '../../manager/ViewsManager';
import { AmoutItemData, AmoutType, TopAmoutView } from '../common/TopAmoutView';
import { User } from '../../models/User';
import CCUtil from '../../util/CCUtil';
import { PrefabType } from '../../config/PrefabType';
import List from '../../util/list/List';
import { ReviewDateItem } from './ReviewDateItem';
import { EventType } from '../../config/EventType';
import EventManager from '../../util/EventManager';
import { DayWordDialogView } from './DayWordDialogView';
const { ccclass, property } = _decorator;

/**单词简单结构 */
export interface StudyRecordDateData {
    date: number; //日期
    year: number; //年份
    month: number; //月份
    report: StudyRecordScoreData, //学习记录
}

/**这一天的学习纪录 */
export interface StudyRecordScoreData {
    ReportDate: number, //这一天的时间戳
    Score: number,  //得分
    StudyNum: number, //学习了多少单词
    TimeNum: number, //学习了多长时间
}

@ccclass('StudyRecordView')
export class StudyRecordView extends Component {

    @property({ type: Node, tooltip: "顶部个人信息栏" })
    public top_layout: Node = null;

    @property({ type: Node, tooltip: "返回按钮" }) //btn_next
    public btnClose: Node = null;

    @property({ type: Node, tooltip: "下一个月" }) //
    public btn_next: Node = null;

    @property({ type: Node, tooltip: "上一个月" }) //
    public btn_pre: Node = null;

    @property({ type: Node, tooltip: "显示单词" }) //
    public btn_showWord: Node = null;

    @property({ type: Label, tooltip: "返回按钮" }) //
    public yearTxt: Label = null;

    @property({ type: Label, tooltip: "显示学了多少" }) //tips
    public tipsTxt: Label = null;

    @property({ type: Node, tooltip: "TIPS结点" }) //btn_next
    public tips: Node = null;

    @property({ type: Prefab, tooltip: "学习计划日期预制体" }) //
    public preStudyDateItem: Prefab = null;

    //@property({ type: List, tooltip: "日程计划列表" })
    //public dateList: List = null;

    @property({ type: ScrollView, tooltip: "日程计划列表" })
    public dateList: ScrollView = null;

    private _itemList: Array<Node> = [];
    private _monthEn: string[] = [];
    private _isRequest: boolean = false;
    private _currentYear: number = 0; //当前年份
    private _currentMonth: number = 0; //当前月份
    private _currentDate: number = 0;  //当前日期

    private _myStudyDateDataArr: StudyRecordDateData[] = [];

    private _monthPrize: StudyRecordScoreData[] = []; //用户每月得分情况

    private _testMonthPriceEveId: string = ""; // 每月获得得分奖励事件
    private _testClickDateRecordEveId: string = ""; //点击某个纪录项事件

    private _currentData: StudyRecordScoreData = null;

    protected onLoad(): void {
        this._itemList = [];
        this._monthEn = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        this._isRequest = false;
        this.init();
    }

    private init() {
        this.initEvent();
        this._myStudyDateDataArr = [];
        this._monthPrize = [];
        let date = new Date();
        this._currentYear = date.getFullYear();
        this._currentMonth = date.getMonth();
        this._currentDate = date.getDate();
    }

    initEvent() {
        CCUtil.onTouch(this.btnClose, this.onCloseView, this);

        CCUtil.onTouch(this.btn_next, this.goNext, this);
        CCUtil.onTouch(this.btn_pre, this.goPre, this);
        CCUtil.onTouch(this.btn_showWord, this.showWord, this);

        this._testMonthPriceEveId = EventManager.on(EventType.StudyRecord_MonthPrice, this.onTestMonthPrice.bind(this));
        this._testClickDateRecordEveId = EventManager.on(EventType.StudyRecord_ClickDateRecord, this.onTestClickDateRecord.bind(this));
    }

    removeEvent() {
        CCUtil.offTouch(this.btnClose, this.onCloseView, this);
        CCUtil.offTouch(this.btn_next, this.goNext, this);
        CCUtil.offTouch(this.btn_pre, this.goPre, this);
        CCUtil.offTouch(this.btn_showWord, this.showWord, this);
        EventManager.off(EventType.StudyRecord_MonthPrice, this._testMonthPriceEveId);
        EventManager.off(EventType.StudyRecord_ClickDateRecord, this._testClickDateRecordEveId);
    }

    protected onDestroy(): void {
        this.removeEvent();
    }

    start() {
        this.initUI();
    }

    protected initUI() {
        this.btn_showWord.active = false;
        this.initAmout();
        this.initCalendar();
    }

    /**初始化游戏数值 */
    initAmout() {
        ViewsManager.addAmout(this.top_layout, 15.78, 22.437).then((amoutScript: TopAmoutView) => {
            let dataArr: AmoutItemData[] = [{ type: AmoutType.Diamond, num: User.diamond },
            { type: AmoutType.Coin, num: User.coin },
            { type: AmoutType.Energy, num: User.stamina }];
            amoutScript.loadAmoutData(dataArr);
        });
    }

    /**初始化日期 */
    initCalendar() {
        if (this._isRequest) return;
        this._itemList = [];
        let now = new Date(this._currentYear, this._currentMonth, this._currentDate);
        let year = now.getFullYear(); //年
        let month = now.getMonth(); //月
        let date = now.getDate(); //日
        let day = now.getDay(); //星期
        let isLeapyear = year % 400 == 0 || (year % 4 == 0 && year % 100 != 0); //是否是闰年
        let bigMonth = [1, 3, 5, 7, 8, 10, 12];
        let dateCount = month == 1 ? (isLeapyear ? 29 : 28) : (bigMonth.indexOf(month + 1) == -1 ? 30 : 31); //当月有几天
        let startDay = new Date(year, month, 1).getDay();//当月开始是星期几 0表示星期日
        if (startDay == 0) startDay = 7;

        this._myStudyDateDataArr = [];
        let starDate: number = 1;
        for (let i = 0; i < 42; i++) {
            if (i < startDay - 1 || starDate > dateCount) {
                let itemData: StudyRecordDateData = {
                    date: -1,
                    year: -1,
                    month: -1,
                    report: null,
                };
                this._myStudyDateDataArr.push(itemData);
            } else {
                let itemData: StudyRecordDateData = {
                    date: starDate,
                    year: year,
                    month: month,
                    report: null,
                };

                this._myStudyDateDataArr.push(itemData);
                starDate++;
            }
        }

        this.dateList.content.removeAllChildren();
        for (let i = 0; i < this._myStudyDateDataArr.length; i++) {
            let itemData: StudyRecordDateData = this._myStudyDateDataArr[i];
            this.addOneDateListItem(i, itemData);
        }

        this.dateList.scrollToTop();

        //this.dateList.numItems = this._myStudyDateDataArr.length;
        //this.dateList.update();

        let monthStr = month + 1 < 10 ? ("0" + (month + 1)) : (month + 1);
        this.yearTxt.string = year + "/" + monthStr;

        // 测试，接受网络数据每月学习奖励情况
        // 生成三个时间戳
        let date1 = new Date(2024, 4, 8);
        let timestamp1: number = date1.getTime();
        let dateMy1: Date = new Date(timestamp1);
        let dateMyDay1: number = dateMy1.getDate();
        let dateMyMonth1: number = dateMy1.getMonth();
        let date2 = new Date(2024, 4, 9);
        let timestamp2: number = date2.getTime();
        let dateMy2: Date = new Date(timestamp2);
        let date3 = new Date(2024, 4, 10);
        let timestamp3: number = date3.getTime();
        let dateMy3: Date = new Date(timestamp3);
        var authorDatas: StudyRecordScoreData[] = [
            { "ReportDate": timestamp1, "Score": 1, StudyNum: 10, TimeNum: 30 },
            { "ReportDate": timestamp2, "Score": 2, StudyNum: 20, TimeNum: 50 },
            { "ReportDate": timestamp3, "Score": 3, StudyNum: 60, TimeNum: 100 },
        ];
        EventManager.emit(EventType.StudyRecord_MonthPrice, authorDatas);
    }

    onLoadMyDateList(item: Node, idx: number) {
        // let myStudyDateItemScript: ReviewDateItem = item.getComponent(ReviewDateItem);
        // let itemInfo: StudyRecordDateData = this._myStudyDateDataArr[idx];
        // myStudyDateItemScript.updateMyContentItemProps(idx, itemInfo);
    }

    addOneDateListItem(idx: number, itemData: StudyRecordDateData) {
        if (!itemData) {
            return;
        }
        let itemDate = instantiate(this.preStudyDateItem);
        itemDate.getComponent(ReviewDateItem).updateMyContentItemProps(idx, itemData);
        this.dateList.content.addChild(itemDate);
    }

    /**一个月的得分奖励情况 */ // StudyRecordScoreData
    onTestMonthPrice(data: StudyRecordScoreData[]) {
        //var data:
        console.log("onTestMonthPrice:", data);
        this._isRequest = false;
        this._monthPrize = data;
        let dateChild: Node = null;
        let reviewDateItem: ReviewDateItem = null;
        let studyRecordDate: StudyRecordDateData = null;
        for (let i = 0; i < this.dateList.content.children.length; i++) {
            dateChild = this.dateList.content.children[i];
            reviewDateItem = dateChild.getComponent(ReviewDateItem);
            if (!reviewDateItem) {
                continue;
            }
            studyRecordDate = reviewDateItem.studyRecordDate;

            for (let j = 0; j < data.length; j++) {
                let date: Date = new Date(data[j].ReportDate);
                let score: number = data[j].Score;
                let fullYear: number = date.getFullYear();
                let month: number = date.getMonth();
                let date1: number = date.getDate();
                if (date.getFullYear() == studyRecordDate.year &&
                    date.getMonth() == studyRecordDate.month && date.getDate() == studyRecordDate.date) {
                    this.dateList.content.children[i].getComponent(ReviewDateItem).studyRecordDate.report = data[j];
                    //dataSource.report = data[j];
                    reviewDateItem.setScoreUI(score); //设置星星
                }
            }
        }
    }

    onTestClickDateRecord(data: StudyRecordDateData) {
        if (data.report) {
            this._currentData = data.report;
            this.tipsTxt.string = "这一天你共学了" + data.report.StudyNum + "个单词，用时" + data.report.TimeNum + "分钟。";
            this.btn_showWord.active = true;
        } else {
            this._currentData = null;
            this.tipsTxt.string = "这一天你没有学习哦，明天别忘记啦。";
            this.btn_showWord.active = false;
        }
        this.tips.active = true;
    }

    goNext() {
        if (this._isRequest) return;
        this._currentMonth += 1;
        if (this._currentMonth > 11) {
            this._currentMonth = 0;
            this._currentYear += 1;
        }
        this._currentDate = 1;
        this.initCalendar();
    }

    goPre() {
        if (this._isRequest) return;
        this._currentMonth -= 1;
        if (this._currentMonth < 0) {
            this._currentMonth = 11;
            this._currentYear -= 1;
        }
        this._currentDate = 1;
        this.initCalendar();
    }

    /**显示点击的某日单词学习列表 */
    showWord() {
        if (!this._currentData) {
            return;
        }
        // let dayWordDialog = new DayWordDialog(this._currentData.report.ReportDate);
        // dayWordDialog.popup();

        ViewsManager.instance.showView(PrefabType.DayWordDialogView, (node: Node) => {
            node.getComponent(DayWordDialogView).init(this._currentData);
        });
    }

    /**关闭页面 */
    onCloseView() {
        ViewsManager.instance.closeView(PrefabType.StudyRecordView);
    }

    update(deltaTime: number) {

    }
}


