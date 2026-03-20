import { useQuery } from "@tanstack/react-query";

// Generic fetcher
async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Failed to fetch");
  return json.data;
}

// Homepage data
export function useHomepage() {
  return useQuery({
    queryKey: ["homepage"],
    queryFn: () =>
      fetcher<{
        news: Record<string, unknown>[];
        sectors: Record<string, unknown>[];
        heroSlides: unknown;
        stats: unknown;
        partnerLogos: unknown;
      }>("/api/homepage"),
  });
}

// Menu
export function useMenu() {
  return useQuery({
    queryKey: ["menu"],
    queryFn: async () => {
      const res = await fetch("/api/settings?key=menu_order");
      const json = await res.json();
      if (json.success && json.data?.value?.length > 0) {
        return json.data.value;
      }
      return null;
    },
  });
}

// News list
export function useNewsList() {
  return useQuery({
    queryKey: ["news"],
    queryFn: () => fetcher<Record<string, unknown>[]>("/api/news"),
  });
}

// Single news article
export function useNewsArticle(slug: string) {
  return useQuery({
    queryKey: ["news", slug],
    queryFn: () => fetcher<Record<string, unknown>>(`/api/news/${slug}`),
    enabled: !!slug,
  });
}

// Sectors list
export function useSectorsList() {
  return useQuery({
    queryKey: ["sectors"],
    queryFn: () => fetcher<Record<string, unknown>[]>("/api/sectors"),
  });
}

// Single sector
export function useSector(slug: string) {
  return useQuery({
    queryKey: ["sectors", slug],
    queryFn: () => fetcher<Record<string, unknown>>(`/api/sectors/${slug}`),
    enabled: !!slug,
  });
}

// Resources
export function useResources() {
  return useQuery({
    queryKey: ["resources"],
    queryFn: () => fetcher<Record<string, unknown>[]>("/api/resources"),
  });
}

// Gallery
export function useGallery() {
  return useQuery({
    queryKey: ["gallery"],
    queryFn: () => fetcher<Record<string, unknown>[]>("/api/gallery"),
  });
}

// Team members
export function useTeam() {
  return useQuery({
    queryKey: ["team"],
    queryFn: () => fetcher<Record<string, unknown>[]>("/api/team"),
  });
}
