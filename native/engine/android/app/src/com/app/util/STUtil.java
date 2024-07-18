package com.app.util;

import android.content.Context;
import android.util.Log;

import com.app.Config;
import com.app.SDKWrapper;

import com.stkouyu.CoreType;
import com.stkouyu.EngineType;
import com.stkouyu.SkEgnManager;
import com.stkouyu.listener.OnInitEngineListener;
import com.stkouyu.listener.OnRecorderListener;
import com.stkouyu.setting.EngineSetting;
import com.stkouyu.setting.RecordSetting;

public class STUtil implements SDKWrapper.SDKInterface {
    private final String AppKey="170445453700024c";
    private final String SecretKey="7837ebd2b0cdf04ad8a735392d476c04";
    private final String UserID="chuangci";
    private EngineSetting _setting;
    private SkEgnManager _skMgr;

    public static STUtil s_STUtil = null;

    public void init(Context context) {
        _setting = EngineSetting.getInstance(context);
        _setting.setOnInitEngineListener(new OnInitEngineListener() {   //监听初始化状态
            @Override
            //开始初始化引擎
            public void onStartInitEngine() {
                //todo
            }
            @Override
            //初始化引擎成功
            public void onInitEngineSuccess() {
                //todo
            }
            @Override
            //初始化引擎失败
            public void onInitEngineFailed(String var1) {
                //todo
            }
        });
        _skMgr = SkEgnManager.getInstance(context);
        if(_skMgr.getCurrentEngineType()==null){  //判断返回值为null时，调用initCloudEngine、initNativeEngine、initEngine进行初始化
            _skMgr.initCloudEngine(AppKey,SecretKey,UserID,_setting);
        }
    }
    private OnRecorderListener _onRecorderListener = new OnRecorderListener() {

        public void onStart() {
            //开始录制
        }

        public void onStartRecordFail(String var1) {
            //录制失败
            Log.d(Config.LOGTAG, "onStartRecordFail："+var1);
        }

        public void onPause() {
            //暂停录音
            Log.d(Config.LOGTAG, "onPause");
        }

        public void onTick(long var1, double var3) {
            //倒计时回调,var1:剩余时间（ms）, var2:百分比
        }
        public void onRecordEnd(){
            //录制结束
            Log.d(Config.LOGTAG, "RecordEnd");
        }


        public void onRecording(int vad_status, int sound_intensity){
            //录制中
            Log.d(Config.LOGTAG, "音强===>" + sound_intensity);
        }

        public void onScore(String result){
            try {
                Log.d(Config.LOGTAG, "返回json===>" + result);
                TSBridge.getRecordResult(result);
            } catch (Exception e) {
                Log.d(Config.LOGTAG, "onScore===>" + e.getMessage());
            }
        }
    };
    //开始录音
    public void onRecord(String word){
        RecordSetting recordSetting = new RecordSetting();
        recordSetting.setCoreProvideType(EngineType.ENGINE_CLOUD);
        recordSetting.setCoreType(CoreType.EN_SENT_EVAL);
        recordSetting.setRefText(word);
        _skMgr.startRecord(recordSetting, _onRecorderListener);
//        _skMgr.startRecord(CoreType.EN_WORD_EVAL, word, QType.QTYPE_EMPTY, _onRecorderListener);
    }

    //播放录音
    public void onPlayRecord(){
        _skMgr.playback();
    }
    //停止录音
    public void stopRecord(){
        _skMgr.stopRecord();
    }
    //取消录音
    public void cancelRecord(){
        _skMgr.cancel();
    }
}
