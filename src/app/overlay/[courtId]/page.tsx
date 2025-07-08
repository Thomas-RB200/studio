import { redirect } from 'next/navigation';

export default function OverlayPage({ params }: { params: { courtId: string } }) {
  redirect(`/stream?overlay=true&id=${params.courtId}`);
}
