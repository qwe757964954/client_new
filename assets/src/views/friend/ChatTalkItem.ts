import { _decorator, Label } from 'cc';
import ListItem from '../../util/list/ListItem';
import { TalkInfo } from './FriendInfo';
const { ccclass, property } = _decorator;

@ccclass('ChatTalkItem')
export class ChatTalkItem extends ListItem {
    @property(Label)
    public enText: Label = null;
    
    @property(Label)
    public cnText: Label = null;

    async initData(info: TalkInfo) {
        this.enText.string = info.en;
        this.cnText.string = info.cn;
    }
}


