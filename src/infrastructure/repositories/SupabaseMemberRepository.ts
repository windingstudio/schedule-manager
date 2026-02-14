import { SupabaseClient } from '@supabase/supabase-js';
import { IMemberRepository } from '../../domain/repositories/IMemberRepository';
import { Member } from '../../domain/entities/Member';

export class SupabaseMemberRepository implements IMemberRepository {
    private supabase: SupabaseClient;

    constructor(supabase: SupabaseClient) {
        this.supabase = supabase;
    }

    async findById(id: string): Promise<Member | null> {
        const { data, error } = await this.supabase
            .from('members')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as Member;
    }

    async findAll(): Promise<Member[]> {
        const { data, error } = await this.supabase
            .from('members')
            .select('*')
            .order('id'); // Default order

        if (error) throw error;
        return data as Member[];
    }

    async create(member: Omit<Member, 'id'>): Promise<Member> {
        const { data, error } = await this.supabase
            .from('members')
            .insert(member)
            .select()
            .single();

        if (error) throw error;
        return data as Member;
    }

    async update(id: string, member: Partial<Member>): Promise<Member> {
        const { data, error } = await this.supabase
            .from('members')
            .update(member)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Member;
    }

    async delete(id: string): Promise<void> {
        const { error } = await this.supabase
            .from('members')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
}
