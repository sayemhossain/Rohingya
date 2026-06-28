import { redirect } from "next/navigation";

// Sub-programme management now lives under Our Programmes (merged tabbed page).
export default function AdminSubProgrammesRedirect() {
  redirect("/admin/sectors?tab=subprogrammes");
}
