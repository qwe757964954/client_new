import { native } from "cc";
import GlobalConfig from "../GlobalConfig";
// import ComUtil from "./ComUtil";

// let options:any = {flags:"a+",encoding:"utf-8"};

export default class FileUtil{
    private static s_FileUtil:FileUtil = null;
    private _writePathDir = null;
    private _logPathDir = null;
    private _errorLogPath = null;
    private _comLogPath = null;
    private _logConsole = null;

    public static instance(){
        if(!this.s_FileUtil){
            this.s_FileUtil = new FileUtil();
        }
        return this.s_FileUtil;
    }

    private constructor(){
        native.fileUtils.createDirectory(this.getLogPathDir());//创建log目录

        this._errorLogPath = this.getLogPathDir() + GlobalConfig.ERROR_LOG_NAME;
        this._comLogPath = this.getLogPathDir() + GlobalConfig.LOG_NAME;
        // let stdout = fs.createWriteStream(comLogPath, options);
        // let stderr = fs.createWriteStream(errorLogPath, options);
        // logConsole = new console.Console(stdout,stderr);
    }

    public readData(path){
        // return fs.readFileSync(path);
    }

    public appendData(path, data:string){
        // fs.appendFileSync(path, data);
    }

    public getWritePathDir(){
        if(!this._writePathDir){
            this._writePathDir = native.fileUtils.getWritablePath();
        }
        return this._writePathDir;
    }

    public getLogPathDir(){
        if(!this._logPathDir){
            this._logPathDir = this.getWritePathDir() + GlobalConfig.LOG_DIR_NAME;
        }
        return this._logPathDir;
    }

    public errorLog(...args){
        // if(!this._logConsole) return;
        // this._logConsole.error(ComUtil.nowMsTimeStr(),...args);
    }

    public log(...args){
        // if(!this._logConsole) return;
        // this._logConsole.log(ComUtil.nowMsTimeStr(),...args);
    }

    /**
     * 兼容不同平台路径分隔符，获取路径的父目录
     * @param filePath - 输入的文件路径
     * @returns 父目录路径
     */
    public static getParentDirectory(filePath: string): string {
        // 标准化路径为 Unix 风格的分隔符
        const normalizedPath = filePath.replace(/\\/g, '/');

        // 去除尾部的斜杠
        const cleanedPath = normalizedPath.endsWith('/') ? normalizedPath.slice(0, -1) : normalizedPath;

        // 提取父目录
        const lastSlashIndex = cleanedPath.lastIndexOf('/');
        if (lastSlashIndex === -1) {
            return '';
        }

        return cleanedPath.substring(0, lastSlashIndex);
    }
    /**
     * 去掉文件名后缀
     * @param filePath - The full path of the file.
     * @returns The file path without the file extension.
     */
    public static removeFileExtension(filePath: string): string {
        // Use a regular expression to match the file extension
        return filePath.replace(/\.[^/.]+$/, "");
    }

}

// export const FileMgr = FileUtil.instance();