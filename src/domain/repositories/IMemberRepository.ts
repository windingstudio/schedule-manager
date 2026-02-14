import { Member } from '../entities/Member';

export interface IMemberRepository {
    findById(id: string): Promise<Member | null>;
    findAll(): Promise<Member[]>;
    create(member: Omit<Member, 'id'>): Promise<Member>;
    update(id: string, member: Partial<Member>): Promise<Member>;
    delete(id: string): Promise<void>;
}
