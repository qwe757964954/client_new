import { _decorator, Color, Component, Label, Node } from 'cc';
import { BaseView } from '../../script/BaseView';
import { CustomVideo } from '../common/CustomVideo';
import { EventMgr } from '../../util/EventManager';
import { EventType } from '../../config/EventType';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { SymbolItem } from './item/SymbolItem';
import { DataMgr, PhonicsConfigData } from '../../manager/DataMgr';
const { ccclass, property } = _decorator;

@ccclass('PhonicsPanel')
export class PhonicsPanel extends BaseView {
    @property(CustomVideo)
    customVideo: CustomVideo = null;
    @property(Label)
    playMsgLabel: Label = null;
    @property(Label)
    wordLabel: Label = null;
    @property(Node)
    playBtn: Node = null;
    @property([Node])
    labelNodes: Node[] = [];
    @property(List)
    symbolList: List = null;

    private _dataArray: any[] = [];
    private _tabIdx = 0;

    private _datas: any[] = [[], [], [], [], [], []];

    protected initUI(): void {
        let configData = DataMgr.getPhonicsConfig();
        for (let i = 0; i < configData.length; i++) {
            if (configData[i].type == "26个字母") {
                this._datas[0].push(configData[i]);
            } else if (configData[i].type == "短元音") {
                this._datas[1].push(configData[i]);
            } else if (configData[i].type == "辅音") {
                this._datas[2].push(configData[i]);
            } else if (configData[i].type == "长元音") {
                this._datas[3].push(configData[i]);
            } else if (configData[i].type == "复合字母") {
                this._datas[4].push(configData[i]);
            } else if (configData[i].type == "字母组合") {
                this._datas[5].push(configData[i]);
            }
        }
        this._dataArray = this._datas[0];
        this.symbolList.numItems = this._dataArray.length;
    }

    onSymbolClick(data: PhonicsConfigData) {
        console.log("dddddddd", data);
        for (let i = 0; i < this.symbolList.numItems; i++) {
            let itemNode = this.symbolList.getItemByListId(i);
            if (!itemNode) continue;
            let item: SymbolItem = itemNode.getComponent(SymbolItem);
            item.isSelect = item.data == data;
        }
        if (data.words) {
            this.wordLabel.string = data.words.join("  ");
            this.wordLabel.node.active = true;
        }
        if (this.customVideo) {
            this.resetVideo();
            this.customVideo.setVideoUrl("https://www.chuangciyingyu.com/assets/phonics/" + data.url);
            this.playMsgLabel.string = "正在播放：" + data.symbol;
        }
    }

    onSymbolItemRender(item: Node, index: number) {
        item.getComponent(SymbolItem).setData(this._dataArray[index]);
    }

    resetVideo() {
        this.customVideo.reset();
    }

    changeType(idx: number) {
        this._tabIdx = idx;
        for (let i = 0; i < this.labelNodes.length; i++) {
            let label = this.labelNodes[i].getComponent(Label);
            label.color = i == idx ? new Color(190, 236, 109) : Color.WHITE;
        }
        this._dataArray = this._datas[idx];
        this.symbolList.numItems = this._dataArray.length;
        this.wordLabel.node.active = false;
        if (idx == 0) {
            this.playBtn.active = true;
        } else {
            this.playBtn.active = false;
        }
    }

    onPlayBtnClick() {
        EventMgr.dispatch(EventType.Phonics_Game_Play_Click);
    }

    protected initEvent(): void {
        EventMgr.addListener(EventType.Symbol_Click, this.onSymbolClick, this);
        CCUtil.onTouch(this.playBtn, this.onPlayBtnClick, this);
        for (let i = 0; i < this.labelNodes.length; i++) {
            CCUtil.onTouch(this.labelNodes[i], this.changeType.bind(this, [i]), this);
        }
    }

    protected removeEvent(): void {
        EventMgr.removeListener(EventType.Symbol_Click, this);
        CCUtil.offTouch(this.playBtn, this.onPlayBtnClick, this);
        for (let i = 0; i < this.labelNodes.length; i++) {
            CCUtil.offTouch(this.labelNodes[i], this.changeType, this);
        }
    }
}


