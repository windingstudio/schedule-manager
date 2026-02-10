'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createMember(formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const part = formData.get('part') as string
    const role = formData.get('role') as string
    const is_on_leave = formData.get('is_on_leave') === 'on'
    const birthday = formData.get('birthday') as string || null
    const note = formData.get('note') as string

    if (!name || !part) {
        throw new Error('Name and Part are required')
    }

    const { error } = await supabase.from('members').insert({
        name,
        part,
        role: role || null,
        is_on_leave,
        birthday: birthday || null, // Handle empty string as null
        note,
    })

    if (error) {
        console.error('Error creating member:', error)
        throw new Error('Failed to create member')
    }

    revalidatePath('/admin/members')
    redirect('/admin/members')
}

export async function updateMember(id: string, formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const part = formData.get('part') as string
    const role = formData.get('role') as string
    const is_on_leave = formData.get('is_on_leave') === 'on'
    const birthday = formData.get('birthday') as string || null
    const note = formData.get('note') as string

    if (!name || !part) {
        throw new Error('Name and Part are required')
    }

    const { error } = await supabase.from('members').update({
        name,
        part,
        role: role || null,
        is_on_leave,
        birthday: birthday || null,
        note,
    }).eq('id', id)

    if (error) {
        console.error('Error updating member:', error)
        throw new Error('Failed to update member')
    }

    revalidatePath('/admin/members')
    revalidatePath(`/admin/members/${id}`)
    redirect('/admin/members')
}

export async function deleteMember(formData: FormData) {
    const id = formData.get('id') as string
    const supabase = await createClient()
    const { error } = await supabase.from('members').delete().eq('id', id)

    if (error) {
        console.error('Error deleting member:', error)
        throw new Error('Failed to delete member')
    }

    revalidatePath('/admin/members')
}
