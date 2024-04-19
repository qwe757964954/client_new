import { _decorator, Component, Node, ProgressBar } from 'cc';
const { ccclass, property } = _decorator;
/**顶部进度条组件 何存发 2024年4月18日14:44:29 */
@ccclass('TopLabel')
export class TopLabel extends Component {
    @property({ type: ProgressBar, tooltip: "进度条" })
    public progressbar: ProgressBar = null;
    start() {

    }
    onLoad() {

    }
    init(num: number) {
        this.progressbar.progress = num / 10;
    }
    onDestroy(): void {

    }

    update(deltaTime: number) {

    }
}


