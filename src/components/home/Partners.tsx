import Image from "next/image";

interface Partner {
  name: string;
  logo?: string;
}

export default function Partners({ partners }: { partners?: Partner[] | string[] }) {
  if (!partners || partners.length === 0) return null;
  // Normalize: partners from DB can be objects with name/logo or string[]
  const items: Partner[] = partners.map((p) => (typeof p === "string" ? { name: p } : p));

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white section-padding">
      {/* Decorative background accents */}
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-brand-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />

      <div className="container-custom relative">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Our Partners
          </h2>
          <p className="text-lg text-gray-600">
            Working together for a better future
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {items.map((partner) => (
            <div
              key={partner.name}
              className="group relative flex h-32 flex-col items-center justify-center gap-2.5 overflow-hidden rounded-2xl border border-gray-200/80 bg-white/70 p-5 text-center shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-accent/50 hover:shadow-xl hover:shadow-brand-accent/10"
            >
              {/* Hover gradient sheen */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-accent/0 via-brand-accent/0 to-brand/0 opacity-0 transition-opacity duration-300 group-hover:from-brand-accent/5 group-hover:to-brand/5 group-hover:opacity-100" />

              {partner.logo && (
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={120}
                  height={60}
                  className="relative max-h-12 w-auto object-contain grayscale transition-all duration-300 group-hover:grayscale-0 group-hover:scale-105"
                />
              )}
              {partner.name && (
                <span
                  className={`relative break-words font-semibold leading-tight text-gray-700 transition-colors duration-300 group-hover:text-brand ${
                    partner.logo ? "text-xs md:text-sm" : "text-sm md:text-base"
                  }`}
                >
                  {partner.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
