import { _decorator, Color, Component, Label, Node } from 'cc';
import NetConfig from '../../config/NetConfig';
const { ccclass, property } = _decorator;

@ccclass('ServerItem')
export class ServerItem extends Component {
    @property(Label)
    serverName: Label = null;

    serverUrl: string = '';
    isSelect: boolean = false;
    start() {

    }

    update(deltaTime: number) {

    }

    setData(serverName: string, serverUrl: string) {
        this.serverName.string = serverName;
        this.serverUrl = serverUrl;
    }

    public set selected(val: boolean) {
        this.isSelect = val;
        this.serverName.color = val ? Color.GREEN : Color.BLACK;
        if (this.isSelect) {
            NetConfig.setCurrentUrl(this.serverUrl);
        }
    }

    public get selected() {
        return this.isSelect;
    }
}


