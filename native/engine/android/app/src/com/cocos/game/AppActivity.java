/****************************************************************************
Copyright (c) 2015-2016 Chukong Technologies Inc.
Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
****************************************************************************/
package com.cocos.game;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.content.Intent;
import android.content.res.Configuration;
import android.text.Html;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.TextView;
import android.widget.Toast;

//import com.cocos.service.SDKWrapper;
import androidx.core.app.ActivityCompat;
import androidx.core.text.HtmlCompat;

import com.app.Config;
import com.app .SDKWrapper;
import com.app.util.TSBridge;
import com.cocos.lib.CocosActivity;

public class AppActivity extends CocosActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        checkPrivacy();
        // DO OTHER INITIALIZATION BELOW
//        SDKWrapper.shared().init(this);
    }

    @Override
    protected void onResume() {
        super.onResume();
        SDKWrapper.shared().onResume();
    }

    @Override
    protected void onPause() {
        super.onPause();
        SDKWrapper.shared().onPause();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        // Workaround in https://stackoverflow.com/questions/16283079/re-launch-of-activity-on-home-button-but-only-the-first-time/16447508
        if (!isTaskRoot()) {
            return;
        }
        SDKWrapper.shared().onDestroy();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        SDKWrapper.shared().onActivityResult(requestCode, resultCode, data);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        SDKWrapper.shared().onNewIntent(intent);
    }

    @Override
    protected void onRestart() {
        super.onRestart();
        SDKWrapper.shared().onRestart();
    }

    @Override
    protected void onStop() {
        super.onStop();
        SDKWrapper.shared().onStop();
    }

    @Override
    public void onBackPressed() {
        SDKWrapper.shared().onBackPressed();
        super.onBackPressed();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        SDKWrapper.shared().onConfigurationChanged(newConfig);
        super.onConfigurationChanged(newConfig);
    }

    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState) {
        SDKWrapper.shared().onRestoreInstanceState(savedInstanceState);
        super.onRestoreInstanceState(savedInstanceState);
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        SDKWrapper.shared().onSaveInstanceState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    protected void onStart() {
        SDKWrapper.shared().onStart();
        super.onStart();
    }

    @Override
    public void onLowMemory() {
        SDKWrapper.shared().onLowMemory();
        super.onLowMemory();
    }
    //检测隐私
    private void checkPrivacy(){
        showPrivacyDialog();
    }
    //检测隐私完成
    private void checkPrivacyOver() {
        checkNeedPermission();
    }
    //检测权限
    private void checkNeedPermission(){
        checkNeedPermissionOver();
    }
    //检测权限完成
    private void checkNeedPermissionOver(){
        //初始化
        SDKWrapper.shared().init(this);
        TSBridge.init(this);
    }
    //隐私弹框
    private void showPrivacyDialog() {
        SharedPreferences sp = getSharedPreferences("PREFER_NAME", Activity.MODE_PRIVATE);
        boolean privacyConfirm = sp.getBoolean("privacy_key", false);
        if(privacyConfirm){
            checkPrivacyOver();
            return;
        }

        String htmlStr = "我们非常重视对您个人信息的保护，承诺严格按照海浪教育<font color='#3B5FF5'>《隐私政策》</font>保护及处理您的信息，是否确定同意？";
        TextView textView = new TextView(this);
        textView.setPadding(100, 25, 100, 25);
        textView.setText(HtmlCompat.fromHtml(htmlStr,HtmlCompat.FROM_HTML_MODE_LEGACY));
        textView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(Intent.ACTION_VIEW);
                intent.setData(Uri.parse(Config.privacyUrl));
                startActivity(intent);
            }
        });
        AlertDialog dialog = new AlertDialog.Builder(this)
                .setTitle("温馨提示")
                .setView(textView)
                .setPositiveButton("同意", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        sp.edit().putBoolean("privacy_key", true).apply();
                        dialog.dismiss();
                        checkPrivacyOver();
                    }
                })
                .setNegativeButton("不同意", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        sp.edit().putBoolean("privacy_key", false).apply();
                        finish();
                        System.exit(0);
                    }
                })
                .create();
        Window dialogWindow = dialog.getWindow();
        if (dialogWindow != null) {
            WindowManager.LayoutParams layoutParams = dialogWindow.getAttributes();
            layoutParams.width = WindowManager.LayoutParams.MATCH_PARENT;
            layoutParams.height = WindowManager.LayoutParams.WRAP_CONTENT;
            dialogWindow.setAttributes(layoutParams);
        }
        dialog.setCanceledOnTouchOutside(false);
        dialog.show();
    }
    private int _checkAudioPermissionCode = 1;
    private String[] _perms = {
            Manifest.permission.RECORD_AUDIO,
//            Manifest.permission.WRITE_EXTERNAL_STORAGE,
//            Manifest.permission.READ_PHONE_STATE
    };
    //检测录音权限
    public void checkAudioPermission(){
        int permission = ActivityCompat.checkSelfPermission(this,
                Manifest.permission.RECORD_AUDIO);
        if (ActivityCompat.shouldShowRequestPermissionRationale(this, Manifest.permission.RECORD_AUDIO)) {
            // 用户拒绝过权限请求，可以向用户解释权限的必要性
            Toast.makeText(this, "拒绝录音权限将导致语音评测功能不可用，您后续可以在应用设置中打开", Toast.LENGTH_SHORT).show();
            return;
        }

        if (permission != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, _perms, _checkAudioPermissionCode);
        }
    }
    //权限申请结果
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        SDKWrapper.shared().onRequestPermissionsResult(requestCode, permissions, grantResults);
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if(requestCode == _checkAudioPermissionCode){
            boolean hasRefuse = false;
            for (int i = 0; i < grantResults.length; i++) {
                if (grantResults[i] != PackageManager.PERMISSION_GRANTED) {
                    // 权限被拒绝
                    hasRefuse = true;
                }
            }
            if(hasRefuse){
                Toast.makeText(this, "拒绝权限可能会导致某些功能不可用，您仍然可以在应用设置中打开", Toast.LENGTH_SHORT).show();
            }
        }
    }
}
