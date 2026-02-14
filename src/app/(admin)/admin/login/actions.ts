'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/infrastructure/supabase/server'

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
    try {
        const supabase = await createClient()

        const email = formData.get('email') as string
        const password = formData.get('password') as string

        // Determine the base URL for the redirect
        let siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
        if (process.env.VERCEL_URL) {
            siteUrl = `https://${process.env.VERCEL_URL}`
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${siteUrl}/auth/callback`,
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
            redirect('/admin/login?message=確認メールを送信しました。メール内のリンクをクリックして登録を完了してください。（※迷惑メールフォルダもご確認ください）')
        } else {
            redirect('/admin/login?error=Unknown error occurred')
        }
    } catch (e) {
        // If it's a redirect error, rethrow it so Next.js handles it
        if ((e as any)?.digest?.includes('NEXT_REDIRECT')) {
            throw e
        }
        console.error('Signup error:', e)
        redirect('/admin/login?error=System Error: ' + (e as Error).message)
    }
}

export async function loginWithSocial(provider: 'google' | 'apple') {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
            },
        },
    })

    if (error) {
        redirect('/admin/login?error=' + error.message)
    }

    if (data.url) {
        redirect(data.url)
    }
}
