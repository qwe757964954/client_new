import { Game, Size, View, game, macro, profiler, screen, sys, view } from "cc";
import { APP_VERSION } from "./AppConfig";
import DebugConfig from "./DebugConfig";
import { TextConfig } from "./config/TextConfig";
import { DataMgr } from "./manager/DataMgr";
import { SpineAniManager } from "./manager/SpineAniManager";
import { ErrorUtil } from "./util/ErrorUtil";
import { ToolUtil } from "./util/ToolUtil";

declare const jsb: any;
export default class GlobalConfig {
    public static APP_VERSION: string = APP_VERSION;//游戏资源版本
    public static EXE_VERSION: number = 1;//程序版本（打包时写入底层代码中）
    public static EXE_RES_VERSION: string = "1.0";//程序资源版本（打包时写入底层代码中）
    public static CHANNEL_ID: number = 1;//渠道ID（打包时写入底层代码中）

    public static APPVERSION_NAME: string = "";
    public static DEVICE_MODEL: string = "";
    public static OS_VERSION: string = "";
    public static ANDROID_ID: string = "";

    public static TEST_SERVER: boolean = DebugConfig.TEST_SERVER;

    public static LOG_DIR_NAME: string = "Logs/";
    public static ERROR_LOG_NAME: string = "chuangcierror.log";
    public static LOG_NAME: string = "chuangci.log";
    // public static ASSETS_DIR = "game/";
    public static WIN_RATE: number = 1.0;
    public static WIN_SIZE: Size;//窗口大小（与设计分辨率一致，适配方案）
    public static SCREEN_SIZE: Size;//屏幕大小
    public static DESIGN_SIZE: Size;//设计分辨率;
    public static DESIGN_RATE: number = 1.0;
    public static WIN_DESIGN_RATE: number = 1.0;//窗口分辨率与设计分辨率比例
    public static IS_NARROW: boolean = false;//是否是窄屏
    public static MAIN_RATE_MAX: number = 1.55;//主场景最大比例（适配方案）

    public static USE_US: boolean = true; //使用美音

    private static _isInit: boolean = false;
    public static setSize() {
        this.WIN_SIZE = View.instance.getVisibleSize();
        this.SCREEN_SIZE = screen.windowSize;
        this.WIN_RATE = this.WIN_SIZE.width / this.WIN_SIZE.height;
        this.DESIGN_SIZE = View.instance.getDesignResolutionSize();
        this.DESIGN_RATE = this.DESIGN_SIZE.width / this.DESIGN_SIZE.height;
        this.WIN_DESIGN_RATE = this.WIN_RATE / this.DESIGN_RATE;
        if (this.WIN_RATE <= 1.4) {
            this.IS_NARROW = true;
        }
        console.log("GlobalConfig set size", this.WIN_SIZE, this.WIN_RATE, this.SCREEN_SIZE, this.DESIGN_SIZE, this.DESIGN_RATE, this.WIN_DESIGN_RATE);
    }
    public static init() {
        if (this._isInit) return;
        this._isInit = true;
        view.setOrientation(macro.ORIENTATION_LANDSCAPE);//横屏
        GlobalConfig.setSize();
        let tmplog = console.log;
        SpineAniManager.getInstance().preLoadSkinAniDir("resources", "Spine");
        if (DebugConfig.NO_PRINT) {
            console.log = function () { };
        }
        if (DebugConfig.WRITE_LOG) {
            console.log = function (...args) {
                tmplog(...args);
                // FileUtil.instance().log(...args);
            }
        }

        // errorMessage, scriptURI, lineNumber,columnNumber,errorObj
        // 错误信息，出错文件，出错行号，出错列号，错误详情
        if (DebugConfig.UPLOAD_ERROR) {
            window.onerror = function (event: Event | string, source?: string, lineno?: number, colno?: number, error?: Error) {
                // tmplog("error.stack：", error.stack);
                ErrorUtil.log(error.stack);
                // FileUtil.instance().errorLog(error.stack);
            }
            window.addEventListener(
                'unhandledrejection',
                (error: PromiseRejectionEvent) => {
                    ErrorUtil.log(error.reason);
                    // console.log("unhandledrejection", error.reason);
                },
                true,
            );
            if (sys.isNative) {
                jsb.onError(function (location, message, stack) {
                    ErrorUtil.log(stack);
                    // console.log("jsb.onError:", stack);
                });
            }
        }
        if (DebugConfig.SHOW_FPS) {
            profiler.showStats();
        } else {
            profiler?.hideStats();
        }

        DataMgr.instance.initData();
    }
    public static getVersionStr() {
        return ToolUtil.replace(TextConfig.Ver_Text, GlobalConfig.APP_VERSION, GlobalConfig.EXE_VERSION, GlobalConfig.EXE_RES_VERSION, GlobalConfig.CHANNEL_ID);
    }
    // 屏幕适配规则
    public static initResolutionRules() {
        /*
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
            */
    }
    public static initRessolutionHeight() {
        /*
        view.setResolutionPolicy(ResolutionPolicy.FIXED_HEIGHT);
        */
    }
}
// 游戏初始化
game.once(Game.EVENT_POST_PROJECT_INIT, () => {
    GlobalConfig.init();
});
// 监听窗口大小变化
screen.on("window-resize", () => {
    GlobalConfig.setSize();
});