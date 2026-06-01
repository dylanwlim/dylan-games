import type { Route } from "next";
import { redirect } from "next/navigation";

export default function CipherwordArchiveRedirectPage() {
  redirect("/games/cipher/archive" as Route);
}
