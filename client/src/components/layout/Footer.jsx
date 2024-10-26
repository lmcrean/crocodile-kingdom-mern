// src/components/layout/Footer.jsx
import React from 'react';

const socialLinks = [
  { name: 'Facebook', href: 'https://www.facebook.com/', icon: '/assets/media/icons/facebook.svg' },
  { name: 'Instagram', href: 'https://www.instagram.com/', icon: '/assets/media/icons/instagram.svg' },
  { name: 'GitHub', href: 'https://www.github.com/', icon: '/assets/media/icons/github.svg' },
  { name: 'TikTok', href: 'https://www.tiktok.com/', icon: '/assets/media/icons/tiktok.svg' },
  { name: 'YouTube', href: 'https://www.youtube.com/', icon: '/assets/media/icons/youtube.svg' },
  { name: 'Discord', href: 'https://www.discord.com/', icon: '/assets/media/icons/discord.svg' },
  { name: 'Slack', href: 'https://www.slack.com/', icon: '/assets/media/icons/slack.svg' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/', icon: '/assets/media/icons/linkedin.svg' },
];

export default function Footer() {
  return (
    <footer className="w-full py-8 mt-0 bg-green-50/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        {/* Copyright */}
        <div className="text-center mb-8">
          <p className="text-sm sm:text-base text-green-800">© 2023 Crocodile Kingdom</p>
        </div>

        {/* Social Links - Responsive grid */}
        <div className="grid grid-cols-4 gap-3 xs:gap-4 
                      max-w-xs mx-auto sm:flex sm:max-w-2xl 
                      sm:justify-center sm:gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 xs:w-10 xs:h-10 rounded-full 
                       bg-green-600 flex items-center justify-center 
                       hover:bg-green-700 transition-colors group"
              aria-label={link.name}
            >
              <img 
                src={link.icon} 
                alt=""
                className="w-4 h-4 xs:w-5 xs:h-5 invert 
                         group-hover:scale-110 transition-transform"
              />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}