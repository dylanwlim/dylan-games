import { redirect } from "next/navigation";

type CipherArchiveDatePageProps = {
  params: Promise<{
    date: string;
  }>;
};

export default async function CipherArchiveDatePage({ params }: CipherArchiveDatePageProps) {
  const { date } = await params;

  redirect(`/games/cipher?mode=archive&date=${date}`);
}
