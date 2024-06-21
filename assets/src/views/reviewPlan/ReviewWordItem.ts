import { _decorator, Component, Label } from 'cc';
import { RemoteSoundMgr } from '../../manager/RemoteSoundManager';
import CCUtil from '../../util/CCUtil';
const { ccclass, property } = _decorator;

export class ReviewWordInfo {
    w_id: string;//单词id
    word: string;//单词
    next_review_time: number;//下次复习时间
    mean: string;//释义
    meanShow: boolean = false;//是否显示释义
}

@ccclass('ReviewWordItem')
export class ReviewWordItem extends Component {
    @property(Label)
    public labelWord: Label = null;//单词
    @property(Label)
    public labelMean: Label = null;//释义
    @property(Label)
    public labelDay: Label = null;//天数

    private _data: ReviewWordInfo = null;

    start() {
        this.initEvent();
    }
    protected onDestroy(): void {
        this.removeEvent();
    }
    /**初始化事件 */
    initEvent() {
        CCUtil.onTouch(this.node, this.onClick, this);
    }
    /**移除事件 */
    removeEvent() {
        CCUtil.offTouch(this.node, this.onClick, this);
    }
    /**点击事件 */
    onClick() {
        RemoteSoundMgr.playWord(this._data.word);
        if (this._data.meanShow) return;
        this._data.meanShow = true;
        this.labelMean.string = this._data.mean ? this._data.mean : "";
        this.labelDay.node.active = false;
        this.labelMean.node.active = true;
    }
    init(data: ReviewWordInfo, today: number) {
        this._data = data;
        this.labelWord.string = data.word;
        if (data.meanShow) {
            this.labelDay.node.active = false;
            this.labelMean.node.active = true;
            this.labelMean.string = data.mean ? data.mean : "";
        } else {
            this.labelDay.node.active = true;
            this.labelMean.node.active = false;

            let dtDay = Math.floor((data.next_review_time - today) / 86400);
            if (dtDay > 0)
                this.labelDay.string = this.convertNumberToChinese(dtDay) + "天后";
            else
                this.labelDay.string = "今天";
        }
    }

    private convertNumberToChinese(num: number): string {
        const chineseNumbers = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
        const chineseUnits = ['', '十', '百', '千', '万'];
        let str = '';

        if (num === 0) {
            return chineseNumbers[0];
        }

        for (let i = 0; num > 0; i++) {
            const digit = num % 10;
            if (digit !== 0) {
                str = chineseNumbers[digit] + chineseUnits[i] + str;
            } else if (!str.startsWith(chineseNumbers[0])) {
                str = chineseNumbers[0] + str;
            }
            num = Math.floor(num / 10);
        }

        return str;
    }
}


