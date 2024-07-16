import { _decorator, Label, Node, Sprite } from 'cc';
import { TextConfig } from '../../config/TextConfig';
import { LoadManager } from '../../manager/LoadManager';
import { RemoteSoundMgr } from '../../manager/RemoteSoundManager';
import { SoundMgr } from '../../manager/SoundMgr';
import { ViewsMgr } from '../../manager/ViewsManager';
import { BuildingState } from '../../models/BuildingModel';
import { s2cBuildingBuiltSpeed, s2cBuildingProduceSpeed, s2cBuildingUpgradeSpeed, s2cCloudUnlockSpeed, s2cSpeedWordInfo } from '../../models/NetModel';
import { InterfacePath } from '../../net/InterfacePath';
import { ServiceMgr } from '../../net/ServiceManager';
import { BaseComponent } from '../../script/BaseComponent';
import CCUtil from '../../util/CCUtil';
import { TimerMgr } from '../../util/TimerMgr';
import { ToolUtil } from '../../util/ToolUtil';
const { ccclass, property } = _decorator;

const bgPngs = [
    "common/list_bg_0/spriteFrame",
    "common/list_bg_1/spriteFrame",
    "common/list_bg_2/spriteFrame",
]
const statusPngs = [
    "common/img_right/spriteFrame",
    "common/img_wrong/spriteFrame",
]

class AnswerUI {
    node: Node = null;
    bg: Sprite = null;
    word: Label = null;
    status: Sprite = null;
}

@ccclass('SpeedWordsView')
export class SpeedWordsView extends BaseComponent {
    @property({ type: Label, tooltip: "单词Label" })
    wordLabel: Label = null;
    @property({ type: Label, tooltip: "音标Label" })
    symbolLabel: Label = null;
    @property({ type: [Node], tooltip: "答案列表" })
    answerList: Node[] = [];
    @property({ type: Node, tooltip: "单词读音" })
    wordSound: Node = null;
    @property(Label)
    timeLabel: Label = null;
    @property(Label)
    timesLabel: Label = null;

    private _answerUIList: AnswerUI[] = [];//答案UI列表
    private _buildingID: number = null;//建筑ID
    private _buildingState: BuildingState = null;//建筑状态
    private _product_num: number = null;//生产索引
    private _unlock_cloud: string = null;//解锁乌云
    private _word_list: s2cSpeedWordInfo[] = null;//单词列表
    private _remainTime: number = 0;//剩余时间
    private _timer: number = null;//定时器
    private _wrongTimes: number[] = [];//每个单词错误次数
    private _rightStatus: boolean[] = [];//每个单词是否正确
    private _rightCount: number = 0;//正确次数
    private _curWordIndex: number = 0;//当前单词索引
    private _curAnswerList: s2cSpeedWordInfo[] = null;//当前答案列表
    private _canSelectAnswer: boolean = false;//是否可以选择答案
    private _selectAnswerIndex: number = null;//选中答案索引

    protected onLoad(): void {
        this.initUI();
        this.initEvent();
    }
    protected onDestroy(): void {
        this.clearTimer();
        this.removeEvent();
    }
    initEvent() {
        CCUtil.onTouch(this.wordSound, this.playWordSound, this);
        for (let i = 0; i < this.answerList.length; i++) {
            CCUtil.onTouch(this.answerList[i], this.onAnswerClick.bind(this, i), this);
        }

        this.addEvent(InterfacePath.c2sBuildingBuiltSpeed, this.onRepBuildingBuiltSpeed.bind(this));
        this.addEvent(InterfacePath.c2sBuildingUpgradeSpeed, this.onRepBuildingUpgradeSpeed.bind(this));
        this.addEvent(InterfacePath.c2sBuildingProduceSpeed, this.onRepBuildingProduceSpeed.bind(this));
        this.addEvent(InterfacePath.c2sCloudUnlockSpeed, this.onRepCloudUnlockSpeed.bind(this));
    }
    removeEvent() {
        CCUtil.offTouch(this.wordSound, this.playWordSound, this);
        for (let i = 0; i < this.answerList.length; i++) {
            CCUtil.offTouch(this.answerList[i]);
        }
        this.clearEvent();
    }

