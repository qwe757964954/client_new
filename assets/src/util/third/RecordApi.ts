import { native } from "cc";
import { EventType } from "../../config/EventType";
import { EventMgr } from "../EventManager";
import { InterfaceUtil } from "../InterfaceUtil";

//录音接口类
export class RecordApi {
    /**消息方法 */
    public static onNative(arg0: string, arg1?: string) {
        if ("getRecordResult" === arg0) {
            RecordApi.getRecordResult(arg1);
            return true;
        }
        return false;
    }
    // 接受检测内置语音结果
    public static getRecordResult(data: string) {
        EventMgr.emit(EventType.Get_Record_Result, data);
    }

    /**检测录音权限 */
    public static checkRecordPermission() {
        native.bridge?.sendToNative("checkAudioPermission");
    }
    /**开始录音评测 */
    public static onRecord(word: string) {
        native.bridge?.sendToNative("onRecord", word);
    }
    /**停止录音评测 */
    public static stopRecord() {
        native.bridge?.sendToNative("stopRecord");
    }
    /**取消录音评测 */
    public static cancelRecord() {
        native.bridge?.sendToNative("cancelRecord");
    }
    /**重新播放录音 */
    public static playRecord() {
        native.bridge?.sendToNative("playRecord");
    }
}
InterfaceUtil.registerOnNative(RecordApi.onNative.bind(RecordApi));