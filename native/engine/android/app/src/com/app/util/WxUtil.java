package com.app.util;

import static com.cocos.lib.GlobalObject.runOnUiThread;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.util.Base64;
import android.util.Log;

import com.app.Config;
import com.app.SDKWrapper;
import com.tencent.mm.opensdk.constants.ConstantsAPI;
import com.tencent.mm.opensdk.diffdev.DiffDevOAuthFactory;
import com.tencent.mm.opensdk.diffdev.OAuthErrCode;
import com.tencent.mm.opensdk.diffdev.OAuthListener;
import com.tencent.mm.opensdk.modelmsg.SendAuth;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

import org.json.JSONException;
import org.json.JSONObject;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Random;

public class WxUtil implements SDKWrapper.SDKInterface{
    public static final String APP_ID = "wx2de93b1490944010";
    public static final String APP_SECRET = "d635c3b72627fd4d6732020cb0f408a4";

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

    public boolean isInstalled(){
        return api.isWXAppInstalled();
    }

    public void login(){
        SendAuth.Req req = new SendAuth.Req();
        req.scope = "snsapi_userinfo";
        req.state = "newchuangcilogin";
        api.sendReq(req);
    }

    private static class EncryptUtils {

        public static String getSHA(String info) {
            byte[] digesta = null;
            try {
                // 得到一个SHA-1的消息摘要
                MessageDigest alga = MessageDigest.getInstance("SHA-1");
                // 添加要进行计算摘要的信息
                alga.update(info.getBytes());
                // 得到该摘要
                digesta = alga.digest();
            } catch (NoSuchAlgorithmException e) {
                e.printStackTrace();
            }
            // 将摘要转为字符串
            String rs = byte2hex(digesta);
            return rs;
        }

        private static String byte2hex(byte[] b) {
            String hs = "";
            String stmp = "";
            for (byte aB : b) {
                stmp = (Integer.toHexString(aB & 0XFF));
                if (stmp.length() == 1) {
                    hs = hs + "0" + stmp;
                } else {
                    hs = hs + stmp;
                }
            }
            return hs;
        }
    }

    OAuthListener mOAuthListener = new OAuthListener() {
        @Override
        public void onAuthGotQrcode(String s, byte[] bytes) {
            String ret = new String(bytes, StandardCharsets.ISO_8859_1);
//            String ret = Base64.encodeToString(bytes, Base64.DEFAULT);//convert base64
            TSBridge.wxLoginQrcodeResult(ret);
        }

        @Override
        public void onQrcodeScanned() {

        }

        @Override
        public void onAuthFinish(OAuthErrCode oAuthErrCode, String s) {
            TSBridge.wxLoginQrcodeLoginResult(s);
        }
    };
    public void getAuthQrcode() {
        new Thread(new Runnable() {
            @Override
            public void run() {

                String url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + APP_ID + "&secret=" + APP_SECRET;
                String res = HttpClient.sendGeRequest(url);
                //获取access_token
                String access_token = null;
                try {
                    access_token = new JSONObject(res).getString("access_token");
                } catch (JSONException e) {
                    throw new RuntimeException(e);
                }
                url = "https:api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + access_token + "&type=2";

                res = HttpClient.sendGeRequest(url);
                String ticket = null;
                try {
                    ticket = new JSONObject(res).getString("ticket");
                } catch (JSONException e) {
                    throw new RuntimeException(e);
                }

                StringBuilder str = new StringBuilder();// 定义变长字符串
                // 随机生成数字，并添加到字符串
                for (int i = 0; i < 8; i++) {
                    str.append(new Random().nextInt(10));
                }
                String noncestr = str.toString();
                String timeStamp = Long.toString(System.currentTimeMillis()).substring(0, 10);
                String string1 = String.format("appid=%s&noncestr=%s&sdk_ticket=%s&timestamp=%s", APP_ID, noncestr, ticket, timeStamp);
                String sha = EncryptUtils.getSHA(string1);

                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        DiffDevOAuthFactory.getDiffDevOAuth().auth(APP_ID, "snsapi_userinfo", noncestr, timeStamp, sha, mOAuthListener);
                    }
                });
            }
        }).start();
    }
}
