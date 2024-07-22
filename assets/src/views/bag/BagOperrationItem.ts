import { _decorator, error, Label, Sprite, SpriteFrame } from 'cc';
import { ResLoader } from '../../manager/ResLoader';
import ListItem from '../../util/list/ListItem';
import { BagOperationData, BagOperationType } from './BagInfo';
const { ccclass, property } = _decorator;

@ccclass('BagOperrationItem')
export class BagOperrationItem extends ListItem {
    @property(Label)
    public op_text: Label = null;
    start() {

    }

    updateOperationProps(data: BagOperationData){
        this.op_text.string = data.title;
        let sp_str = data.btnType === BagOperationType.Orange ? "btn_orange" : "btn_ash";
        let res_str = `common/${sp_str}/spriteFrame`;
        ResLoader.instance.load(res_str, SpriteFrame, (err: Error | null, spriteFrame: SpriteFrame) => {
            if (err) {
                error && console.error(err);
            }
            this.node.getComponent(Sprite).spriteFrame = spriteFrame;
        });
    }
}

