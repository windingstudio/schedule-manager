import { SupabaseClient } from '@supabase/supabase-js';
import { IScheduleRepository } from '../../domain/repositories/IScheduleRepository';
import { Schedule } from '../../domain/entities/Schedule';

export class SupabaseScheduleRepository implements IScheduleRepository {
    private supabase: SupabaseClient;

    constructor(supabase: SupabaseClient) {
        this.supabase = supabase;
    }

    async findById(id: string): Promise<Schedule | null> {
        const { data, error } = await this.supabase
            .from('schedules')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as Schedule;
    }

    async findAll(): Promise<Schedule[]> {
        const { data, error } = await this.supabase
            .from('schedules')
            .select('*')
            .order('date', { ascending: true });

        if (error) throw error;
        return data as Schedule[];
    }

    async create(schedule: Omit<Schedule, 'id'>): Promise<Schedule> {
        const { data, error } = await this.supabase
            .from('schedules')
            .insert(schedule)
            .select()
            .single();

        if (error) throw error;
        return data as Schedule;
    }

    async update(id: string, schedule: Partial<Schedule>): Promise<Schedule> {
        const { data, error } = await this.supabase
            .from('schedules')
            .update(schedule)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Schedule;
    }

    async delete(id: string): Promise<void> {
        const { error } = await this.supabase
            .from('schedules')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }

    async findUpcoming(date: string): Promise<Schedule[]> {
        const { data, error } = await this.supabase
            .from('schedules')
            .select('*')
            .gte('date', date)
            .order('date', { ascending: true });

        if (error) throw error;
        return data as Schedule[];
    }

    async findPast(date: string): Promise<Schedule[]> {
        const { data, error } = await this.supabase
            .from('schedules')
            .select('*')
            .lt('date', date)
            .order('date', { ascending: false });

        if (error) throw error;
        return data as Schedule[];
    }
}
