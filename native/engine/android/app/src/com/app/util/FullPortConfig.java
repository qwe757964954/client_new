package com.app.util;

import android.app.Activity;
import android.content.Context;
import android.content.pm.ActivityInfo;
import android.graphics.Color;
import android.os.Build;
import android.text.TextUtils;
import android.util.Log;
import android.widget.Button;
import android.widget.RelativeLayout;
import android.widget.Toast;

import com.chuangci.newai.R;
import com.idsmanager.doraemonlibrary.DoraemonManager;
import com.idsmanager.doraemonlibrary.config.BaseUIConfig;
import com.mobile.auth.gatewayauth.AuthRegisterViewConfig;
import com.mobile.auth.gatewayauth.AuthUIConfig;
import com.mobile.auth.gatewayauth.AuthUIControlClickListener;
import com.mobile.auth.gatewayauth.CustomInterface;
import com.mobile.auth.gatewayauth.PhoneNumberAuthHelper;
import com.mobile.auth.gatewayauth.ResultCode;

import org.json.JSONException;
import org.json.JSONObject;

public class FullPortConfig extends BaseUIConfig {
    private final String TAG = "全屏竖屏样式";
    private boolean agreeChecked = false;

    public FullPortConfig(Activity activity) {
        super(activity);
        activity.setFinishOnTouchOutside(false);
    }


