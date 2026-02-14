import { Schedule } from '../../domain/entities/Schedule';
import { IScheduleRepository } from '../../domain/repositories/IScheduleRepository';

export class GetSchedules {
    constructor(private scheduleRepository: IScheduleRepository) { }

    async execute(filter?: 'upcoming' | 'finished'): Promise<{ upcoming: Schedule[], finished: Schedule[] }> {
        const schedules = await this.scheduleRepository.findAll();

        // Use JST (Japan Standard Time) for date comparison
        const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' });

        const upcoming = schedules.filter(s => s.date >= todayStr);
        const finished = schedules.filter(s => s.date < todayStr).reverse();

        return { upcoming, finished };
    }
}
