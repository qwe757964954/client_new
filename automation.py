#coding=utf-8

import hashlib
import platform
import os
import shutil
import sys
import json
import zipfile

creatorPath = os.environ.get("CREATOR_PATH")
project_path = sys.path[0]
# assets_path = os.path.join(project_path, "assets")
native_config_path = os.path.join(project_path, "config", "buildConfig_android.json")
local_manifest_path = os.path.join(project_path, "assets/res", "project.manifest")
local_manifestUUID_path = local_manifest_path + ".meta"
js_export_dir = os.path.join(project_path, "build/android/data")
ts_version_path = os.path.join(project_path, "assets/src", "AppConfig.ts")
java_config_path = os.path.join(project_path, "native/engine/android/app/src/com/app", "Config.java")
publish_base_dir = os.path.join(project_path, "updateDatas")
#---------------------------------------------------
#-- 				通用方法

#创建路径下的文件夹
def createDir(paht):
    if len(os.path.split(paht)) > 1:
        if not os.path.isdir(os.path.split(paht)[0]):
            os.makedirs(os.path.split(paht)[0])
    elif not os.path.isdir(paht):
        os.makedirs(paht)


#获得目录下所有文件列表
def getFileList(dir,fileList):
    if os.path.isfile(dir):
        fileList.append(dir)
    elif os.path.isdir(dir):  
        for s in os.listdir(dir):
            newDir=os.path.join(dir,s)
            getFileList(newDir, fileList)  
    return fileList

#保存Json
def saveJson(filePath,data):
    createDir(filePath)
    json_file = open(filePath,"wb")
    # text = json.dumps(data,indent=4).encode("utf-8") #格式化json
    text = json.dumps(data).encode("utf-8") #json压成一行
    json_file.write(text)
    json_file.close()

#读取Json
def loadJson(filePath):
    if os.path.exists(filePath) :
        json_file = open(filePath)
        data = json.load(json_file)
        json_file.close()
        return data
    else:
        return False

#获取MD5
def getMD5(file_path):
    md5 = None
    size = 0
    if os.path.isfile(file_path):
        f = open(file_path,'rb')
        md5_obj = hashlib.md5()
        byteAry = f.read()
        md5_obj.update(byteAry)
        hash_code = md5_obj.hexdigest()
        f.close()
        md5 = str(hash_code).lower()
    return md5

#文件夹对比
def fc(new_dir,old_dir):
    c_list = []
    fileList = getFileList(new_dir,[])
    for n_file in fileList:
        o_file = old_dir + n_file.split(new_dir)[1]
        if not os.path.isfile(o_file) or getMD5(n_file) != getMD5(o_file) :
            c_list.append(n_file)
    return c_list #差异的文件

    
#复制文件到指定目录
def copyFileTo(fileList,rDir,tDir):
    for r_file in fileList:
        if r_file.find("DS_Store") != -1 :
            continue
        t_file = tDir + r_file.split(rDir)[1]
        createDir(t_file)
        shutil.copyfile(r_file,t_file)
        
#替换文件一行内容
def replaceLineContent(filePath, src, dst):
    fp = open(filePath, 'r', encoding='utf-8')
    lines = fp.readlines()
    fp.close()
        
    for i,line in enumerate(lines):
        if line.find(src) >= 0:
            lines[i] = dst
            break

    fp = open(filePath, 'w+', encoding='utf-8')
    fp.writelines(lines)
    fp.close()

#复制文件夹
def copy_folder(src, dst):
    if not os.path.exists(dst):
        os.makedirs(dst)
    for item in os.listdir(src):
        s = os.path.join(src, item)
        d = os.path.join(dst, item)
        if os.path.isdir(s):
            copy_folder(s, d)
        else:
            shutil.copy2(s, d)

#压缩文件
def compress_directory(directory_path, output_path):
    print("Compressing %s to %s" % (directory_path, output_path))
    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(directory_path):
            for file in files:
                file_path = os.path.join(root, file)
                zipf.write(file_path, arcname=os.path.relpath(file_path, directory_path))