    @Override
    public void configAuthPage(PhoneNumberAuthHelper mAuthHelper) {
//        LoginActivity loginActivity = (LoginActivity)mActivity;
//        loginActivity.mAuthHelper = mAuthHelper;
        mAuthHelper.setUIClickListener(new AuthUIControlClickListener() {
            @Override
            public void onClick(String code, Context context, String jsonString) {
                JSONObject jsonObj = null;
                try {
                    if (!TextUtils.isEmpty(jsonString)) {
                        jsonObj = new JSONObject(jsonString);
                    }
                } catch (JSONException e) {
                    jsonObj = new JSONObject();
                }
                switch (code) {
                    //点击授权页默认样式的返回按钮
                    case ResultCode.CODE_ERROR_USER_CANCEL:
                        Log.e(TAG, "点击了授权页默认返回按钮");
                        DoraemonManager.quitLoginPage();
//                        mActivity.finish();
                        break;
                    //点击授权页默认样式的切换其他登录方式 会关闭授权页
                    //如果不希望关闭授权页那就setSwitchAccHidden(true)隐藏默认的  通过自定义view添加自己的
                    case ResultCode.CODE_ERROR_USER_SWITCH:
                        Log.e(TAG, "点击了授权页默认切换其他登录方式");
//                        if(agreeChecked == false){
//                            Toast.makeText(mContext, "请先勾选同意服务协议及隐私政策", Toast.LENGTH_SHORT).show();
//                        }else{
//                            if(MainActivity.loginOpenType == 1){
//                                JSBridge.bindPhoneNumber( "-2" );
//                            }else
//                            {
//                                JSBridge.bindPhoneNumber( "-1" );
//                            }
                        DoraemonManager.quitLoginPage();
//                            mActivity.finish();
//                        }
                        break;
                    //点击一键登录按钮会发出此回调
                    //当协议栏没有勾选时 点击按钮会有默认toast 如果不需要或者希望自定义内容 setLogBtnToastHidden(true)隐藏默认Toast
                    //通过此回调自己设置toast
                    case ResultCode.CODE_ERROR_USER_LOGIN_BTN:
                        if (!jsonObj.optBoolean("isChecked")) {
                            Toast.makeText(mContext, "请先勾选同意服务协议及隐私政策", Toast.LENGTH_SHORT).show();
                        }
                        break;
                    //checkbox状态改变触发此回调
                    case ResultCode.CODE_ERROR_USER_CHECKBOX:
                        Log.e(TAG, "checkbox状态变为" + jsonObj.optBoolean("isChecked"));
                        agreeChecked = jsonObj.optBoolean("isChecked");
                        break;
                    //点击协议栏触发此回调
                    case ResultCode.CODE_ERROR_USER_PROTOCOL_CONTROL:
                        Log.e(TAG, "点击协议，" + "name: " + jsonObj.optString("name") + ", url: " + jsonObj.optString("url"));
                        break;
                    default:
                        break;

                }

            }
        });
        mAuthHelper.removeAuthRegisterXmlConfig();
        mAuthHelper.removeAuthRegisterViewConfig();
        if(TSBridge.loginOpenType == 0 && TSBridge.isWxInstall){
//            View view = View.inflate(mActivity,R.layout.custom_login,null);
            Button mTitleBtn = new Button(mActivity);
//            mTitleBtn.setText("其他");
//            mTitleBtn.setTextColor(0xff000000);
            mTitleBtn.setBackgroundResource(R.drawable.wxicon);
//            mTitleBtn.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
//            mTitleBtn.setBackgroundColor(Color.TRANSPARENT);
            RelativeLayout.LayoutParams mLayoutParams = new RelativeLayout.LayoutParams(100, 100);
            mLayoutParams.addRule(RelativeLayout.CENTER_IN_PARENT, RelativeLayout.TRUE);
            mLayoutParams.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM);
            mLayoutParams.setMargins(0,0,0,120);
            mTitleBtn.setLayoutParams(mLayoutParams);
            //添加自定义切换其他登录方式`
            mAuthHelper.addAuthRegistViewConfig("wxicon", new AuthRegisterViewConfig.Builder()
                    .setView(mTitleBtn)
                    .setRootViewId(AuthRegisterViewConfig.RootViewId.ROOT_VIEW_ID_BODY)
                    .setCustomInterface(new CustomInterface() {
                        @Override
                        public void onClick(Context context) {
//                        Toast.makeText(mContext, "切换到短信登录方式1", Toast.LENGTH_SHORT).show();
                            if(agreeChecked == false){
                                Toast.makeText(mContext, "请先勾选同意服务协议及隐私政策", Toast.LENGTH_SHORT).show();
                                return;
                            }
                            DoraemonManager.quitLoginPage();
//                            mActivity.finish();
//                            JSBridge.sendPhoneNumber( "-2" ); //使用微信登录
                        }
                    }).build());
        }
        int authPageOrientation = ActivityInfo.SCREEN_ORIENTATION_BEHIND;
        if (Build.VERSION.SDK_INT == 26) {
            authPageOrientation = ActivityInfo.SCREEN_ORIENTATION_BEHIND;
        }
        String btnStr = TSBridge.loginOpenType == 0 ? "本机号码登录" : "绑定手机号登录";
        mAuthHelper.setAuthUIConfig(new AuthUIConfig.Builder()
                .setAppPrivacyOne("《隐私政策》", "https://www.chuangciyingyu.com/%E9%9A%90%E7%A7%81%E6%94%BF%E7%AD%96.htm")
                .setAppPrivacyTwo("《服务协议》", "https://www.chuangciyingyu.com/%E7%94%A8%E6%88%B7%E6%9C%8D%E5%8A%A1%E5%8D%8F%E8%AE%AE.htm")
//                .setAppPrivacyColor(Color.GRAY, Color.parseColor("#EA8400"))
                //隐藏默认切换其他登录方式
                .setSwitchAccText("其他号码登录")
                .setSwitchAccTextSizeDp(12)
//                .setSwitchAccHidden(MainActivity.loginOpenType == 0)
                .setSwitchAccTextColor(Color.WHITE)
                .setSwitchOffsetY_B(TSBridge.loginOpenType == 0 ? 80 : 55)
                //隐藏默认Toast
                .setLogBtnToastHidden(true)
                //沉浸式状态栏
                .setNavColor(Color.parseColor("#026ED2"))
                .setStatusBarColor(Color.parseColor("#026ED2"))
                .setWebViewStatusBarColor(Color.parseColor("#026ED2"))
                .setNavHidden(true)
                .setStatusBarHidden(true)

                .setLogoImgPath("chuangcixiao") //logo图片
                .setLogoWidth(70)  //logo宽
                .setLogoHeight(70) //logo高
                .setLogoOffsetY(0)  //距顶部距离

                .setSloganOffsetY(70)   //slogan距顶部距离
                .setSloganText("闯词")
                .setSloganTextColor(Color.WHITE)

                .setNumberColor(Color.WHITE)
                .setNumberSizeDp(22)
                .setNumFieldOffsetY(100)

                .setLogBtnText(btnStr)
                .setLogBtnBackgroundDrawable(mActivity.getDrawable(R.drawable.loginbtn))
                .setLogBtnWidth(200)
                .setLogBtnOffsetY(150)
                .setLogBtnTextSizeDp(20)
//                .setLogBtnTextColor(Color.parseColor("#EA8400"))

                .setLightColor(false)
                .setWebNavTextSizeDp(20)
                //图片或者xml的传参方式为不包含后缀名的全称 需要文件需要放在drawable或drawable-xxx目录下 in_activity.xml, mytel_app_launcher.png
//                .setAuthPageActIn("in_activity", "out_activity")
//                .setAuthPageActOut("in_activity", "out_activity")
                .setVendorPrivacyPrefix("《")
                .setVendorPrivacySuffix("》")
                .setAppPrivacyColor(Color.WHITE,Color.parseColor("#f0ad4a"))
                .setPrivacyOffsetY_B(10)
                .setPageBackgroundPath("loginbg")
                .setCheckedImgDrawable(mActivity.getDrawable(R.drawable.checkbox_s))
                .setUncheckedImgDrawable(mActivity.getDrawable(R.drawable.checkbox))
//                .setProtocolLayoutGravity(Gravity.CENTER_VERTICAL)
                //一键登录按钮三种状态背景示例login_btn_bg.xml
                .setLogBtnBackgroundPath("login_btn_bg")
                .setScreenOrientation(authPageOrientation)
                .create());
    }


}
