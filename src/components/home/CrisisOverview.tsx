import Link from "next/link";
import Image from "next/image";

interface CrisisOverviewProps {
  missionTitle?: string;
  missionBody?: string;
  missionImage?: string;
}

export default function CrisisOverview({ missionTitle, missionBody, missionImage }: CrisisOverviewProps) {
  const title = missionTitle || "About AROHI";

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <div>
            <h2 className="section-title">{title}</h2>
            {missionBody && (
              <div
                className="text-dark-light text-lg leading-relaxed [&>p]:mb-6"
                dangerouslySetInnerHTML={{ __html: missionBody }}
              />
            )}
            <Link
              href="/about"
              className="btn-outline inline-block"
            >
              Learn More
            </Link>
          </div>

          {/* Right Side - Image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden aspect-[4/3] relative">
              {missionImage ? (
                <Image
                  src={missionImage}
                  alt={title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-brand to-brand-accent flex items-center justify-center">
                  <div className="text-center text-white/80 p-8">
                    <svg
                      className="w-16 h-16 mx-auto mb-4 opacity-60"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-lg font-medium">About AROHI</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
