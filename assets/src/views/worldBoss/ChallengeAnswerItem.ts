import { Label, Node, Sprite, SpriteFrame, _decorator } from 'cc';
import { ResLoader } from '../../manager/ResLoader';
import ListItem from '../../util/list/ListItem';
import { BossGameWord } from './BossInfo';
const { ccclass, property } = _decorator;

export enum AnswerType{
    Normal=0, //常规
    Correct=1, //正确
    Error=2,  //错误
}

@ccclass('ChallengeAnswerItem')
export class ChallengeAnswerItem extends ListItem {
    @property(Label)
    public word_label: Label = null;

    @property(Node)
    public res_symbol: Node = null;

    @property(Node)
    public bg_img: Node = null;
    private _bgSpriteMap: Map<AnswerType,string> = new Map([
        [AnswerType.Normal,"adventure/sixModes/study/list_bg_0/spriteFrame"],
        [AnswerType.Correct,"adventure/sixModes/study/list_bg_1/spriteFrame"],
        [AnswerType.Error,"adventure/sixModes/study/list_bg_2/spriteFrame"],
    ])

    private _rightSymbolMap: Map<AnswerType,string> = new Map([
        [AnswerType.Normal,"adventure/sixModes/study/answer/spriteFrame"],
        [AnswerType.Correct,"adventure/sixModes/study/answer/spriteFrame"],
        [AnswerType.Error,"adventure/sixModes/study/wrong/spriteFrame"],
    ])

    start() {

    }
    updatePropsItem(wordInfo:BossGameWord,idx:number) {
        this.word_label.string = wordInfo.Cn;
        this.changeItemStatus(AnswerType.Normal);
    }

    changeItemStatus(status:AnswerType) {
        this.updateBgSprite(this._bgSpriteMap.get(status));
        this.updateSymbolSprite(this._rightSymbolMap.get(status));
        this.res_symbol.active = status != AnswerType.Normal;
    }   

    updateSymbolSprite(spritePath:string) {
        ResLoader.instance.load(spritePath, SpriteFrame, async (err: Error | null, spriteFrame: SpriteFrame) => {
            if (err) {
                console.error(err);
            } else {
                this.res_symbol.getComponent(Sprite).spriteFrame = spriteFrame;
            }
        });
    }

    updateBgSprite(spritePath:string) {
        ResLoader.instance.load(spritePath, SpriteFrame, async (err: Error | null, spriteFrame: SpriteFrame) => {
            if (err) {
                console.error(err);
            } else {
                this.bg_img.getComponent(Sprite).spriteFrame = spriteFrame;
            }
        });
    }

}


