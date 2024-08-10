
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
}

// Define the structure for education stages and exams
export interface EducationStage {
    title: string; // Title for the stage
    items: EducationGrade[]; // List of items for the stage
}

export const educationAndExams: EducationStage[] = [
    {
        title: '小学',
        items: [
            { title: '一年级', grade: EducationAndExams.G1 },
            { title: '二年级', grade: EducationAndExams.G2 },
            { title: '三年级', grade: EducationAndExams.G3 },
            { title: '四年级', grade: EducationAndExams.G4 },
            { title: '五年级', grade: EducationAndExams.G5 },
            { title: '六年级', grade: EducationAndExams.G6 },
        ],
    },
    {
        title: '初高中',
        items: [
            { title: '初一', grade: EducationAndExams.G7 },
            { title: '初二', grade: EducationAndExams.G8 },
            { title: '初三', grade: EducationAndExams.G9 },
            { title: '高一', grade: EducationAndExams.G10 },
            { title: '高二', grade: EducationAndExams.G11 },
            { title: '高三', grade: EducationAndExams.G12 },
        ],
    },
    {
        title: '大学及以上',
        items: [
            { title: '四级', grade: EducationAndExams.CET4 },
            { title: '六级', grade: EducationAndExams.CET6 },
            { title: '雅思', grade: EducationAndExams.IELTS },
            { title: '托福', grade: EducationAndExams.TOEFL },
            { title: '考研', grade: EducationAndExams.POSTGRADUATE },
            { title: '其他', grade: EducationAndExams.OTHER },
        ],
    },
];