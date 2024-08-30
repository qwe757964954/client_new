package com.app;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.os.Bundle;
import android.util.Log;

import com.app.util.ErrorData;

import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.List;

public final class SDKWrapper {
    private SDKWrapper() {}
    private static class SDKWrapperInstance {
        private static final SDKWrapper mInstance = new SDKWrapper();
    }
    public static SDKWrapper shared() { return SDKWrapperInstance.mInstance; }

    @SuppressWarnings("unused")
    public interface SDKInterface {
        default void init(Context context) {}
        default void onStart() {}
        default void onPause() {}
        default void onResume() {}
        default void onStop() {}
        default void onDestroy() {}
        default void onRestart() {}
        default void onNewIntent(Intent intent) {}
        default void onActivityResult(int requestCode, int resultCode, Intent data) {}
        default void onConfigurationChanged(Configuration newConfig) {}
        default void onRestoreInstanceState(Bundle savedInstanceState) {}
        default void onSaveInstanceState(Bundle outState) {}
        default void onBackPressed() {}
        default void onLowMemory() {}
        default void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults){}
    }

    private WeakReference<Activity> mActivity = null;
    private List<SDKInterface> serviceInstances = new ArrayList<>();

    private void loadSDKInterface() {
        ArrayList<SDKInterface> instances = new ArrayList<>();
        try {
            String[] serviceClasses = WrapperConfig.services;
            if (serviceClasses == null) return;
            int length = serviceClasses.length;
            for (int i = 0; i < length; i++) {
                Log.d(Config.LOGTAG,"loadSDKInterface:"+serviceClasses[i]);
                instances.add((SDKInterface) Class.forName(serviceClasses[i]).newInstance());
            }
        } catch (Exception e) {
            ErrorData.upload("loadSDKInterface",e.getMessage());
        }
        this.serviceInstances = instances;
    }

    public Activity getActivity() { return this.mActivity.get(); }
    public SDKInterface getInterface(String className){
        for (SDKInterface sdk : this.serviceInstances) {
            if(sdk.getClass().getName().equals(className)){
                return sdk;
            }
        }
        return null;
    }

    public void init(Activity activity) {
        this.mActivity = new WeakReference<>(activity);
        this.loadSDKInterface();
        for (SDKInterface sdk : this.serviceInstances) {
            sdk.init(activity);
        }
    }

    public void onResume() {
        for (SDKInterface sdk : this.serviceInstances) {
            sdk.onResume();
        }
    }

    public void onPause() {
        for (SDKInterface sdk : this.serviceInstances) {
            sdk.onPause();
        }
    }

    public void onDestroy() {
        for (SDKInterface sdk : this.serviceInstances) {
            sdk.onDestroy();
        }
    }

    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        for (SDKInterface sdk : this.serviceInstances) {
            sdk.onActivityResult(requestCode, resultCode, data);
        }
    }

    public void onNewIntent(Intent intent) {
        for (SDKInterface sdk : this.serviceInstances) {
            sdk.onNewIntent(intent);
        }
    }

    public void onRestart() {
        for (SDKInterface sdk : this.serviceInstances) {
            sdk.onRestart();
        }
    }

    public void onStop() {
        for (SDKInterface sdk : this.serviceInstances) {
            sdk.onStop();
        }
    }

    public void onBackPressed() {
        for (SDKInterface sdk : this.serviceInstances) {
            sdk.onBackPressed();
        }
    }

    public void onConfigurationChanged(Configuration newConfig) {
        for (SDKInterface sdk : this.serviceInstances) {
            sdk.onConfigurationChanged(newConfig);
        }
    }

    public void onRestoreInstanceState(Bundle savedInstanceState) {
        for (SDKInterface sdk : this.serviceInstances) {
            sdk.onRestoreInstanceState(savedInstanceState);
        }
    }

    public void onSaveInstanceState(Bundle outState) {
        for (SDKInterface sdk : this.serviceInstances) {
            sdk.onSaveInstanceState(outState);
        }
    }

    public void onStart() {
        for (SDKInterface sdk : this.serviceInstances) {
            sdk.onStart();
        }
    }

    public void onLowMemory() {
        for (SDKInterface sdk : this.serviceInstances) {
            sdk.onLowMemory();
        }
    }
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults){
        for (SDKInterface sdk : this.serviceInstances) {
            sdk.onRequestPermissionsResult(requestCode, permissions, grantResults);
        }
    }
}