#---------------------------------------------------
#-- 				检测参数是否正常
if creatorPath is None or not os.path.isfile(creatorPath):
    print("CREATOR_PATH is not set or is invalid")
    exit(1)

if not os.path.isfile(local_manifestUUID_path):
    print("local_manifestUUID_path is invalid",local_manifestUUID_path)
    exit(1)

if not os.path.isfile(local_manifest_path):
    print("local_manifest_path is invalid",local_manifest_path)
    exit(1)
#---------------------------------------------------
def getUUIDManifestPath():
    data = loadJson(local_manifestUUID_path)
    if not data:
        return False
    uuid = data["uuid"]
    return os.path.join(js_export_dir, "assets/main/native", uuid[:2], uuid + ".manifest")

uuid_manifest_path = getUUIDManifestPath()

def getNewMainfestData():
    return {"packageUrl":"","remoteManifestUrl":"","remoteVersionUrl":"","version":"1.0.0","assets":{},"searchPaths":[]}

def createChannelApk():
    channelID = int(input("请输入渠道ID\n"))
    replaceLineContent(java_config_path, "    static public final int channelID = ", "    static public final int channelID = %d;\n"%(channelID))
    os.system(creatorPath + " --project " + project_path + " --build configPath="+native_config_path+";stage=make")

def getAssets(mainfestData, dirPath):
    fileList = getFileList(dirPath, [])
    for filePath in fileList:
        fileName = filePath.split(js_export_dir + os.path.sep)[1].replace('\\','/')
        md5 = getMD5(filePath)
        size = os.path.getsize(filePath)
        ext = os.path.splitext(filePath)[1]
        if ext == '.zip':
            mainfestData["assets"][fileName] = {"md5":md5,"size":size,"compressed":True}
        else:
            mainfestData["assets"][fileName] = {"md5":md5,"size":size}

# stage: 默认build创建目录与生产脚本资源，make生成包
def generateResourcesAndScript():
    lastManifestData = loadJson(local_manifest_path)
    if not lastManifestData:
        lastManifestData = {"version":"1.0.0"}
        saveJson(local_manifest_path, lastManifestData)

    version = input("请输入版本号(默认当前版本%s)\n"%(lastManifestData["version"]))
    if 0 == len(version):
        version = lastManifestData["version"]
    replaceLineContent(ts_version_path, "export const APP_VERSION = ", "export const APP_VERSION = \"%s\";\n"%(version))
    replaceLineContent(java_config_path, "    static public final String exeResVer = ", "    static public final String exeResVer = \"%s\";\n"%(version))
    os.system(creatorPath + " --project " + project_path + " --build configPath="+native_config_path+";stage=build")
    newMainfestData = getNewMainfestData()
    newMainfestData["version"] = version
    
    publish_dir = os.path.join(publish_base_dir, version)
    publish_manifest_path = os.path.join(publish_dir, "project.manifest")
    publish_version_path = os.path.join(publish_dir, "version.manifest")
    saveJson(publish_version_path, newMainfestData) # 生成version.manifest到指定目录
    getAssets(newMainfestData, js_export_dir)
    saveJson(publish_manifest_path, newMainfestData) # 生成project.manifest到指定目录
    shutil.copyfile(publish_manifest_path,uuid_manifest_path) # 生成的manifest覆盖输出的本地manifest
    copy_folder(js_export_dir, publish_dir) # 生成的资源拷贝到指定目录
    compress_directory(publish_dir, os.path.join(publish_base_dir, version+".zip"))
    shutil.copyfile(publish_manifest_path,local_manifest_path) # 输出的manifest覆盖到本地manifest

if __name__ == '__main__':
    print(platform.system())
    option = int(input("Please input a number to go on:\n \
1.打包资源和脚本 \n \
2.打渠道包 \n \
"))
    if option == 1:
        generateResourcesAndScript()
    elif option == 2:
        createChannelApk()
    else:
        print("invalid option")