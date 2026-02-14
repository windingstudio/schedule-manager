import { Schedule } from '../../domain/entities/Schedule';
import { IScheduleRepository } from '../../domain/repositories/IScheduleRepository';

export class GetSchedules {
    constructor(private scheduleRepository: IScheduleRepository) { }

    async execute(filter?: 'upcoming' | 'finished'): Promise<{ upcoming: Schedule[], finished: Schedule[] }> {
        const schedules = await this.scheduleRepository.findAll();

        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        const todayStr = `${y}-${m}-${d}`;

        const upcoming = schedules.filter(s => s.date >= todayStr);
        const finished = schedules.filter(s => s.date < todayStr).reverse();

        return { upcoming, finished };
    }
}
