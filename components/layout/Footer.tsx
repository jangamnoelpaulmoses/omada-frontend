import Image from 'next/image';
import { Linkedin, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0f1f1c] text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* TOP SECTION */}
        <div className="flex flex-col md:flex-row justify-between gap-16">
          {/* LEFT: Logo + Tagline */}
          <div className="max-w-md">
            <div className="flex items-center mb-6">
              <Image
                src="/omadaDark.png"
                alt="Omada logo"
                width={36}
                height={36}
                className="h-7 w-auto"
              />
            </div>

            <p className="text-base sm:text-lg font-medium text-white leading-snug">
              The AI marketing team
              <br />
              for small businesses
            </p>
          </div>

          {/* RIGHT: Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-16 gap-y-8">
            {/* Column 1 */}
            <div className="space-y-3 text-xs tracking-wide">
              <a
                href="https://omada.ai/pricing"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-white transition"
              >
                PRICING
              </a>
              <a
                href="https://omada.ai/features"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-white transition"
              >
                FEATURES
              </a>
              <a
                href="https://www.facebook.com/groups/649454374816719/?rdid=W736truzf6rTKAje&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2Fg%2F19YhaK8MQf%2F#"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-white transition"
              >
                COMMUNITY
              </a>
              <a
                href="https://omada.ai/affiliate"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-white transition"
              >
                AFFILIATE
              </a>
              <a
                href="https://omada.ai/jobs"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-white transition"
              >
                CAREERS
              </a>
              <a
                href="https://omada.ai/about-us"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-white transition"
              >
                ABOUT US
              </a>
              <a
                href="https://omada.ai/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-white transition"
              >
                CONTACT US
              </a>
            </div>

            {/* Column 2 */}
            <div className="space-y-3 text-xs tracking-wide">
              <a
                href="https://omada.ai/terms-of-services"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-white transition"
              >
                TERMS OF SERVICES
              </a>
              <a
                href="https://omada.ai/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-white transition"
              >
                PRIVACY POLICY
              </a>
            </div>

            {/* Column 3: Social */}
            <div className="space-y-3 text-xs tracking-wide">
              <p className="text-xs text-white tracking-wide">
                FOLLOW US
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://linkedin.com/company/omadaai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  <Linkedin className="w-4 h-4" />
                </a>

                <a
                  href="https://www.facebook.com/profile.php?id=61575854627086"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="mt-24 text-xs text-gray-500 tracking-wide">
          © OMADA 2025. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
}
