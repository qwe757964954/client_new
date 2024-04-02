import { Game, Size, Vec2, View, director, game, profiler, screen } from "cc";
import DebugConfig from "./DebugConfig";
import FileUtil from "./util/FileUtil";
import { InterfaceUtil } from "./util/InterfaceUtil";
import { APP_VERSION } from "./AppConfig";


export default class GlobalConfig {
    public static APP_VERSION:string = APP_VERSION;//游戏资源版本
    public static EXE_VERSION = InterfaceUtil.getExeVer();//程序版本（打包时写入底层代码中）
    public static EXE_RES_VERSION = InterfaceUtil.getExeResVer();//程序资源版本（打包时写入底层代码中）
    public static CHANNEL_ID:number = InterfaceUtil.getChannelId();//渠道ID（打包时写入底层代码中）

    public static TEST_SERVER:boolean = DebugConfig.TEST_SERVER;

    public static LOG_DIR_NAME:string = "Logs/";
    public static ERROR_LOG_NAME:string = "chuangcierror.log";
    public static LOG_NAME:string = "chuangci.log";
    // public static ASSETS_DIR = "game/";
    public static WIN_RATE:number = 1.0;
    public static WIN_SIZE:Size;

    private static _isInit:boolean = false;
    public static init(){
        if(this._isInit) return;
        this._isInit = true;
        this.WIN_SIZE = View.instance.getVisibleSize();
        this.WIN_RATE = this.WIN_SIZE.width / this.WIN_SIZE.height;
        let tmplog = console.log;

        if(DebugConfig.NO_PRINT){
            console.log = function(){};
        }
        if(DebugConfig.WRITE_LOG){
            console.log = function(...args){
                tmplog(...args);
                FileUtil.instance().log(...args);
            }
        }
        
        // errorMessage, scriptURI, lineNumber,columnNumber,errorObj
        // 错误信息，出错文件，出错行号，出错列号，错误详情
        if(DebugConfig.ERROR_LOG){
            window.onerror = function(...args){
                FileUtil.instance().errorLog(...args);
            }
        }
        if(DebugConfig.SHOW_FPS){
            profiler.showStats();
        }else{
            profiler?.hideStats();
        }
        director
    }
}

game.once(Game.EVENT_GAME_INITED, () => {
    GlobalConfig.init();
});
