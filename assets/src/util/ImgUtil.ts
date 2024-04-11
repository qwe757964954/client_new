import { NetConfig } from "../config/NetConfig";

/**
 * 图片工具类
 */
export default class ImgUtil{

    //【静态方法】获取道具Url
    static getPropImgUrl = function (propId) {
        if ((propId >= 41 && propId <= 45) || (propId >= 2001 && propId <= 2005)) {
            propId += "_new";
        }
        // return NetConfig.assertUrl + "/assets/imgs/icon/prop/" + propId + ".png";
        return "icon/prop/" + propId + "/spriteFrame";
    }
}

/**
 * 留下来后面有需要的把相关的给放上去，放完了记得删掉。
 */
// var ImgUtil = (function () {
//     var ImgUtil = {};

//     //【静态方法】获取角色大图（注：imgObj只能是Image对象）
//     ImgUtil.getBigRoleImg = function (imgObj, imgId) {
//         if (!imgId)
//             imgId = GameData.userInfoModule.modelId;
//         imgObj.skin = "img/role/role_" + imgId + ".png";
//     }

//     //【静态方法】获取角色小图（注：imgObj只能是Image对象）
//     ImgUtil.getSmallRoleImg = function (imgObj, imgId) {
//         // imgObj.skin = "img/role/role_small_" + imgId + ".png";
//         imgObj.skin = 'img/main/tx_' + imgId + '.png'
//     }

//     //【静态方法】获取道具图片（注：imgObj只能是Image对象）
//     ImgUtil.getPropImg = function (imgObj, propId) {
//         imgObj.skin = ImgUtil.getPropImgUrl(propId);
//     }

//     //获取称号url
//     ImgUtil.getAchieveImgUrl = function (achieveId) {
//         return GameData.ASSETS_URL + "/assets/imgs/icon/achieve/" + achieveId + ".png";
//     }

//     //获取头像url
//     ImgUtil.getAvatarUrl = function (avatar) {
//         return GameData.ASSETS_URL + "/assets/imgs/icon/avatar/" + avatar + ".png";
//     }

//     //【静态方法】显示宠物(睁眼)
//     ImgUtil.getPetImg = function (imgObj, petId, petLevel, width = 0, height = 0) {
//         // imgObj.loadImage("img/icon/pet/" + petId + "_" + petLevel + ".png");
//         imgObj.skin = "img/icon/pet/" + petId + "_" + petLevel + ".png"
//         if (width > 0 && height > 0) {
//             imgObj.width = width;
//             imgObj.height = height;
//         }
//     }

//     //【静态方法】显示宠物(闭眼)
//     ImgUtil.getPetCloseImg = function (imgObj, petId, petLevel, width = 0, height = 0) {
//         // imgObj.loadImage("img/icon/pet/" + petId + "_" + petLevel + "_1.png");
//         imgObj.skin = "img/icon/pet/" + petId + "_" + petLevel + "_1.png"
//         if (width > 0 && height > 0) {
//             imgObj.width = width;
//             imgObj.height = height;
//         }
//     }

//     //【静态方法】获取学生头像
//     ImgUtil.getStudentImg = function (name) {
//         return GameData.ASSETS_URL + "/assets/face/student/" + name + ".png";
//     }

//     //【静态方法】选择宠物
//     ImgUtil.getEquipMessageImg = function (petId, petLevel) {
//         return "img/icon/pet/" + petId + "_" + petLevel + ".png"
//     }

//     //【静态方法】选择宠物
//     ImgUtil.getAnimationPetImg = function (petId) {
//         return "img/icon/role/" + 'pet' + petId + ".png"
//     }

//     //【静态方法】选择人物
//     ImgUtil.getAnimationRoleImg = function (petId) {
//         return "img/icon/role/" + 'role' + petId + ".png";
//     }

//     //【静态方法】动画人物
//     ImgUtil.getAnimationImg = function (petId) {
//         return "img/icon/role/" + petId + ".png";
//     }

