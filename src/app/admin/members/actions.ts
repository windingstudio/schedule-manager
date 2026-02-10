'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createMember(formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const part = formData.get('part') as string

    if (!name || !part) {
        return { error: 'Name and Part are required' }
    }

    const { error } = await supabase.from('members').insert({
        name,
        part,
    })

    if (error) {
        console.error('Error creating member:', error)
        return { error: 'Failed to create member' }
    }

    revalidatePath('/admin/members')
    redirect('/admin/members')
}

export async function deleteMember(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('members').delete().eq('id', id)

    if (error) {
        console.error('Error deleting member:', error)
        return { error: 'Failed to delete member' }
    }

    revalidatePath('/admin/members')
}
