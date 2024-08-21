
export enum EducationAndExams {
    // Grades
    G1 = 1,        // 小学一年级
    G2,            // 小学二年级
    G3,            // 小学三年级
    G4,            // 小学四年级
    G5,            // 小学五年级
    G6,            // 小学六年级
    G7,            // 初一
    G8,            // 初二
    G9,            // 初三
    G10,           // 高一
    G11,           // 高二
    G12,           // 高三

    // Exam Types
    CET4 = 20,     // 四级
    CET6,          // 六级
    IELTS,         // 雅思
    TOEFL,         // 托福
    POSTGRADUATE,  // 考研
    OTHER          // 其他
}

export interface EducationGrade{
    title: string; 
    grade?: EducationAndExams;
    phase_id:number;
}

// Define the structure for education stages and exams
export interface EducationStage {
    title: string; // Title for the stage
    items: EducationGrade[]; // List of items for the stage
    
}

export enum EducationPhase {
    PRIMARY = 1,    // 小学
    JUNIOR_HIGH,    // 初中
    SENIOR_HIGH,    // 高中
    UNIVERSITY,     // 大学及以上
}

// Define a mapping from phase_id to titles
export const phaseTitles: { [key in EducationPhase]: string } = {
    [EducationPhase.PRIMARY]: '小学',
    [EducationPhase.JUNIOR_HIGH]: '初中',
    [EducationPhase.SENIOR_HIGH]: '高中',
    [EducationPhase.UNIVERSITY]: '大学',
};

export const educationAndExams: EducationStage[] = [
    {
        title: '小学',
        items: [
            { title: '一年级', grade: EducationAndExams.G1, phase_id: EducationPhase.PRIMARY },
            { title: '二年级', grade: EducationAndExams.G2, phase_id: EducationPhase.PRIMARY },
            { title: '三年级', grade: EducationAndExams.G3, phase_id: EducationPhase.PRIMARY },
            { title: '四年级', grade: EducationAndExams.G4, phase_id: EducationPhase.PRIMARY },
            { title: '五年级', grade: EducationAndExams.G5, phase_id: EducationPhase.PRIMARY },
            { title: '六年级', grade: EducationAndExams.G6, phase_id: EducationPhase.PRIMARY },
        ],
    },
    {
        title: '初高中',
        items: [
            { title: '初一', grade: EducationAndExams.G7, phase_id: EducationPhase.JUNIOR_HIGH },
            { title: '初二', grade: EducationAndExams.G8, phase_id: EducationPhase.JUNIOR_HIGH },
            { title: '初三', grade: EducationAndExams.G9, phase_id: EducationPhase.JUNIOR_HIGH },
            { title: '高一', grade: EducationAndExams.G10, phase_id: EducationPhase.SENIOR_HIGH },
            { title: '高二', grade: EducationAndExams.G11, phase_id: EducationPhase.SENIOR_HIGH },
            { title: '高三', grade: EducationAndExams.G12, phase_id: EducationPhase.SENIOR_HIGH },
        ],
    },
    {
        title: '大学及以上',
        items: [
            { title: '四级', grade: EducationAndExams.CET4, phase_id: EducationPhase.UNIVERSITY },
            { title: '六级', grade: EducationAndExams.CET6, phase_id: EducationPhase.UNIVERSITY },
            { title: '雅思', grade: EducationAndExams.IELTS, phase_id: EducationPhase.UNIVERSITY },
            { title: '托福', grade: EducationAndExams.TOEFL, phase_id: EducationPhase.UNIVERSITY },
            { title: '考研', grade: EducationAndExams.POSTGRADUATE, phase_id: EducationPhase.UNIVERSITY },
            { title: '其他', grade: EducationAndExams.OTHER, phase_id: EducationPhase.UNIVERSITY },
        ],
    },
];

export interface EvaluationModel {
    message: string;
}

export const phaseTips: { [key in EducationPhase]: string } = {
    [EducationPhase.PRIMARY]: '小升初的词汇量(800核心词汇量)',
    [EducationPhase.JUNIOR_HIGH]: '中考的词汇量(1600核心词汇量)',
    [EducationPhase.SENIOR_HIGH]: '高考的词汇量(3200核心词汇量)',
    [EducationPhase.UNIVERSITY]: '四级的词汇量(6400核心词汇量)',
};