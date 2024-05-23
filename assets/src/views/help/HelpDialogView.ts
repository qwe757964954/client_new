import { _decorator, Component, instantiate, Label, Node, Prefab, ScrollView, Sprite } from 'cc';
import { TextConfig } from '../../config/TextConfig';
import { LoadManager } from '../../manager/LoadManager';
import CCUtil from '../../util/CCUtil';
import { EffectUtil } from '../../util/EffectUtil';
const { ccclass, property } = _decorator;
/**帮助窗口
 * 配置文件在config/gameHelp.json
 * 调用示例
 * ViewsManager.instance.showView(PrefabType.HelpDialogView, (node: Node) => {
            let strHelp: string = DataMgr.instance.helpConfig["邀请规则说明"];
            node.getComponent(HelpDialogView).initData(strHelp);
        });
 */
@ccclass('HelpDialogView')
export class HelpDialogView extends Component {
    @property({ type: Node, tooltip: "关闭按钮" })
    public btn_close: Node = null;

    @property({ type: Node, tooltip: "内容" })
    public contentNd: Node = null;

    @property({ type: ScrollView, tooltip: "内容滚动列表" })
    public contentList: ScrollView = null;

    @property({ type: Prefab, tooltip: "文本预制体" })
    public preTxtContent: Prefab = null;

    @property({ type: Prefab, tooltip: "图片预制体" })
    public preImgContent: Prefab = null;

    str: string = "";

    private _canClose: boolean = false;

    async initData(str: string) {
        this.str = str;
        await this.initView();
        this.addEvent();
        this.show();
    }

    private show() {
        EffectUtil.centerPopup(this.contentNd);
        setTimeout(() => {
            this._canClose = true;
        })
    }

    async initView() {
        this.contentList.content.removeAllChildren();
        if (this.str.indexOf(TextConfig.Help_ImageDisplay) != -1) { //如果有图示,表示有图片,否则只是文字解说，图片和文字只有一种
            let url: string = this.str.split(":")[1]; //获取图片地址合集，如 魔法书_01-魔法书_02,这里有两张图片，名字地址以-分割
            let urls: string[] = url.split("-"); //获取地址数组
            for (let i = 0; i < urls.length; i++) {
                let imgNd = instantiate(this.preImgContent);
                let urlPath: string = "helpImg/" + urls[i] + "/spriteFrame";
                await LoadManager.loadSprite(urlPath, imgNd.getComponent(Sprite));
                this.contentList.content.addChild(imgNd);
            }
        }
        else {
            let txtNd = instantiate(this.preTxtContent);
            txtNd.getComponent(Label).string = this.str;
            this.contentList.content.addChild(txtNd);
        }
    }

    addEvent() {
        CCUtil.onTouch(this.btn_close, this.closeView, this);
    }

    removeEvent() {
        CCUtil.offTouch(this.btn_close, this.closeView, this);
    }

    protected onDestroy(): void {
        this.removeEvent();
    }

    private closeView() {
        if (!this._canClose) return;
        this._canClose = false;
        EffectUtil.centerClose(this.contentNd, () => {
            //if (this._callBack) this._callBack();
            this.dispose();
        });
    }

    //销毁
    dispose() {
        //this.removeEvent();
        this.node.destroy();
    }

    start() {

    }

    update(deltaTime: number) {

    }
}


