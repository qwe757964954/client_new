import { _decorator, Component, instantiate, Node, Prefab, resources, UIOpacity } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType } from '../../config/PrefabType';
import { PopMgr } from '../../manager/PopupManager';
import EventManager from '../../util/EventManager';
import { Brocast, NoticeContentData } from './Brocast';
const { ccclass, property } = _decorator;
/**跑马灯管理器 */
@ccclass('BrocastMgr')
export class BrocastMgr extends Component {

    public static Instance: BrocastMgr = null;

    @property({ type: Prefab, tooltip: "跑马灯预制体" })
    brocastPrefab: Prefab = null;

    @property
    total_time: number = 60; //每隔5秒

    brocastScript: Brocast = null;

    usernames: Array<string> = ["Linda", 'John', 'Mary', 'Peter', 'Tom', 'Jerry', 'Mike', 'Terry', 'XiaoMing', 'Andy', 'Rose', 'Aaron']

    bStart: boolean = false; //是否开始运行跑马灯
    walk_time: number = 0; //跑马灯走了多长时间

    private _showNoticeEveId: string = ""; //显示公告事件

    rootBrocad: Node = null; //跑马灯根结点
    bCustomMode: boolean = false; //跑马灯是否是自定义模式，自定义模式下不会自动播放

    contentList: Array<string> = []; //广播内容

    onLoad() {
        if (BrocastMgr.Instance === null) {
            BrocastMgr.Instance = this;
            resources.load("prefab/notice/broadCast", (err, data: Prefab) => {
                this.brocastPrefab = data as Prefab;
            });
        }
        else {
            this.destroy();
            return;
        }

    }

    start() {
        this.stopAuto();
        this.initEvent();
    }

    initEvent() {
        this._showNoticeEveId = EventManager.on(EventType.Notice_ShowNotice, this.onShowNotice.bind(this));
    }

    removeEvent() {
        EventManager.off(EventType.Notice_ShowNotice, this._showNoticeEveId);
    }

    protected onEnable(): void {
        // this.showBrocad(this.rootBrocad, ["Welcome"]);
    }

    protected onDestroy(): void {
        this.removeEvent();
        this.stopAuto();
    }

    async onShowNotice(data: NoticeContentData) {
        let node = await PopMgr.showPopup(PrefabType.NoticeDialogView)
        this.stopAuto();
    }
    //设定是否是自定义模式
    setCustomMode(bCustom: boolean = false) {
        this.bCustomMode = bCustom;
    }

    //设置根结点,要想启动轮播必须设置根结点
    setRootBrocast(root: Node) {
        this.rootBrocad = root;
    }
    //重启自动开始
    resetAuto() {
        this.bStart = true;
        //this.bCustomMode = false;
        this.walk_time = 0;
        //this.total_time = 30; //Math.floor(Math.random() * 3 * 5) + 10; //随机等待0~3 * 5秒
    }
    //停止跑马灯
    stopAuto() {
        this.bStart = false;
        this.walk_time = 0;
        //this.total_time = 0;
    }

    //随机获取一个用户名
    getRandomUserName() {
        let lenName = this.usernames.length;
        let idx = Math.floor(Math.random() * lenName);
        if (idx < 0) idx = 0;
        if (idx > lenName - 1) idx = lenName - 1;
        return this.usernames[idx];
    }

    //随机生成一个欢迎语消息
    getRandomWelcome(): Array<string> {
        let username = this.getRandomUserName();
        let content: string = "Welcome " + username + " Enter Game!"
        //return [content];
        return ["明日有版本重大更新"]
    };

    //随机生成一个中大奖消息
    getRandomWinAward(): Array<string> {
        let username = this.getRandomUserName();
        let content: string = "Congratulation " + username + "  Hit The Jackpot!";
        //return [content];
        return ["发福利啦，点击了解详情"]
    }

    StopBroadCast() {
        this.bStart = false;
        this.bCustomMode = false;
        if (this.rootBrocad) {
            this.rootBrocad.removeAllChildren();
            this.rootBrocad = null;
        }
    }

    //更省事的随机生成一条轮播语
    genRandomContent(): Array<string> {
        let rand = Math.random();
        if (rand < 0.7) {
            return this.getRandomWelcome();
        }
        else {
            return this.getRandomWinAward();
        }
    }

    showBrocad(root: Node, contentList: Array<string>) {//content:Array<string>) {
        this.contentList = contentList;
        if (this.contentList === null || typeof (this.contentList) === "undefined") {
            return;
        }
        if (this.contentList.length === 0) {
            this.contentList = ["Welcome"];
            // return;
        }
        if (!root) {
            console.log("brocast root is null");
            return;
        }
        //root.removeAllChildren();
        let brocastNd: Node = root.getChildByName("BroadCast");

        if (!brocastNd) {
            brocastNd = instantiate(this.brocastPrefab);
            root.addChild(brocastNd);
            let uiOpacity: UIOpacity = brocastNd.getComponent(UIOpacity);
            uiOpacity.opacity = 0;
        }
        this.brocastScript = brocastNd.getComponent(Brocast);
        this.brocastScript.setContent(this.contentList);
        //root.addChild(brocastNd);

        this.brocastScript.playBroadCast();
    }

    update(dt: number) {
        if (this.bStart === false || this.rootBrocad === null || this.bCustomMode === true) {
            return;
        }

        this.walk_time += dt;
        if (this.walk_time >= this.total_time) {
            let content: Array<string> = this.genRandomContent();
            this.showBrocad(this.rootBrocad, content);

            //this.brocastScript.setContent(content);
            //this.queryBroadCastInfo(); //请求跑马灯消息
            this.resetAuto();
        }
    }

    //开始跑马灯
    startBroadCast() {
        let content: Array<string> = this.genRandomContent();
        this.showBrocad(this.rootBrocad, content);
        //this.queryBroadCastInfo(); //请求跑马灯消息

        //this.brocastScript.setContent(content);
        //this.showBrocad(this.rootBrocad);

        this.resetAuto();
    }

    //网络请示跑马灯数据
    async queryBroadCastInfo() {
        /*const res = await BroadCastApi.queryBroadCastInfo();
        if (res.code == 0) {
            console.log(res);
            if (res.data.length === 0) {
                //下面是测试
                res.data = ["Welcome!"];
                //res.data = ["I love daidai!", "Daidai is my lovely dog!", "I will play with daidai in the happy Friday Evening for one total night!"];
            }

            this.contentList = res.data;
            //this.showBrocad(this.rootBrocad, content);
            if (this.brocastScript) {
                this.brocastScript.setContent(this.contentList);
            }

        }*/
    }
}

