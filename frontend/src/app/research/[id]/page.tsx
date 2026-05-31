import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://100.76.233.80:8001";

export default async function SessionDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`${API_URL}/api/sessions/${id}`, { cache: "no-store" });
  if (!res.ok) return <p>Session not found</p>;

  const session = await res.json();

  if (session.status === "decided") redirect(`/research/${id}/decide`);
  if (session.status === "complete" || session.status === "researching") redirect(`/research/${id}/results`);
  if (session.status === "analyzing" && session.needs?.length > 0) redirect(`/research/${id}/gaps`);

  if (session.mode === "goal-driven") {
    await fetch(`${API_URL}/api/sessions/${id}/analyze`, { method: "POST" });
    redirect(`/research/${id}/gaps`);
  }

  await fetch(`${API_URL}/api/sessions/${id}/research`, { method: "POST" });
  redirect(`/research/${id}/results`);
}
