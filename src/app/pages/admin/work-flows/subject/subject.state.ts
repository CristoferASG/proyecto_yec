export interface SubjectState {
    academicPeriodId: string;
    careerId: string;
    typeId: string;
    autonomousHour: number;
    code: string;
    credits: number;
    name: string;
    practicalHour: number;
    scale: number;
    teacherHour: number;
}

/** Fila del listado (lo que devuelve GET / — sin relaciones). */
export interface SubjectInterface {
    id: string;
    code: string;
    name: string;
    autonomousHour: number;
    practicalHour: number;
    teacherHour: number;
    credits: number;
    scale: number;
}

export const INITIAL_STATE: SubjectState = {
    academicPeriodId: '',
    careerId: '',
    typeId: '',
    autonomousHour: 0,
    code: '',
    credits: 0,
    name: '',
    practicalHour: 0,
    scale: 0,
    teacherHour: 0,
};

/** Whitelist de claves que el store puede recibir al hacer update. */
export const SUBJECT_KEYS = [
    'academicPeriodId',
    'careerId',
    'typeId',
    'autonomousHour',
    'code',
    'credits',
    'name',
    'practicalHour',
    'scale',
    'teacherHour',
] as const satisfies (keyof SubjectState)[];
