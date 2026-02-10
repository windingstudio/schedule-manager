'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    // Type-casting here for simplicity, but robust validation should be used
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        redirect('/admin/login?error=Invalid credentials')
    }

    revalidatePath('/admin', 'layout')
    redirect('/admin')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/callback`,
        }
    })

    if (error) {
        redirect('/admin/login?error=Registration failed: ' + error.message)
    }

    if (data.session) {
        // User signed in automatically (email confirmation disabled)
        revalidatePath('/admin', 'layout')
        redirect('/admin')
    } else if (data.user) {
        // Email confirmation required
        redirect('/admin/login?message=Check your email to confirm verification')
    } else {
        redirect('/admin/login?error=Unknown error occurred')
    }
}
