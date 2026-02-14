import { Schedule } from '../entities/Schedule';

export interface IScheduleRepository {
    findById(id: string): Promise<Schedule | null>;
    findAll(): Promise<Schedule[]>;
    create(schedule: Omit<Schedule, 'id'>): Promise<Schedule>;
    update(id: string, schedule: Partial<Schedule>): Promise<Schedule>;
    delete(id: string): Promise<void>;
    findUpcoming(date: string): Promise<Schedule[]>;
    findPast(date: string): Promise<Schedule[]>;
}
