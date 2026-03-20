import Link from "next/link";

export default function CrisisOverview() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <div>
            <h2 className="section-title">The Rohingya Crisis</h2>
            <p className="text-dark-light text-lg leading-relaxed mb-6">
              The Rohingya people, a Muslim ethnic minority from Myanmar&apos;s
              Rakhine State, have faced decades of systematic discrimination,
              violence, and denial of basic rights. In August 2017, a massive
              military crackdown forced over 700,000 Rohingya to flee across the
              border into Bangladesh, creating one of the world&apos;s largest
              and fastest-growing refugee crises.
            </p>
            <p className="text-dark-light text-lg leading-relaxed mb-6">
              Today, more than one million Rohingya refugees live in sprawling
              camps in Cox&apos;s Bazar, Bangladesh — the largest refugee
              settlement in the world. They face immense challenges including
              overcrowding, limited access to education and healthcare, and
              vulnerability to natural disasters such as monsoons and cyclones.
            </p>
            <p className="text-dark-light text-lg leading-relaxed mb-8">
              Despite the scale of the crisis, international attention and
              funding have declined. The Rohingya remain stateless, with no
              clear path to return home safely or rebuild their lives. Sustained
              humanitarian support and global advocacy are critical to ensuring
              their survival and dignity.
            </p>
            <Link
              href="/crisis-overview"
              className="btn-outline inline-block"
            >
              Learn More
            </Link>
          </div>

          {/* Right Side - Image Placeholder */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-gradient-to-br from-brand to-brand-accent flex items-center justify-center">
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
                <p className="text-lg font-medium">Crisis Overview Image</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
