/**class 类型定义 */

/**lert框参数 */
export class AlertParam {
    str: string;//文字
    extraStr: string;//特别提示文字（小、红色）

    constructor(str: string, extraStr: string = null) {
        this.str = str;
        this.extraStr = extraStr;
    }
}

/**ConfirmView参数 */
export class ConfirmParam {
    str: string;//文字
    extraStr: string;//特别提示文字（小、红色）
    richStr: string;//富文本（会把str、extraStr隐藏）

    constructor(str: string, extraStr: string = null, richStr: string = null) {
        this.str = str;
        this.extraStr = extraStr;
        this.richStr = richStr;
    }
}

/**TipView参数 */
export class TipParam {
    str: string;//文字
    richStr: string;//富文本（会把str隐藏）

    constructor(str: string, richStr: string = null) {
        this.str = str;
        this.richStr = richStr;
    }
}