// ==============================
// Modelos de dominio (item de lista / DTOs retornados por el backend).
// Diferentes del estado del formulario (ver subjects.state.ts).
// ==============================
export interface SubjectInterface {
    id: string;
    code: string;
    name: string;
    academicPeriod: string;
    type: string;
    teacherHour: number;
    practicalHour: number;
    autonomousHour: number;
    isVisible: boolean;
}