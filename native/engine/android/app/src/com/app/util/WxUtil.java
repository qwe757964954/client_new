package com.app.util;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;

import com.tencent.mm.opensdk.constants.ConstantsAPI;
import com.tencent.mm.opensdk.diffdev.DiffDevOAuthFactory;
import com.tencent.mm.opensdk.diffdev.IDiffDevOAuth;
import com.tencent.mm.opensdk.modelmsg.SendAuth;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

public class WxUtil {
    public static final String APP_ID = "wx2de93b1490944010";

    // IWXAPI 是第三方app和微信通信的openApi接口
    private IWXAPI api;
    private Context _content = null;

    public void init(Context context) {
        this._content = context;

        this.regToWx();
    }

    private void regToWx() {
        // 通过WXAPIFactory工厂，获取IWXAPI的实例
        api = WXAPIFactory.createWXAPI(this._content, APP_ID, true);
        // 将应用的appId注册到微信
        api.registerApp(APP_ID);
        //建议动态监听微信启动广播进行注册到微信
        this._content.registerReceiver(new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                // 将该app注册到微信
                api.registerApp(APP_ID);
            }
        }, new IntentFilter(ConstantsAPI.ACTION_REFRESH_WXAPP));
    }

    public void login(){
        SendAuth.Req req = new SendAuth.Req();
        req.scope = "snsapi_userinfo";
        req.state = "chuangci";
        api.sendReq(req);
    }

    public void getAuthQrcode(){
//        String url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + Constant.WECHAT_APPID + "&secret=" + Constant.WECHAT_SECRET;
//        Log.e(TAG, "url_1: " + url);
//        String res = HttpsUtils.submitGetData(url, null);
//        Log.e(TAG, "服务器返回: " + res);
//
//        //获取access_token
//        String access_token = new JSONObject(res).getString("access_token");
//        url = "https:api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + access_token + "&type=2";
//        Log.e(TAG, "url_2: " + url);
//
//        res = HttpsUtils.submitGetData(url, null);
//
//        Log.e(TAG, "服务器返回: " + res);
//        String ticket = new JSONObject(res).getString("ticket");
//
//        StringBuilder str = new StringBuilder();// 定义变长字符串
//        // 随机生成数字，并添加到字符串
//        for (int i = 0; i < 8; i++) {
//            str.append(new Random().nextInt(10));
//        }
//        noncestr = str.toString();
//        timeStamp = Long.toString(System.currentTimeMillis()).substring(0, 10);
//        String string1 = String.format("appid=%s&noncestr=%s&sdk_ticket=%s&timestamp=%s", Constant.WECHAT_APPID, noncestr, ticket, timeStamp);
//        sha = EncryptUtils.getSHA(string1);
//        Log.e(TAG, "二维码验证方式" + sha);
//        oauth.auth(Constant.WECHAT_APPID, "snsapi_userinfo", noncestr, timeStamp, sha, mOAuthListener);
//        DiffDevOAuthFactory.getDiffDevOAuth().auth(APP_ID,"snsapi_userinfo")
    }
}
