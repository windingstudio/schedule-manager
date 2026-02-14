import { Attendance } from '../entities/Attendance';

export interface IAttendanceRepository {
    findByScheduleId(scheduleId: string): Promise<Attendance[]>;
    findByMemberId(memberId: string): Promise<Attendance[]>;
    upsert(attendance: Omit<Attendance, 'id' | 'created_at'>): Promise<Attendance>;
}
