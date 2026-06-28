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
        journey: unknown;
        impactStories: unknown;
      }>("/api/homepage"),
  });
}

// Site logo
export function useLogo() {
  return useQuery({
    queryKey: ["site_logo"],
    queryFn: async () => {
      const res = await fetch("/api/settings?key=site_logo");
      const json = await res.json();
      if (json.success && json.data?.value) {
        return json.data.value as string;
      }
      return null;
    },
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

// Single sector (includes its published sub-programmes as `subProgrammes`)
export function useSector(slug: string) {
  return useQuery({
    queryKey: ["sectors", slug],
    queryFn: () => fetcher<Record<string, unknown>>(`/api/sectors/${slug}`),
    enabled: !!slug,
  });
}

// Programmes nav tree (programmes + their sub-programmes) for the navbar flyout
export function useProgrammesNav() {
  return useQuery({
    queryKey: ["programmes-nav"],
    queryFn: () =>
      fetcher<
        { name: string; slug: string; subProgrammes: { name: string; slug: string }[] }[]
      >("/api/programmes-nav"),
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

// About page content
export function useAbout() {
  return useQuery({
    queryKey: ["about"],
    queryFn: () => fetcher<Record<string, unknown>>("/api/about"),
  });
}

// Team members
export function useTeam() {
  return useQuery({
    queryKey: ["team"],
    queryFn: () => fetcher<Record<string, unknown>[]>("/api/team"),
  });
}
