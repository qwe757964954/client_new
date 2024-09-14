import { _decorator, Color, Component, instantiate, Label, Layout, Node, Prefab, UITransform, url, VideoPlayer } from 'cc';
import { BaseView } from '../../script/BaseView';
import { SymbolNode } from './SymbolNode';
import { CustomVideo } from '../common/CustomVideo';
import { EventMgr } from '../../util/EventManager';
import { EventType } from '../../config/EventType';
import CCUtil from '../../util/CCUtil';
import { DataMgr, PhonicsConfigData } from '../../manager/DataMgr';
const { ccclass, property } = _decorator;

@ccclass('SymbolPanel')
export class SymbolPanel extends BaseView {
    @property(CustomVideo)
    customVideo: CustomVideo = null;
    @property(Label)
    playMsgLabel: Label = null;
    @property(Label)
    resultTipLabel: Label = null;
    @property(Label)
    yuanyinLabel: Label = null;
    @property(Label)
    fuyinLabel: Label = null;
    @property(Node)
    recordNode: Node = null;
    @property(Node)
    mySoundNode: Node = null;
    @property(Label)
    scoreLabel: Label = null;
    @property(Label)
    topScoreLabel: Label = null;
    @property(Node)
    public nodeContent: Node = null;
    @property(Prefab)
    symbolNodePreb: Prefab = null;

    private _symbolNodes: Node[] = [];
    private _yuanDatas: any[] = []; //元音数据
    private _fuyinDatas: any[] = []; //辅音数据

    protected onEnable(): void {
        let ySymbolList = [{ title: "短元音", list: [] },
        { title: "长元音", list: [] },
        { title: "双元音", list: [] }
        ];
        let fSymbolList = [{ title: "清辅音", list: [] },
        { title: "浊辅音", list: [] },
        { title: "鼻音", list: [] },
        { title: "拟拼音", list: [] },
        { title: "半元音", list: [] }];
        let configData = DataMgr.getSymbolConfig();
        for (let i = 0; i < ySymbolList.length; i++) {
            for (let j = 0; j < configData.length; j++) {
                if (configData[j].type == ySymbolList[i].title) {
                    ySymbolList[i].list.push(configData[j])
                }
            }
        }

        for (let i = 0; i < fSymbolList.length; i++) {
            for (let j = 0; j < configData.length; j++) {
                if (configData[j].type == fSymbolList[i].title) {
                    fSymbolList[i].list.push(configData[j])
                }
            }
        }

        this._yuanDatas = ySymbolList;
        this._fuyinDatas = fSymbolList;

        this.showSymbolPanel(1);
    }

    showSymbolPanel(type: number) {
        this.resetVideo();
        for (let i = 0; i < this._symbolNodes.length; i++) {
            this._symbolNodes[i].destroy();
        }
        this._symbolNodes = [];
        let contentUf = this.nodeContent.getComponent(UITransform);
        let totalHeight = 0;
        let symbolList: any[] = [];
        if (type == 1) {
            symbolList = this._yuanDatas;
        } else {
            symbolList = this._fuyinDatas;
        }

        for (let i = 0; i < symbolList.length; i++) {
            let symbolNode = instantiate(this.symbolNodePreb);
            symbolNode.getComponent(SymbolNode).setData(symbolList[i]);
            this.nodeContent.addChild(symbolNode);
            this._symbolNodes.push(symbolNode);
        }
        setTimeout(() => {
            for (let i = 0; i < this._symbolNodes.length; i++) {
                let symbolNode = this._symbolNodes[i];
                symbolNode.getComponent(UITransform).height = symbolNode.getComponent(SymbolNode).contentUt.height;
                totalHeight += symbolNode.getComponent(UITransform).height + contentUf.getComponent(Layout).spacingY;
            }
            contentUf.height = totalHeight;
        }, 50);
    }

    onSymbolClick(data: PhonicsConfigData) {
        console.log("dddddddd", data);
        for (let i = 0; i < this._symbolNodes.length; i++) {
            if (!this._symbolNodes[i]) continue;
            this._symbolNodes[i].getComponent(SymbolNode).changeSelectStatus(data);
        }
        if (this.customVideo) {
            this.resetVideo();
            this.customVideo.setVideoUrl("https://www.chuangciyingyu.com/assets/phonics/symbol/" + data.url);
            this.playMsgLabel.string = "正在播放：" + data.symbol;
        }
    }

    resetVideo() {
        this.customVideo.reset();
    }

    showYuanyinPanel() {
        this.showSymbolPanel(1);
        this.yuanyinLabel.color = new Color(190, 236, 109);
        this.fuyinLabel.color = Color.WHITE;
    }

    showFuyinPanel() {
        this.showSymbolPanel(2);
        this.yuanyinLabel.color = Color.WHITE;
        this.fuyinLabel.color = new Color(190, 236, 109);
    }

    protected initEvent(): void {
        EventMgr.addListener(EventType.Symbol_Click, this.onSymbolClick, this);
        CCUtil.onTouch(this.yuanyinLabel, this.showYuanyinPanel, this);
        CCUtil.onTouch(this.fuyinLabel, this.showFuyinPanel, this);
    }

    protected removeEvent(): void {
        EventMgr.removeListener(EventType.Symbol_Click, this);
        CCUtil.offTouch(this.yuanyinLabel, this.showYuanyinPanel, this);
        CCUtil.offTouch(this.fuyinLabel, this.showFuyinPanel, this);
    }
}


