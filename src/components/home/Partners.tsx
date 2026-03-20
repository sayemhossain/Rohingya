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
    <section className="bg-gray-50 section-padding">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Partners
          </h2>
          <p className="text-lg text-gray-600">
            Working together for a better future
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((partner) => (
            <div
              key={partner.name}
              className="rounded-lg bg-white shadow-sm border border-gray-200 flex items-center justify-center h-24"
            >
              {partner.logo ? (
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={120}
                  height={60}
                  className="object-contain max-h-16"
                />
              ) : (
                <span className="text-gray-700 font-semibold text-sm md:text-base">
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
