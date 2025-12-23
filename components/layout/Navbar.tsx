'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav>
      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* Top Row */}
        <div className="relative flex items-center justify-between">
          {/* LEFT: Logo */}
          <div className="flex items-center space-x-3">
            <a
             href="https://omada.ai/features"
             target="_blank">
            <Image
              src="/logo.png"
              alt="Omada logo"
              width={32}
              height={32}
              className="w-auto h-7 rounded-md"
              priority
            />
            </a>
          </div>

          {/* CENTER: Features / Pricing */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center space-x-8">
            <a
              href="https://omada.ai/features"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-800 hover:text-gray-900 transition"
            >
              Features
            </a>

            <a
              href="https://omada.ai/pricing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-800 hover:text-gray-900 transition"
            >
              Pricing
            </a>
          </div>

          {/* RIGHT: Auth buttons */}
          <div className="hidden md:flex items-center space-x-6">
            <Button asChild variant="ghost" className="text-gray-600">
              <a
                href="https://app.omada.ai"
                target="_blank"
                rel="noopener noreferrer"
              >
                Login
              </a>
            </Button>

            <Button
              asChild
              className="bg-gradient-to-r from-green-200 to-blue-200 text-gray-900 hover:from-green-300 hover:to-blue-300"
            >
              <a
                href="https://app.omada.ai"
                target="_blank"
                rel="noopener noreferrer"
              >
                Try for Free
              </a>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-gray-700"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden mt-6 space-y-4 border-t pt-4">
            <a
              href="https://omada.ai/features"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-gray-700 hover:text-gray-900"
              onClick={() => setOpen(false)}
            >
              Features
            </a>

            <a
              href="https://omada.ai/pricing"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-gray-700 hover:text-gray-900"
              onClick={() => setOpen(false)}
            >
              Pricing
            </a>

            <a
              href="https://app.omada.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-gray-700 hover:text-gray-900"
              onClick={() => setOpen(false)}
            >
              Login
            </a>

            <a
              href="https://app.omada.ai"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="block w-full text-center bg-gradient-to-r from-green-200 to-blue-200 text-gray-900 py-2 rounded-md font-medium hover:from-green-300 hover:to-blue-300"
            >
              Try for Free
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