    initUI() {
        for (let i = 0; i < this.answerList.length; i++) {
            const element = this.answerList[i];
            let tmp = new AnswerUI();
            tmp.node = element;
            tmp.bg = element.getComponent(Sprite);
            tmp.word = element.getComponentInChildren(Label);
            tmp.status = element.getComponentInChildren(Sprite);
            this._answerUIList.push(tmp);
        }
    }
    initData(buildingID: number, word_list: s2cSpeedWordInfo[], state: BuildingState, product_num: number) {
        this._buildingID = buildingID;
        this._buildingState = state;
        this._product_num = product_num;
        this._unlock_cloud = null;
        this._word_list = word_list;
        this.initWordsList();
        this.startAnswer();
    }
    initDataEx(unlock_cloud: string, word_list: s2cSpeedWordInfo[]) {
        this._buildingID = null;
        this._buildingState = null;
        this._product_num = null;
        this._unlock_cloud = unlock_cloud;
        this._word_list = word_list;
        this.initWordsList();
        this.startAnswer();
    }
    initWordsList() {
        this._wrongTimes = [];
        this._rightStatus = [];
        for (let i = 0; i < this._word_list.length; i++) {
            this._wrongTimes.push(0);
            this._rightStatus.push(false);
        }
    }
    clearTimer(): void {
        if (this._timer) {
            TimerMgr.stopLoop(this._timer);
            this._timer = null;
        }
    }
    /**设置倒计时 */
    setRemainTime(remainTime: number) {
        this._remainTime = remainTime;
        this.clearTimer();
        this._timer = TimerMgr.loop(() => {
            this._remainTime--;
            if (this._remainTime < 0) {
                this.clearTimer();
                return;
            }
            this.showTime();
        }, 1000);
        this.showTime();
    }
    /**显示正确次数 */
    showRightCount() {
        this.timesLabel.string = ToolUtil.replace(TextConfig.Queue_Text, this._rightCount, this._word_list.length);
    }
    /**显示时间 */
    showTime() {
        this.timeLabel.string = ToolUtil.getSecFormatStr(this._remainTime);
    }
    /**选择答案 */
    onAnswerClick(index: number) {
        if (!this._canSelectAnswer) return;
        if (null != this._selectAnswerIndex) {
            this.submitAnswer();
            return;
        }
        this._canSelectAnswer = false;
        this.answerResult(index);
    }
    /**开始答题 */
    startAnswer() {
        this._curWordIndex = 0;
        this.showRightCount();
        this.showCurrentWord();
    }
    /**下一题 */
    goToNext() {
        let nextID = null;
        let wordCount = this._word_list.length;
        for (let i = 0; i < wordCount; i++) {
            let index = (this._curWordIndex + i + 1) % wordCount;
            if (this._rightStatus[index]) continue;
            nextID = index;
            break;
        }
        if (null == nextID) {
            this.endAnswer();
            return;
        }
        this._curWordIndex = nextID;
        this.showCurrentWord();
    }
    /**结束答题 */
    endAnswer() {
        this.node.destroy();
    }
    /**答题结果 */
    answerResult(selectID: number) {
        this._selectAnswerIndex = selectID;
        let isRight = false;
        if (selectID >= this._curAnswerList.length) {
            isRight = false;
        } else {
            isRight = this._curAnswerList[selectID] == this._word_list[this._curWordIndex];
        }
        let answerUI = this._answerUIList[selectID];
        answerUI.status.node.active = true;
        if (isRight) {
            this._rightCount++;
            this._rightStatus[this._curWordIndex] = true;
            SoundMgr.correct();
            LoadManager.loadSprite(bgPngs[1], answerUI.bg);
            LoadManager.loadSprite(statusPngs[0], answerUI.status);
        } else {
            this._wrongTimes[this._curWordIndex]++;
            SoundMgr.wrong();
            LoadManager.loadSprite(bgPngs[2], answerUI.bg);
            LoadManager.loadSprite(statusPngs[1], answerUI.status);
        }
        this.showRightCount();
        this.scheduleOnce(() => {
            if (isRight) {
                this.submitAnswer();
            } else {
                this.goToNext();
            }
        }, 1);
    }
    /**显示当前题目 */
    showCurrentWord() {
        this.unscheduleAllCallbacks();
        let data = this._word_list[this._curWordIndex];
        this.wordLabel.string = data.word;
        this.symbolLabel.string = data.symbol;
        // 随机题目
        let maxCount = this._answerUIList.length;
        let wordCount = this._word_list.length;
        let count = wordCount > maxCount ? maxCount : wordCount;
        this._curAnswerList = [data];
        count--;
        let tmpList = this._word_list.concat();
        while (count > 0) {
            let tmpIndex = ToolUtil.getRandomInt(0, tmpList.length - 1);
            let tmpData = tmpList[tmpIndex];
            tmpList.splice(tmpIndex, 1);
            if (tmpData == data) continue;
            this._curAnswerList.push(tmpData);
            count--;
        }

        for (let i = 0; i < this._answerUIList.length; i++) {
            const element = this._answerUIList[i];
            if (i >= this._curAnswerList.length) {
                element.node.active = false;
                continue;
            }
            let tmpData = this._curAnswerList[i];
            element.node.active = true;
            element.word.string = tmpData.cn;
            element.status.node.active = false;
            LoadManager.loadSprite(bgPngs[0], element.bg);
        }

        this._canSelectAnswer = true;
        this._selectAnswerIndex = null;
    }
    /**播放单词音频 */
    playWordSound() {
        RemoteSoundMgr.playWord(this._word_list[this._curWordIndex].word);
    }
    /**提交答案 */
    submitAnswer() {
        this.scheduleOnce(() => {
            this._canSelectAnswer = true;//超时可以重新提交
        }, 3);
        let word = this._word_list[this._curWordIndex].word;
        let answer = this._curAnswerList[this._selectAnswerIndex].word;
        if (this._unlock_cloud) {
            ServiceMgr.buildingService.reqCloudUnlockSpeed(this._unlock_cloud, word, answer);
        } else {
            if (BuildingState.building == this._buildingState) {
                ServiceMgr.buildingService.reqBuildingBuiltSpeed(this._buildingID, word, answer);
            } else if (BuildingState.upgrade == this._buildingState) {
                ServiceMgr.buildingService.reqBuildingUpgradeSpeed(this._buildingID, word, answer);
            } else if (null != this._product_num) {
                ServiceMgr.buildingService.reqBuildingProduceSpeed(this._buildingID, word, answer, this._product_num);
            } else {
                console.error("speed words submitAnswer error");
            }
        }
    }
    /**乌云解锁加速回调 */
    onRepCloudUnlockSpeed(data: s2cCloudUnlockSpeed) {
        if (200 != data.code) {
            ViewsMgr.showAlert(data.msg);
            this.endAnswer();
            return;
        }
        let unlock_cloud = null;
        let sec = null;
        for (const key in data.cloud_dict) {
            unlock_cloud = key;
            sec = data.cloud_dict[key];
        }
        if (null != unlock_cloud && null != sec) {
            if (unlock_cloud != this._unlock_cloud) {
                this.endAnswer();
                return;
            }
            this.setRemainTime(sec);
        }
        this.goToNext();
    }
    /**建筑建造加速回调 */
    onRepBuildingBuiltSpeed(data: s2cBuildingBuiltSpeed) {
        if (200 != data.code) {
            ViewsMgr.showAlert(data.msg);
            this.endAnswer();
            return;
        }
        if (data.id != this._buildingID) {
            this.endAnswer();
            return;
        }
        this.setRemainTime(data.construct_infos.remaining_seconds);
        this.goToNext();
    }
    /**建筑升级加速回调 */
    onRepBuildingUpgradeSpeed(data: s2cBuildingUpgradeSpeed) {
        if (200 != data.code) {
            ViewsMgr.showAlert(data.msg);
            this.endAnswer();
            return;
        }
        if (data.id != this._buildingID) {
            this.endAnswer();
            return;
        }
        this.setRemainTime(data.upgrade_infos.remaining_seconds);
        this.goToNext();
    }
    /**建筑生产加速回调 */
    onRepBuildingProduceSpeed(data: s2cBuildingProduceSpeed) {
        if (200 != data.code) {
            ViewsMgr.showAlert(data.msg);
            this.endAnswer();
            return;
        }
        if (data.id != this._buildingID || data.product_infos.length >= data.product_infos.length) {
            this.endAnswer();
            return;
        }
        let sec = data.product_infos[data.product_num].remaining_seconds;
        this.setRemainTime(sec);
        this.goToNext();
    }
}


