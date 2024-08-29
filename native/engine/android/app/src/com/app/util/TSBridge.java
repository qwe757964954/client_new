package com.app.util;

import android.annotation.SuppressLint;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.provider.Settings;
import android.util.Log;

import com.app.Config;
import com.app.SDKWrapper;
import com.cocos.game.AppActivity;
import com.cocos.lib.CocosHelper;
import com.cocos.lib.JsbBridge;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class TSBridge {
    static public int loginOpenType = 0;
    static public boolean isWxInstall = false;
    static private AppActivity _activity = null;
    static private STUtil _stUtil = null;
    static private PhoneUtil _phoneUtil = null;
    static private WxUtil _wxUtil = null;
    //其他接口初始化完成后调用
    static public void init(AppActivity activity){
        JsbBridge.setCallback(new JsbBridge.ICallback() {
            @Override
            public void onScript(String arg0, String arg1) {
                TSBridge.tsToJava(arg0,arg1);
            }
        });

        _activity = activity;
        _stUtil = (STUtil)SDKWrapper.shared().getInterface("com.app.util.STUtil");
        _phoneUtil = (PhoneUtil)SDKWrapper.shared().getInterface("com.app.util.PhoneUtil");
        _wxUtil = (WxUtil)SDKWrapper.shared().getInterface("com.app.util.WxUtil");
    }
    static public void tsToJava(String arg0, String arg1){
        _activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                try{
                    Log.e(Config.LOGTAG,"tsToJava："+arg0);
                    if(arg0.equals("onRecord")){
                        TSBridge.onRecord(arg1);
                    }else if(arg0.equals("playRecord")){
                        TSBridge.playRecord();
                    }else if(arg0.equals("stopRecord")){
                        TSBridge.stopRecord();
                    }else if(arg0.equals("cancelRecord")){
                        TSBridge.cancelRecord();
                    }else if(arg0.equals("checkAudioPermission")){
                        TSBridge.checkAudioPermission();
                    }else if(arg0.equals("initData")){
                        TSBridge.initData();
                    }else if(arg0.equals("checkPhoneLogin")){
                        TSBridge.checkPhoneLogin();
                    }else if(arg0.equals("phoneLogin")){
                        TSBridge.phoneLogin();
                    }else if(arg0.equals("isWxInstalled")){
                        TSBridge.isWxInstalled();
                    }else if(arg0.equals("setLoginOpenType")){
                        TSBridge.setLoginOpenType(arg1);
                    }else if(arg0.equals("wxLogin")){
                        TSBridge.wxLogin();
                    }else if(arg0.equals("wxLoginQrcode")){
                        TSBridge.wxLoginQrcode();
                    }
                }catch (Exception e){
                    ErrorData.upload("tsToJava:"+arg0, e.getMessage());
                }
            }
        });
    }
    static public void javaToTs(String arg0, String arg1){
        try {
            Log.e(Config.LOGTAG,"javaToTs："+arg0);
            CocosHelper.runOnGameThread(new Runnable() {
                @Override
                public void run() {
                    JsbBridge.sendToScript(arg0, arg1);
                }
            });
        }catch (Exception e){
            ErrorData.upload("javaToTs:"+arg0, e.getMessage());
        }
    }
    static void onRecord(String word){
        if(null == _stUtil) return;
        _stUtil.onRecord(word);
    }
    static void playRecord(){
        if(null == _stUtil) return;
        _stUtil.onPlayRecord();
    }
    static void stopRecord(){
        if(null == _stUtil) return;
        _stUtil.stopRecord();
    }
    static void cancelRecord(){
        if(null == _stUtil) return;
        _stUtil.cancelRecord();
    }

    static public void getRecordResult(String result){
        TSBridge.javaToTs("getRecordResult", result);
    }
    static public void checkAudioPermission(){
        if(null == _activity) return;
        _activity.checkAudioPermission();
    }
    static public void initData(){
        String str;
        try {
            Map<String, Object> map = new HashMap<>();
            map.put("channelID", Config.channelID);
            map.put("exeVer", Config.exeVer);
            map.put("exeResVer", Config.exeResVer);
            map.put("appversionName", getAppversionName());
            map.put("deviceModel", getModel());
            map.put("osVersion", getOsVersion());
            map.put("androidId", getAndroidId());

            JSONObject json = new JSONObject(map);
            str = json.toString();
        }catch (Exception e){
            str = "";
        }
        TSBridge.javaToTs("initData", str);
    }
    static public String getAppversionName() throws PackageManager.NameNotFoundException {
        if(null == _activity) return "";
        PackageManager pm = _activity.getPackageManager();
        PackageInfo pi = pm.getPackageInfo(_activity.getPackageName(), 0);
        return pi.versionName;
    }
    static public String getModel(){
        return android.os.Build.MODEL;
    }
    static public String getOsVersion(){
        return android.os.Build.VERSION.RELEASE;
    }
    @SuppressLint("HardwareIds")
    static public String getAndroidId(){
        if(null == _activity) return "";
        return Settings.Secure.getString(_activity.getContentResolver(), Settings.Secure.ANDROID_ID);
    }
    static public void wxLogin() {
        _wxUtil.login();
    }
    static public void wxLoginQrcode() throws JSONException {
        _wxUtil.getAuthQrcode();
    }
    static public void wxLoginResult(String result){
        TSBridge.javaToTs("wxLoginResult", result);
    }
    static public void wxLoginQrcodeResult(String result){
        TSBridge.javaToTs("wxLoginQrcodeResult", result);
    }
    static public void wxLoginQrcodeLoginResult(String result){
        TSBridge.javaToTs("wxLoginQrcodeLoginResult", result);
    }
//    static public void initPhoneLogin(){}
    static public void initPhoneLoginResult(String result){
        TSBridge.javaToTs("initPhoneLoginResult", result);
    }
    static public void checkPhoneLogin(){
        Log.d(Config.LOGTAG, "checkPhoneLogin");
        if(null == _phoneUtil) return;
        _phoneUtil.checkPhoneLogin();
    }
    static public void checkPhoneLoginResult(String result){
        TSBridge.javaToTs("checkPhoneLoginResult", result);
    }
    static public void phoneLogin(){
        if(null == _phoneUtil) return;
        _phoneUtil.phoneLogin();
    }
    static public void phoneLoginResult(String result){
        TSBridge.javaToTs("phoneLoginResult", result);
    }
    static public void setLoginOpenType(String typeStr){
        loginOpenType = Integer.parseInt(typeStr);
    }
    static public void isWxInstalled(){
        String ret = _wxUtil.isInstalled() ? "1":"0";
        TSBridge.javaToTs("isWxInstalled",ret);
    }
    static public void isWxInstalledResult(String status){
        isWxInstall = Integer.parseInt(status) > 0;
        TSBridge.javaToTs("isWxInstalledResult", status);
    }
}
