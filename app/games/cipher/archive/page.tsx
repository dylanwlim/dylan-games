import type { Metadata } from "next";

import { CipherwordArchive } from "@/features/games/cipherword/CipherwordArchive";

export const metadata: Metadata = {
  title: "Cipher Archive",
  description: "Replay past Cipher daily word puzzles without future answer spoilers.",
  alternates: {
    canonical: "/games/cipher/archive",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function CipherArchivePage() {
  return <CipherwordArchive />;
}
