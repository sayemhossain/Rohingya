import { revalidatePath } from "next/cache";

export function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/news");
  revalidatePath("/sectors");
  revalidatePath("/resources");
  revalidatePath("/gallery");
  revalidatePath("/crisis-overview");
  revalidatePath("/get-involved");
  revalidatePath("/contact");
}

export function revalidateNews() {
  revalidatePath("/");
  revalidatePath("/news");
}

export function revalidateSectors() {
  revalidatePath("/");
  revalidatePath("/sectors");
}

export function revalidateResources() {
  revalidatePath("/resources");
}

export function revalidateGallery() {
  revalidatePath("/gallery");
}

export function revalidateTeam() {
  revalidatePath("/about");
}

export function revalidateAbout() {
  revalidatePath("/about");
  revalidatePath("/");
}

export function revalidateSettings() {
  revalidatePath("/");
  revalidatePath("/about");
}
