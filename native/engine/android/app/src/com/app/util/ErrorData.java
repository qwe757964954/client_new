package com.app.util;

import com.app.Config;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class ErrorData {
    public int account;
    public String plat;
    public String msg;
    public String stack;

    public ErrorData(String msg, String stack) {
        this.account = 0;
        this.msg = msg;
        this.stack = stack;
        this.plat = "crash_java4.0";
    }

    public String getJson() {
        try {
            Map<String, Object> map = new HashMap<>();
            map.put("account", this.account);
            map.put("msg", this.msg);
            map.put("stack", this.stack);
            map.put("plat", this.plat);
            map.put("channel", Config.channelID);
            map.put("exeVer", Config.exeVer);
            map.put("exeResVer", Config.exeResVer);

            JSONObject json = new JSONObject(map);
            return json.toString();
        }catch (Exception e){
            return "";
        }
    }

    public void upload(){
        try{
//            HttpClient.sendPostRequest("https://szxc.chuangciyingyu.com/act_record/",this.getJson());
        }catch (Exception e){

        }
    }
    public static void upload(String msg, String stack){
        new ErrorData(msg, stack).upload();
    }
}
