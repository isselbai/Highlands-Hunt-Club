'use client'
import dynamic from 'next/dynamic'
const AdminWeekCalendar = dynamic(()=>import('@/components/AdminWeekCalendar'), { ssr:false })
export default function ClientWeek(){ return <AdminWeekCalendar/> }