//     //【静态方法】显示宠物(指法练习)
//     ImgUtil.getFingerPracticePetImg = function (state, petId) {
//         return "img/icon/fingerPracticePet/" + state + petId + ".png";
//     }

//     //【静态方法】排行榜
//     ImgUtil.getRanking1Img = function (id) {
//         return "img/icon/ranking/" + id + ".png";
//     }

//     //【静态方法】排行榜
//     ImgUtil.getRanking2Img = function (id) {
//         return "img/icon/ranking/" + 'no' + id + ".png";
//     }

//     //【静态方法】排行榜
//     ImgUtil.getRankingFrameImg = function (id) {
//         return "img/icon/ranking/" + 'frame' + id + ".png";
//     }

//     //【静态方法】显示怪物
//     ImgUtil.getMonsterImg = function (imgObj, monsterId, width = 0, height = 0) {
//         imgObj.skin = ImgUtil.getMonsterImgUrl(monsterId);
//         if (width > 0 && height > 0) {
//             imgObj.width = width;
//             imgObj.height = height;
//         }
//     }

//     //【静态方法】获取怪物Url
//     ImgUtil.getMonsterImgUrl = function (monsterId) {
//         return "img/icon/monster/" + monsterId + ".png";
//         // return GameData.ASSETS_URL+"/assets/imgs/icon/monster/" + monsterId + ".png";
//     }

//     //【静态方法】显示宠物身上装备
//     ImgUtil.getPetEquipImg = function (imgObj, petId, equipId, width = 0, height = 0) {
//         // console.log(imgObj)
//         // console.log(petId)
//         // console.log(equipId)
//         if (equipId == null) {
//             return;
//         }
//         imgObj.skin = "img/icon/equip/" + petId + "_" + equipId + ".png";
//         // imgObj.loadImage("img/icon/equip/" + petId + "_" + equipId + ".png");
//         if (width > 0 && height > 0) {
//             imgObj.width = width;
//             imgObj.height = height;
//         }
//     }

//     //【静态方法】显示装备
//     ImgUtil.getEquipImg = function (imgObj, petId, equipId) {
//         if (equipId == null) {
//             return;
//         }
//         imgObj.loadImage(ImgUtil.getEquipImgUrl(petId, equipId));
//     }

//     //【静态方法】显示装备url
//     ImgUtil.getEquipImgUrl = function (petId, equipId) {
//         return "img/icon/equip/equip_" + petId + "_" + equipId + ".png";
//     }

//     //【静态方法】显示发光装备
//     ImgUtil.getEquipImgUrl_F = function (petId, equipId) {
//         return "img/icon/equip/equip_" + petId + "_" + equipId + "_f.png";
//     }

//     //【静态方法】显示挑战boss怪物小图
//     ImgUtil.getBossMonsterSmallImg = function (imgObj, bossId, width = 0, height = 0) {
//         imgObj.skin = "img/icon/bossMonster/small/" + bossId + ".png";
//         if (width > 0 && height > 0) {
//             imgObj.width = width;
//             imgObj.height = height;
//         }
//     }

//     //【静态方法】返回boss图片
//     ImgUtil.returnBossMonsterSmallImg = function (bossId) {
//         return "img/icon/bossMonster/small/" + bossId + ".png";
//     }

//     //【静态方法】返回成就图片
//     ImgUtil.returnAchievementImg = function (Id) {
//         return "img/icon/achievement/" + Id + ".png";
//     }

//     //【静态方法】返回成就图片(带锁)
//     ImgUtil.returnAchievementLockImg = function (Id) {
//         return "img/icon/achievement/" + Id + "(1).png";
//     }

//     //【静态方法】返回成就文本图片
//     ImgUtil.returnAchievementTextImg = function (Id) {
//         if (Id.substring(0, 1) == "1") {
//             return "";
//         } else {
//             return "img/icon/achievement/" + Id + "(2).png";
//         }
//     }

//     return ImgUtil;
// })();