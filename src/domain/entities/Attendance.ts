export interface Attendance {
    id: string;
    schedule_id: string;
    member_id: string;
    status: string; // '出席', '欠席', '遅刻', '早退' etc.
    reason?: string;
    returned_home_at?: string; // timestamp
    created_at?: string;
}
