

export enum EducationLevel {
    ElementaryGrade1 = 1,
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
    Other
}

export interface EducationDataInfo {
    id: EducationLevel,
    monster: string,
    lock_opener: string,
    box: string,
}

export const EducationDataInfos: EducationDataInfo[] = [
    {
        id: EducationLevel.ElementaryGrade1,
        monster: "spine/TextbookVocabulary/xsg_06_r/xsg_06_r.json",
        lock_opener: "Challenge/reward/rewad_key10/spriteFrame",
        box: "Challenge/reward/treasure_chest6/spriteFrame"
    },
    {
        id: EducationLevel.ElementaryGrade2,
        monster: "spine/TextbookVocabulary/xsg_03_r/xsg_03_r.json",
        lock_opener: "Challenge/reward/rewad_progress/spriteFrame",
        box: "Challenge/reward/treasure_chest3/spriteFrame"
    },
    {
        id: EducationLevel.ElementaryGrade3,
        monster: "spine/TextbookVocabulary/xsg_01_r/xsg_01_r.json",
        lock_opener: "Challenge/reward/rewad_key1/spriteFrame",
        box: "Challenge/reward/treasure_chest1/spriteFrame"
    },
    {
        id: EducationLevel.ElementaryGrade4,
        monster: "spine/TextbookVocabulary/xsg_07_r/xsg_07_r.json",
        lock_opener: "Challenge/reward/rewad_key3/spriteFrame",
        box: "Challenge/reward/treasure_chest7/spriteFrame"
    },
    {
        id: EducationLevel.ElementaryGrade5,
        monster: "spine/TextbookVocabulary/xsg_08_r/xsg_08_r.json",
        lock_opener: "Challenge/reward/rewad_key7/spriteFrame",
        box: "Challenge/reward/treasure_chest8/spriteFrame"
    },
    {
        id: EducationLevel.ElementaryGrade6,
        monster: "spine/TextbookVocabulary/xsg_04_r/xsg_04_r.json",
        lock_opener: "Challenge/reward/rewad_key2/spriteFrame",
        box: "Challenge/reward/treasure_chest4/spriteFrame"
    },
    {
        id: EducationLevel.MiddleSchoolGrade1,
        monster: "spine/TextbookVocabulary/xsg_02_r/xsg_02_r.json",
        lock_opener: "Challenge/reward/rewad_key9/spriteFrame",
        box: "Challenge/reward/treasure_chest2/spriteFrame"
    },
    {
        id: EducationLevel.MiddleSchoolGrade2,
        monster: "spine/TextbookVocabulary/xsg_05_r/xsg_05_r.json",
        lock_opener: "Challenge/reward/rewad_key8/spriteFrame",
        box: "Challenge/reward/treasure_chest5/spriteFrame"
    },
    {
        id: EducationLevel.MiddleSchoolGrade3,
        monster: "spine/TextbookVocabulary/xsg_10_r/xsg_10_r.json",
        lock_opener: "Challenge/reward/rewad_key4/spriteFrame",
        box: "Challenge/reward/treasure_chest10/spriteFrame"
    },
    {
        id: EducationLevel.HighSchoolGrade1,
        monster: "spine/TextbookVocabulary/xsg_11_r/xsg_11_r.json",
        lock_opener: "Challenge/reward/rewad_key6/spriteFrame",
        box: "Challenge/reward/treasure_chest11/spriteFrame"
    },
    {
        id: EducationLevel.HighSchoolGrade2,
        monster: "spine/TextbookVocabulary/xsg_13_r/xsg_13_r.json",
        lock_opener: "Challenge/reward/rewad_key5/spriteFrame",
        box: "Challenge/reward/treasure_chest13/spriteFrame"
    },
    {
        id: EducationLevel.HighSchoolGrade3,
        monster: "spine/TextbookVocabulary/xsg_09_r/xsg_09_r.json",
        lock_opener: "Challenge/reward/rewad_key11/spriteFrame",
        box: "Challenge/reward/treasure_chest9/spriteFrame"
    },
    {
        id: EducationLevel.Other,
        monster: "spine/TextbookVocabulary/xsg_12_r/xsg_12_r.json",
        lock_opener: "Challenge/reward/rewad_key11/spriteFrame",
        box: "Challenge/reward/treasure_chest12/spriteFrame"
    },
];