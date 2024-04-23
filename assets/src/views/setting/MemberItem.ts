import { _decorator, Label, Node } from 'cc';
import ListItem from '../../util/list/ListItem';
const { ccclass, property } = _decorator;

export interface MemberPriceData {
    name: string,
    price: number,
    flag_name?: string,
    desc: string,
}

@ccclass('MemberItem')
export class MemberItem extends ListItem {
    @property(Node)
    public flag:Node = null;          // flag
    @property(Label) 
    public vipName:Label = null;          // vip名称
    @property(Label) 
    public flag_label:Label = null;          // flag_label
    @property(Label) 
    public vip_price:Label = null;          // vip费用
    @property(Node) 
    public des_side:Node = null;          // des_side
    @property(Label) 
    public des_text:Label = null;          // des
    @property(Node) 
    public buyBtn:Node = null;          // buyBtn

    updateItemProps(idx: number,itemInfo:MemberPriceData){
        this.vip_price.string = itemInfo.price.toString();
        this.vipName.string = itemInfo.name;
        this.des_text.string = itemInfo.desc;
        if (itemInfo.flag_name && itemInfo.flag_name.trim() !== '') {
            this.flag_label.string = itemInfo.flag_name;
            this.flag.active = true;
        } else {
            // flag_name 字段不存在或为空字符串时的处理逻辑
            this.flag.active = false;
        }
    }

}


