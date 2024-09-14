import { _decorator, Color, Component, instantiate, Label, Node, Prefab, Vec3 } from 'cc';
import { BaseView } from '../../script/BaseView';
import CCUtil from '../../util/CCUtil';
import { EventMgr } from '../../util/EventManager';
import { EventType } from '../../config/EventType';
const { ccclass, property } = _decorator;

@ccclass('PhonicsView')
export class PhonicsView extends BaseView {
    @property(Node)
    public symbolLabel: Node = null;
    @property(Node)
    public phoincsLabel: Node = null;
    @property(Node)
    public tabBg: Node = null;
    @property(Node)
    public switchNode: Node = null;
    @property(Node)
    public mainNode: Node = null;
    @property(Prefab)
    public symbolPanel: Prefab = null;
    @property(Prefab)
    public phonicsPanel: Prefab = null;
    @property(Label)
    titleLabel: Label = null;
    @property(Prefab)
    public phonicsGame: Prefab = null;

    private _showSymbol: boolean = true;

    private _currentPanel: Node;
    private _gamePanel: Node;
    protected initUI(): void {
        this._currentPanel = instantiate(this.symbolPanel);
        this.mainNode.addChild(this._currentPanel);
    }

    onSymbolLabelClick() {
        this.symbolLabel.getComponent(Label).color = Color.BLACK;
        this.phoincsLabel.getComponent(Label).color = Color.WHITE;
        let pos = this.tabBg.position;
        this.tabBg.position = new Vec3(-95, pos.y);
    }
    onPhoincsLabelClick() {
        this.symbolLabel.getComponent(Label).color = Color.WHITE;
        this.phoincsLabel.getComponent(Label).color = Color.BLACK;
        let pos = this.tabBg.position;
        this.tabBg.position = new Vec3(95, pos.y);
    }

    changePanel() {
        this._showSymbol = !this._showSymbol;
        if (this._currentPanel) {
            this._currentPanel.destroy();
        }
        if (this._showSymbol) {
            this.titleLabel.string = "音标课程";
            this.symbolLabel.getComponent(Label).color = new Color(255, 202, 70);
            this.phoincsLabel.getComponent(Label).color = Color.WHITE;
            let pos = this.tabBg.position;
            this.tabBg.position = new Vec3(-26, pos.y);
            this._currentPanel = instantiate(this.symbolPanel);
        } else {
            this.titleLabel.string = "自然拼读";
            this.symbolLabel.getComponent(Label).color = Color.WHITE;
            this.phoincsLabel.getComponent(Label).color = new Color(255, 202, 70);
            let pos = this.tabBg.position;
            this.tabBg.position = new Vec3(26, pos.y);
            this._currentPanel = instantiate(this.phonicsPanel);
        }

        this.mainNode.addChild(this._currentPanel);
    }

    onPlayGame() {
        if (this._gamePanel) return;
        if (this._currentPanel) {
            this._currentPanel.active = false;
        }
        this._gamePanel = instantiate(this.phonicsGame);
        this.mainNode.addChild(this._gamePanel);
        this.switchNode.active = false;
        this.titleLabel.string = "趣味拼词";
    }

    protected initEvent(): void {
        CCUtil.onTouch(this.switchNode, this.changePanel, this);
        EventMgr.addListener(EventType.Phonics_Game_Play_Click, this.onPlayGame, this);
    }

    protected removeEvent(): void {
        CCUtil.offTouch(this.switchNode, this.changePanel, this);
        EventMgr.removeListener(EventType.Phonics_Game_Play_Click, this);
    }

    onClose() {
        if (this._gamePanel) {
            this._gamePanel.destroy();
            this._gamePanel = null;
            this._currentPanel.active = true;
            this.switchNode.active = true;
            this.titleLabel.string = this._showSymbol ? "音标课程" : "自然拼读";
        } else {
            this.node.destroy();
        }

    }
}


