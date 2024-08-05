

export enum EducationLevel {
    ElementaryGrade1 = 3001,
    ElementaryGrade2,
    ElementaryGrade3,
    ElementaryGrade4,
    ElementaryGrade5,
    ElementaryGrade6,
    MiddleSchoolGrade1,
    MiddleSchoolGrade2,
    MiddleSchoolGrade3,
    HighSchoolGrade1,
    HighSchoolGrade2,
    HighSchoolGrade3,
    Other = 3015
}

export interface EducationDataInfo {
    id: EducationLevel,
    monster: string,
    monster_effect: string,
    lock_opener: string,
    box: string,
}

export const EducationDataInfos: EducationDataInfo[] = [
    {
        id: EducationLevel.ElementaryGrade1,
        monster: "spine/TextbookVocabulary/xsg_06_r/xsg_06_r.json",
        monster_effect: "spine/TextbookVocabulary/xsg_06_tx/xsg_06_tx.json",
        lock_opener: "Challenge/reward/rewad_key10/spriteFrame",
        box: "Challenge/reward/treasure_chest6/spriteFrame"
    },
    {
        id: EducationLevel.ElementaryGrade2,
        monster: "spine/TextbookVocabulary/xsg_03_r/xsg_03_r.json",
        monster_effect: "spine/TextbookVocabulary/xsg_03_tx/xsg_03_tx.json",
        lock_opener: "Challenge/reward/rewad_progress/spriteFrame",
        box: "Challenge/reward/treasure_chest3/spriteFrame"
    },
    {
        id: EducationLevel.ElementaryGrade3,
        monster: "spine/TextbookVocabulary/xsg_01_r/xsg_01_r.json",
        monster_effect: "spine/TextbookVocabulary/xsg_01_tx/xsg_01_tx.json",
        lock_opener: "Challenge/reward/rewad_key1/spriteFrame",
        box: "Challenge/reward/treasure_chest1/spriteFrame"
    },
    {
        id: EducationLevel.ElementaryGrade4,
        monster: "spine/TextbookVocabulary/xsg_07_r/xsg_07_r.json",
        monster_effect: "spine/TextbookVocabulary/xsg_07_tx/xsg_07_tx.json",
        lock_opener: "Challenge/reward/rewad_key3/spriteFrame",
        box: "Challenge/reward/treasure_chest7/spriteFrame"
    },
    {
        id: EducationLevel.ElementaryGrade5,
        monster: "spine/TextbookVocabulary/xsg_08_r/xsg_08_r.json",
        monster_effect: "spine/TextbookVocabulary/xsg_08_tx/xsg_08_tx.json",
        lock_opener: "Challenge/reward/rewad_key7/spriteFrame",
        box: "Challenge/reward/treasure_chest8/spriteFrame"
    },
    {
        id: EducationLevel.ElementaryGrade6,
        monster: "spine/TextbookVocabulary/xsg_04_r/xsg_04_r.json",
        monster_effect: "spine/TextbookVocabulary/xsg_04_tx/xsg_04_tx.json",
        lock_opener: "Challenge/reward/rewad_key2/spriteFrame",
        box: "Challenge/reward/treasure_chest4/spriteFrame"
    },
    {
        id: EducationLevel.MiddleSchoolGrade1,
        monster: "spine/TextbookVocabulary/xsg_02_r/xsg_02_r.json",
        monster_effect: "spine/TextbookVocabulary/xsg_02_tx/xsg_02_tx.json",
        lock_opener: "Challenge/reward/rewad_key9/spriteFrame",
        box: "Challenge/reward/treasure_chest2/spriteFrame"
    },
    {
        id: EducationLevel.MiddleSchoolGrade2,
        monster: "spine/TextbookVocabulary/xsg_05_r/xsg_05_r.json",
        monster_effect: "spine/TextbookVocabulary/xsg_05_tx/xsg_05_tx.json",
        lock_opener: "Challenge/reward/rewad_key8/spriteFrame",
        box: "Challenge/reward/treasure_chest5/spriteFrame"
    },
    {
        id: EducationLevel.MiddleSchoolGrade3,
        monster: "spine/TextbookVocabulary/xsg_10_r/xsg_10_r.json",
        monster_effect: "spine/TextbookVocabulary/xsg_10_tx/xsg_10_tx.json",
        lock_opener: "Challenge/reward/rewad_key4/spriteFrame",
        box: "Challenge/reward/treasure_chest10/spriteFrame"
    },
    {
        id: EducationLevel.HighSchoolGrade1,
        monster: "spine/TextbookVocabulary/xsg_11_r/xsg_11_r.json",
        monster_effect: "spine/TextbookVocabulary/xsg_11_tx/xsg_11_tx.json",
        lock_opener: "Challenge/reward/rewad_key6/spriteFrame",
        box: "Challenge/reward/treasure_chest11/spriteFrame"
    },
    {
        id: EducationLevel.HighSchoolGrade2,
        monster: "spine/TextbookVocabulary/xsg_13_r/xsg_13_r.json",
        monster_effect: "spine/TextbookVocabulary/xsg_13_tx/xsg_13_tx.json",
        lock_opener: "Challenge/reward/rewad_key5/spriteFrame",
        box: "Challenge/reward/treasure_chest13/spriteFrame"
    },
    {
        id: EducationLevel.HighSchoolGrade3,
        monster: "spine/TextbookVocabulary/xsg_09_r/xsg_09_r.json",
        monster_effect: "spine/TextbookVocabulary/xsg_09_tx/xsg_09_tx.json",
        lock_opener: "Challenge/reward/rewad_key11/spriteFrame",
        box: "Challenge/reward/treasure_chest9/spriteFrame"
    },
    {
        id: EducationLevel.Other,
        monster: "spine/TextbookVocabulary/xsg_12_r/xsg_12_r.json",
        monster_effect: "spine/TextbookVocabulary/xsg_12_tx/xsg_12_tx.json",
        lock_opener: "Challenge/reward/rewad_key11/spriteFrame",
        box: "Challenge/reward/treasure_chest12/spriteFrame"
    },
];