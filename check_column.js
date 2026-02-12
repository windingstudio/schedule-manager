
const { createClient } = require('@supabase/supabase-js')
const dotenv = require('dotenv')

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkColumn() {
    console.log('Checking for residence column...')
    const { data, error } = await supabase
        .from('members')
        .select('residence')
        .limit(1)

    if (error) {
        console.error('Error selecting residence:', error)
    } else {
        console.log('Successfully selected residence column. Data:', data)
    }
}

checkColumn()
