import { _decorator, Button, Label, Node } from 'cc';
import ListItem from '../../util/list/ListItem';
const { ccclass, property } = _decorator;

@ccclass('TabContentItem')
export class TabContentItem extends ListItem {
    @property(Node)
    public item_bg:Node = null;          // 课程图片
    @property(Label)
    public book_name:Label = null;          // 课程名字
    @property(Label)
    public book_num_text:Label = null;          // 课程名字
    @property(Node)
    public item_img:Node = null;          // 课程图片
    @property(Button)
    public addBtn:Button = null;          // 课程图片
    start() {

    }

    update(deltaTime: number) {
        
    }

    

}


