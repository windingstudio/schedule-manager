'use server'

import { createClient } from '@/infrastructure/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createSchedule(formData: FormData) {
    const supabase = await createClient()

    const date = formData.get('date') as string
    const startTime = formData.get('start_time') as string
    const endTime = formData.get('end_time') as string
    const place = formData.get('place') as string
    const content = formData.get('content') as string
    const note = formData.get('note') as string

    // Simple validation
    if (!date || !startTime || !endTime || !place) {
        // In a real app, handle error better
        throw new Error('Missing required fields')
    }

    const { error } = await supabase.from('schedules').insert({
        date,
        start_time: startTime,
        end_time: endTime,
        place,
        content,
        note,
    })

    if (error) {
        console.error('Error creating schedule:', error)
        throw new Error('Failed to create schedule')
    }

    revalidatePath('/admin/schedules')
    revalidatePath('/admin') // Update dashboard too
    redirect('/admin/schedules')
}

export async function deleteSchedule(id: string) {
    const supabase = await createClient()

    // Auth check should be here too? (Middleware covers it, but good practice)

    const { error } = await supabase.from('schedules').delete().eq('id', id)

    if (error) {
        console.error('Error deleting schedule:', error)
        // return { error: 'Failed to delete schedule' }
        throw new Error('Failed to delete schedule')
    }

    revalidatePath('/admin/schedules')
    revalidatePath('/admin')
}
