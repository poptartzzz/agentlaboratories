"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { 
  faTelegram,
  faTwitter
} from '@fortawesome/free-brands-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface SocialLink {
  icon: IconDefinition;
  href: string;
  label: string;
}

const socialLinks: SocialLink[] = [
  {
    icon: faTwitter,
    href: "https://x.com/botscreator",
    label: "Twitter"
  },
  {
    icon: faTelegram,
    href: "https://t.me/botscreator",
    label: "Telegram"
  }
];

export default function Navigation() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 right-0 bg-black/50 backdrop-blur-sm z-50 border-b border-[#00ff00]/20">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <Image 
              src="/botslogo.png"
              alt="BOTS" 
              width={180}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Link 
                href="/about" 
                className="hover:text-white transition-colors"
              >
                HOW TO
              </Link>

              <div className="mx-3 w-1.5 h-1.5 rounded-full bg-[#00ff00]/30" />

              <Link 
                href="/create" 
                className="hover:text-white transition-colors"
              >
                CREATE
              </Link>

              <div className="mx-3 w-1.5 h-1.5 rounded-full bg-[#00ff00]/30" />

              <Link 
                href="/app" 
                className="hover:text-white transition-colors"
              >
                AGENTS
              </Link>

              <div className="mx-3 w-1.5 h-1.5 rounded-full bg-[#00ff00]/30" />

              <Link 
                href="https://docs.launchlab.one" 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                LITEPAPER
              </Link>

              <div className="mx-3 w-1.5 h-1.5 rounded-full bg-[#00ff00]/30" />

              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  SOCIALS
                  <FontAwesomeIcon 
                    icon={faChevronDown} 
                    className={`w-3 h-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 py-2 w-40 bg-black border border-[#00ff00]/20 backdrop-blur-md">
                    {socialLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-[#00ff00]/10 transition-colors"
                      >
                        <FontAwesomeIcon icon={link.icon} className="w-4 h-4" />
                        <span className="text-sm">{link.label}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 