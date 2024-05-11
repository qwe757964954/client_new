import { Game, ResolutionPolicy, Size, View, game, macro, profiler, screen, view } from "cc";
import { APP_VERSION } from "./AppConfig";
import DebugConfig from "./DebugConfig";
import { DataMgr } from "./manager/DataMgr";
import { SpineAniManager } from "./manager/SpineAniManager";
import FileUtil from "./util/FileUtil";


export default class GlobalConfig {
    public static APP_VERSION: string = APP_VERSION;//游戏资源版本
    public static EXE_VERSION: number = 1;//程序版本（打包时写入底层代码中）
    public static EXE_RES_VERSION: string = "1.0";//程序资源版本（打包时写入底层代码中）
    public static CHANNEL_ID: number = 1;//渠道ID（打包时写入底层代码中）

    public static TEST_SERVER: boolean = DebugConfig.TEST_SERVER;
    public static OLD_SERVER: boolean = DebugConfig.OLD_SERVER;

    public static LOG_DIR_NAME: string = "Logs/";
    public static ERROR_LOG_NAME: string = "chuangcierror.log";
    public static LOG_NAME: string = "chuangci.log";
    // public static ASSETS_DIR = "game/";
    public static WIN_RATE: number = 1.0;
    public static WIN_SIZE: Size;//窗口大小（与设计分辨率一致，适配方案）
    public static SCREEN_SIZE: Size;//屏幕大小

    private static _isInit: boolean = false;
    public static init() {
        if (this._isInit) return;
        this._isInit = true;
        view.setOrientation(macro.ORIENTATION_LANDSCAPE);//横屏
        this.WIN_SIZE = View.instance.getVisibleSize();
        this.SCREEN_SIZE = screen.windowSize;
        this.WIN_RATE = this.WIN_SIZE.width / this.WIN_SIZE.height;
        console.log("GlobalConfig init", this.WIN_SIZE, this.WIN_RATE, this.SCREEN_SIZE);
        let tmplog = console.log;
        SpineAniManager.getInstance().preLoadSkinAniDir("resources", "Spine");
        if (DebugConfig.NO_PRINT) {
            console.log = function () { };
        }
        if (DebugConfig.WRITE_LOG) {
            console.log = function (...args) {
                tmplog(...args);
                FileUtil.instance().log(...args);
            }
        }

        // errorMessage, scriptURI, lineNumber,columnNumber,errorObj
        // 错误信息，出错文件，出错行号，出错列号，错误详情
        if (DebugConfig.ERROR_LOG) {
            window.onerror = function (...args) {
                FileUtil.instance().errorLog(...args);
            }
        }
        if (DebugConfig.SHOW_FPS) {
            profiler.showStats();
        } else {
            profiler?.hideStats();
        }

        DataMgr.instance.initData();
    }
    // 屏幕适配规则
    public static initResolutionRules() {
        var _desWidth = view.getDesignResolutionSize().width;
        var _desHeight = view.getDesignResolutionSize().height;

        var _realWidth = view.getVisibleSize().width;
        var _realHeight = view.getVisibleSize().height;

        var _ratioDes = _desWidth / _desHeight;
        var _ratioReal = _realWidth / _realHeight;

        if (_ratioReal >= _ratioDes) {
            view.setResolutionPolicy(ResolutionPolicy.FIXED_HEIGHT);
        } else {
            view.setResolutionPolicy(ResolutionPolicy.FIXED_WIDTH);
        }
    }
    public static initRessolutionHeight(){
        view.setResolutionPolicy(ResolutionPolicy.FIXED_HEIGHT);
    }
}
// 游戏初始化
game.once(Game.EVENT_POST_PROJECT_INIT, () => {
    GlobalConfig.init();
});
// 监听窗口大小变化
screen.on("window-resize", () => {
    GlobalConfig.WIN_SIZE = View.instance.getVisibleSize();
    GlobalConfig.SCREEN_SIZE = screen.windowSize;
    GlobalConfig.WIN_RATE = GlobalConfig.WIN_SIZE.width / GlobalConfig.WIN_SIZE.height;

    console.log("GlobalConfig resize", GlobalConfig.WIN_SIZE, GlobalConfig.WIN_RATE, GlobalConfig.SCREEN_SIZE);
})
