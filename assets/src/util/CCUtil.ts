import { NodeEventType, Input, input, EventKeyboard, KeyCode } from "cc";

export default class CCUtil {

    public static onTouch(obj:any, callback:Function, target?:any){
        let node = obj.node ? obj.node : obj;
        node.on(NodeEventType.TOUCH_END, callback, target);
    }

    public static offTouch(obj:any, callback:Function, target?:any){
        let node = obj.node ? obj.node : obj;
        node.off(NodeEventType.TOUCH_END, callback, target);
    }

    public static onKeyBack(obj:any, callback:Function, target?:any){
        obj._onKeyBack = (event:EventKeyboard)=>{
            if(event.keyCode === KeyCode.MOBILE_BACK || event.keyCode === KeyCode.BACKSPACE){
                if(callback){
                    callback(target);
                }
            }
        }
        input.on(Input.EventType.KEY_UP, obj._onKeyBack);
    }

    public static offKeyBack(obj:any){
        input.off(Input.EventType.KEY_UP, obj._onKeyBack);
    }
}