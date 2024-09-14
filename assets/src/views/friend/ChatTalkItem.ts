import { _decorator, Label } from 'cc';
import ListItem from '../../util/list/ListItem';
import { ShortcutInfo } from './FriendInfo';
const { ccclass, property } = _decorator;

@ccclass('ChatTalkItem')
export class ChatTalkItem extends ListItem {
    @property(Label)
    public enText: Label = null;
    
    @property(Label)
    public cnText: Label = null;

    async initData(info: ShortcutInfo) {
        this.enText.string = info.enText;
        this.cnText.string = info.cnText;
    }
}


