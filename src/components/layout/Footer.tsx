import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa";
import { HiLocationMarker, HiMail, HiPhone } from "react-icons/hi";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Sectors", href: "/sectors" },
  { label: "News", href: "/news" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

const programs = [
  { label: "Health", href: "/sectors/health" },
  { label: "Education", href: "/sectors/education" },
  { label: "WaSH", href: "/sectors/wash" },
  { label: "Agriculture", href: "/sectors/agriculture" },
  { label: "Protection", href: "/sectors/protection" },
  { label: "DRR", href: "/sectors/drr" },
];

const socials = [
  { icon: FaFacebookF, href: "https://www.facebook.com/profile.php?id=61560745209096", label: "Facebook" },
  { icon: FaTwitter, href: "https://twitter.com", label: "Twitter" },
  { icon: FaYoutube, href: "https://youtube.com", label: "YouTube" },
  { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* About Column */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <h2 className="text-xl font-bold tracking-tight">
                <span className="text-brand-accent">AROHI</span>
              </h2>
              <p className="text-xs text-gray-400 mt-1">Association of Rural Opportunities &amp; Human Initiatives</p>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Working for socio-economic development of disadvantaged people
              across Barisal Division, Bangladesh since 2002.
            </p>
            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-brand-accent hover:text-white transition-colors duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-semibold mb-5 relative">
              Quick Links
              <span className="block mt-2 w-10 h-0.5 bg-brand-accent rounded-full" />
            </h3>
            <ul className="space-y-3">
              {quickLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-400 hover:text-brand-accent transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-base font-semibold mb-5 relative">
              Programs
              <span className="block mt-2 w-10 h-0.5 bg-brand-accent rounded-full" />
            </h3>
            <ul className="space-y-3">
              {programs.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-400 hover:text-brand-accent transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-base font-semibold mb-5 relative">
              Contact Info
              <span className="block mt-2 w-10 h-0.5 bg-brand-accent rounded-full" />
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <HiLocationMarker className="w-5 h-5 text-brand-accent mt-0.5 shrink-0" />
                <span className="text-sm text-gray-400 leading-relaxed">
                  Kulsum Palace, Mira Bari Road, Battala, Barisal-8200, Bangladesh
                </span>
              </li>
              <li className="flex items-center gap-3">
                <HiMail className="w-5 h-5 text-brand-accent shrink-0" />
                <a
                  href="mailto:arohibd@gmail.com"
                  className="text-sm text-gray-400 hover:text-brand-accent transition-colors duration-200"
                >
                  arohibd@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <HiPhone className="w-5 h-5 text-brand-accent shrink-0" />
                <a
                  href="tel:+8801712127312"
                  className="text-sm text-gray-400 hover:text-brand-accent transition-colors duration-200"
                >
                  +880 1712-127312
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} AROHI. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy-policy"
              className="text-sm text-gray-500 hover:text-brand-accent transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="text-sm text-gray-500 hover:text-brand-accent transition-colors duration-200"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
