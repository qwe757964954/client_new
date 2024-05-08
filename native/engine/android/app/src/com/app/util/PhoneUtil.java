package com.app.util;

import android.app.Activity;
import android.content.Context;
import android.util.Log;

import com.app.Config;
import com.app.SDKWrapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idsmanager.doraemonlibrary.DoraemonManager;
import com.idsmanager.doraemonlibrary.callback.DoraemonCallback;
import com.idsmanager.doraemonlibrary.callback.FetchAccessTokenCallBack;
import com.idsmanager.doraemonlibrary.config.BaseUIConfig;
import com.idsmanager.doraemonlibrary.dto.AccessTokenInfo;
import com.idsmanager.doraemonlibrary.dto.AccessTokenInfoResult;
import com.idsmanager.doraemonlibrary.dto.FetchAccessTokenRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.mobile.auth.gatewayauth.PhoneNumberAuthHelper;

public class PhoneUtil implements SDKWrapper.SDKInterface {
    private final String _appID = "chuangciai2024";
    private final String _appKey = "cmJaMktUVmtQbW9vc3NBSg==";
    private final String _reqUrl = "https://szxc.chuangciyingyu.com/ope/api/getaliyunaccasstoken";
    private final String _reqUrl2 = "https://szxc.chuangciyingyu.com/ope/api/verifyaliyunjwttoken";
    private boolean _isInitSuccess = false;
    private Context _content = null;

    public void init(Context context) {
        this._content = context;
        DoraemonManager.init(context, this._appID, this._appKey, new FetchAccessTokenCallBack() {
            @Override
            public AccessTokenInfoResult fetchAccessToken(FetchAccessTokenRequest fetchAccessTokenRequest) {
                AccessTokenInfoResult callbackResult = new AccessTokenInfoResult();
                try {
                    // 示例：发送POST请求并输出响应
                    String postData = "{\"mobileExtendParamsJson\": \"" + fetchAccessTokenRequest.getMobileExtendParamsJson() + "\",\"mobileExtendParamsJsonSign\": \"" + fetchAccessTokenRequest.getMobileExtendParamsJsonSign() + "\",\"appId\":\"" + _appID + "\"}";
                    String resp = HttpClient.sendPostRequest(_reqUrl, postData);
                    Log.d(Config.LOGTAG, "resp:"+resp);
                    AccessTokenInfo accessTokenInfo = new AccessTokenInfo();
                    JsonNode jsonNode = converStrToJsonNode(resp);
                    if (jsonNode != null) {
                        JsonNode jsonData = jsonNode.get("Data");
                        if (jsonData != null) {
                            accessTokenInfo.setExpires_in(jsonData.get("Expires_in").asLong());
                            accessTokenInfo.setAccess_token(jsonData.get("Access_token").asText());
                        }
                    }
                    //TODO:  根据开发文档 同步获取AccessTokenInfo
                    callbackResult.setSuccess(true);
                    callbackResult.setMessage("获取accessToken成功。");
                    callbackResult.setAccessTokenInfo(accessTokenInfo);
                    Log.d(Config.LOGTAG, "获取accessToken成功。");
                } catch (Exception e) {
                    Log.d(Config.LOGTAG, "getAccessTokenRun exception", e);
                    callbackResult.setSuccess(false);
                    callbackResult.setMessage(e.getMessage());
                }
                return callbackResult;
            }
        }, new DoraemonCallback() {
            @Override
            public void onFailure(Exception e) {
                Log.d(Config.LOGTAG, "DoraemonManager init faild", e);
                TSBridge.initPhoneLoginResult("0");
            }

            @Override
            public void onSuccess(Object data) {
                Log.d(Config.LOGTAG, "DoraemonManager init success");
                _isInitSuccess = true;
//                DoraemonManager.isInitSuccess = true;
                TSBridge.initPhoneLoginResult("1");
            }
        });
    }

    public JsonNode converStrToJsonNode(String data) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readTree(data);
        } catch (Exception e) {
            ErrorData.upload("converStrToJsonNode",e.getMessage());
            return null;
        }
    }


    public void checkPhoneLogin(){
        if(!_isInitSuccess){
            TSBridge.checkPhoneLoginResult("-1");
            return;
        }
        DoraemonManager.checkEnvAvailable(PhoneNumberAuthHelper.SERVICE_TYPE_LOGIN, new DoraemonCallback() {
            @Override
            public void onFailure(Exception e) {
                Log.d(Config.LOGTAG, "checkPhoneLogin faild", e);
                TSBridge.checkPhoneLoginResult("0");
            }

            @Override
            public void onSuccess(Object data) {
                Log.d(Config.LOGTAG, "checkPhoneLogin success！" + data);
                TSBridge.checkPhoneLoginResult("1");
            }
        });
    }
    public void phoneLogin(){
        if(!_isInitSuccess){
            TSBridge.phoneLoginResult("-1");
            return;
        }
        Activity activity = (Activity)this._content;
        BaseUIConfig baseUIConfig = new FullPortConfig(activity);
        DoraemonManager.phoneNumberLogin(activity, new DoraemonCallback() {
            @Override
            public void onFailure(Exception e) {
                Log.d(Config.LOGTAG, "phoneLogin faild", e);
                TSBridge.phoneLoginResult("0");
                DoraemonManager.quitLoginPage();
            }

            @Override
            public void onSuccess(Object data) {
                Log.d(Config.LOGTAG, "phoneLogin success！" + data);
                String postData = "{\"jwtToken\": \"" + data + "\",\"appId\":\"" + _appID + "\"}";
                String resp = HttpClient.sendPostRequest(_reqUrl2, postData);
                Log.d(Config.LOGTAG, resp);
                JsonNode respData = converStrToJsonNode(resp);
                if (respData.get("Code").asInt() == 200) {
                    Log.d(Config.LOGTAG, respData.get("Data").asText());
                    TSBridge.phoneLoginResult(respData.get("Data").asText());
                }
                DoraemonManager.quitLoginPage();
            }
        }, baseUIConfig);
    }
}
