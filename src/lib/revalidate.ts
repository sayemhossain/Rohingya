import { revalidatePath } from "next/cache";

export function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/news");
  revalidatePath("/programmes");
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
  revalidatePath("/programmes");
}

export function revalidateSubProgrammes() {
  // Sub-programmes can appear under any programme, so refresh the whole tree.
  revalidatePath("/");
  revalidatePath("/programmes");
  revalidatePath("/programmes/[slug]", "page");
  revalidatePath("/programmes/[slug]/[sub]", "page");
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
