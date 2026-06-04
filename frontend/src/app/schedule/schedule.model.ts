export interface WorkItem {
    workDescription: string;
    workDate: string;
    workStartTime: string;
    workEndTime: string;
}

export interface Schedule {
    city: string;
    street: string;
    building: string;
    items: WorkItem[];
}

export interface SchedulesResponse {
    schedules: Schedule[];
}
