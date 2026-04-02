import Link from "next/link";

export default function GetInvolvedCTA() {
  return (
    <section className="bg-gradient-to-r from-brand to-brand-dark py-20 md:py-28">
      <div className="container-custom text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Make a Difference Today
        </h2>
        <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto opacity-90">
          Your support can change lives. Join us in empowering disadvantaged
          communities across Barisal Division.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/get-involved"
            className="bg-brand-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-accent/90 transition-colors"
          >
            Donate Now
          </Link>
          <Link
            href="/get-involved"
            className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-brand transition-colors"
          >
            Volunteer With Us
          </Link>
        </div>
      </div>
    </section>
  );
}
