import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getPortfolio } from "@/lib/data";
import { db } from "@/lib/db";
import AdminConsole from "@/components/AdminConsole";
export const dynamic = "force-dynamic";
export default async function AdminPage(){ const session=await getSession(); if(!session?.sub) redirect("/login"); const [data, messages, audit]=await Promise.all([getPortfolio(),db.contactMessage.findMany({orderBy:{createdAt:"desc"},take:12}),db.auditLog.findMany({orderBy:{createdAt:"desc"},take:8})]); return <AdminConsole data={data} email={session.email} messages={messages.map(m=>({name:m.name,email:m.email,message:m.message,date:m.createdAt.toISOString()}))} audit={audit.map(a=>({action:a.action,detail:a.detail,date:a.createdAt.toISOString()}))}/> }
