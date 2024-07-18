import { _decorator, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
import { BaseView } from '../../../script/BaseView';
import CCUtil from '../../../util/CCUtil';
import { EventMgr } from '../../../util/EventManager';
import { EventType } from '../../../config/EventType';
import { Shake } from '../../../util/Shake';
import { SoundMgr } from '../../../manager/SoundMgr';
const { ccclass, property } = _decorator;

@ccclass('ChoiceAnswerItem')
export class ChoiceAnswerItem extends BaseView {
    @property(Sprite)
    public bg: Sprite;
    @property(Label)
    public optLabel: Label;
    @property(Label)
    public answerLabel: Label;
    @property(SpriteFrame)
    public normalBg: SpriteFrame;
    @property(SpriteFrame)
    public rightBg: SpriteFrame;
    @property(SpriteFrame)
    public wrongBg: SpriteFrame;
    public answer: string;

    private _optStrs: string[] = ["A.", "B.", "C.", "D."];

    setData(idx: number, answer: string) {
        this.answer = answer;
        this.optLabel.string = this._optStrs[idx];
        this.answerLabel.string = answer;
    }

    showRight() {
        this.bg.spriteFrame = this.rightBg;
        SoundMgr.correct();
    }

    showWrong() {
        this.bg.spriteFrame = this.wrongBg;
        this.getComponent(Shake).shakeNode();
        SoundMgr.wrong();
    }

    onClick() {
        EventMgr.dispatch(EventType.Subject_ItemChoice, this);
    }

    protected initEvent(): void {
        CCUtil.onTouch(this.node, this.onClick, this);
    }

    protected removeEvent(): void {
        CCUtil.offTouch(this.node, this.onClick, this);
    }
}


