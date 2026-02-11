import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const { scheduleId } = await request.json()

        if (!process.env.LINE_CHANNEL_ACCESS_TOKEN) {
            return NextResponse.json({ error: 'Messaging API token not configured' }, { status: 500 })
        }

        const supabase = await createClient()

        // 1. Fetch Schedule Info
        const { data: schedule } = await supabase
            .from('schedules')
            .select('*')
            .eq('id', scheduleId)
            .single()

        if (!schedule) {
            return NextResponse.json({ error: 'Schedule not found' }, { status: 404 })
        }

        // 2. Fetch All Members
        const { data: members } = await supabase
            .from('members')
            .select('*')
            .not('line_user_id', 'is', null) // Only those linked to LINE

        if (!members || members.length === 0) {
            return NextResponse.json({ count: 0, message: 'No linked members found' })
        }

        // 3. Fetch Attendances
        const { data: attendances } = await supabase
            .from('attendances')
            .select('member_id')
            .eq('schedule_id', scheduleId)

        const respondedMemberIds = new Set(attendances?.map(a => a.member_id) || [])

        // 4. Filter Unresponded
        const targetMembers = members.filter(m => !respondedMemberIds.has(m.id))
        const targetLineIds = targetMembers.map(m => m.line_user_id).filter(id => id) as string[]

        if (targetLineIds.length === 0) {
            return NextResponse.json({ count: 0, message: 'No unresponded members to remind' })
        }

        // 5. Send Multicast Message
        // LINE Multicast API allows up to 500 users at once. 
        // If > 500, we need to chunk (not implemented here for simplicity, assuming < 500)

        const liffUrl = `https://liff.line.me/${process.env.NEXT_PUBLIC_LIFF_ID}`
        const messageText = `【出欠回答のお願い】\n\n${schedule.date} の ${schedule.content} について、まだ出欠の回答が確認できていません。\n\n以下のリンクから回答をお願いします！\n${liffUrl}`

        const response = await fetch('https://api.line.me/v2/bot/message/multicast', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
            },
            body: JSON.stringify({
                to: targetLineIds,
                messages: [
                    {
                        type: 'text',
                        text: messageText
                    }
                ]
            })
        })

        if (!response.ok) {
            const errorData = await response.json()
            console.error('LINE API Error:', errorData)
            throw new Error('Failed to send LINE message')
        }

        return NextResponse.json({ count: targetLineIds.length })

    } catch (error: any) {
        console.error(error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
