import { SupabaseClient } from '@supabase/supabase-js';
import { IAttendanceRepository } from '../../domain/repositories/IAttendanceRepository';
import { Attendance } from '../../domain/entities/Attendance';

export class SupabaseAttendanceRepository implements IAttendanceRepository {
    private supabase: SupabaseClient;

    constructor(supabase: SupabaseClient) {
        this.supabase = supabase;
    }

    async findByScheduleId(scheduleId: string): Promise<Attendance[]> {
        const { data, error } = await this.supabase
            .from('attendances')
            .select('*')
            .eq('schedule_id', scheduleId);

        if (error) throw error;
        return data as Attendance[];
    }

    async findByMemberId(memberId: string): Promise<Attendance[]> {
        const { data, error } = await this.supabase
            .from('attendances')
            .select('*')
            .eq('member_id', memberId);

        if (error) throw error;
        return data as Attendance[];
    }

    async upsert(attendance: Omit<Attendance, 'id' | 'created_at'>): Promise<Attendance> {
        const { data, error } = await this.supabase
            .from('attendances')
            .upsert(attendance)
            .select()
            .single();

        if (error) throw error;
        return data as Attendance;
    }
}
