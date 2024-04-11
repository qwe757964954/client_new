import { _decorator, Component, Node, view } from 'cc';
import { ViewsManager } from '../../manager/ViewsManager';
import { PrefabType } from '../../config/PrefabType';
import CCUtil from '../../util/CCUtil';
import EventManager from '../../util/EventManager';
import { EventType } from '../../config/EventType';
const { ccclass, property } = _decorator;

/**大冒险 学习页面 何存发 2024年4月8日19:21:23 */

@ccclass('studyView')
export class studyView extends Component {


    @property({ type: [Node], tooltip: "关卡选择" })
    public levelArr: Node[] = [];
    
    @property({ type: Node, tooltip: "关闭按钮" })
    public closeBtn: Node = null;
    start() {

    }

    update(deltaTime: number) {

    }

    onLoad(): void {
        this.initUI()
        this.initEvent()
    }
    /**初始化ui */
    private initUI() {

    }
    /**关闭页面 TODO*/
    private closeView() {
        
    }
    /**初始化监听事件 */
    initEvent() {
        for (let i = 0; i < this.levelArr.length; i++) {
            CCUtil.onTouch(this.levelArr[i], this.levelClick.bind(this, i), this);
        }
        CCUtil.onTouch(this.closeBtn, this.closeView, this)
    }
    private levelClick(i: number) {
        console.log(i)
        EventManager.emit(EventType.study_page_switching, [i]);
     
    }
    /**移除监听 */
    removeEvent() {
        for (let i = 0; i < this.levelArr.length; i++) {
            CCUtil.offTouch(this.levelArr[i], this.levelClick, this);
        }
        CCUtil.offTouch(this.closeBtn, this.closeView, this)

    }

    onDestroy() {
        this.removeEvent()
    }


}


