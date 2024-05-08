import { _decorator, Component, EventTouch, Node, tween } from 'cc';
import CCUtil from '../../util/CCUtil';
const { ccclass, property } = _decorator;

@ccclass('ChangeRoleView')
export class ChangeRoleView extends Component {

    @property([Node])
    public roleList:Node[] = [];

    start() {
        for (let index = 0; index < this.roleList.length; index++) {
            const roleItem = this.roleList[index];
            CCUtil.onTouch(roleItem, this.onItemClick, this);
        }

    }
    onItemClick(event: EventTouch) {
        // console.log("onItemClick", event);
        let pos1 = this.roleList[0].getPosition();
        let pos2 = this.roleList[1].getPosition();
        let pos3 = this.roleList[2].getPosition();
    
        // 点击中间元素
        if (event.currentTarget == this.roleList[0]) {
            console.log("点击中间");
        }
        // 点击左边元素
        else if (event.currentTarget == this.roleList[1]) {
            console.log("点击左边 逆时针");
            // 逆时针交换位置
            [this.roleList[0], this.roleList[1], this.roleList[2]] = [this.roleList[1], this.roleList[2], this.roleList[0]];
        }
        // 点击右边元素
        else if (event.currentTarget == this.roleList[2]) {
            console.log("点击右边 顺时针");
            // 顺时针交换位置
            [this.roleList[0], this.roleList[1], this.roleList[2]] = [this.roleList[2], this.roleList[0], this.roleList[1]];
        }
        tween(this.roleList[0]).to(0.5,{position: pos1}).start();
        tween(this.roleList[1]).to(0.5,{position: pos2}).start();
        tween(this.roleList[2]).to(0.5,{position: pos3}).start();
    }
    
    update(deltaTime: number) {
        
    }
}


