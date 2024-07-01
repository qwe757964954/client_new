import { _decorator, Label } from 'cc';
import { AnnouncementItem } from '../../models/AnnouncementModel';
import ListItem from '../../util/list/ListItem';
const { ccclass, property } = _decorator;

@ccclass('NoticeItem')
export class NoticeItem extends ListItem {
    @property(Label)
    public title: Label = null;
    @property(Label)
    public content: Label = null;
    start() {

    }

    updateProps(data: AnnouncementItem) {
        this.title.string = data.title;
        this.content.string = data.content;
    }
}


