import { redirect } from "next/navigation";

export default function NotFound() {
  // Redirect any 404 to home
  redirect("/");
}
