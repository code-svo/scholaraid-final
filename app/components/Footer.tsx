import Link from 'next/link';
import { useState } from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  
  const links = [
    { name: 'Resume', href: '/resume', isInternal: true },
    { name: 'Read.cv', href: 'https://read.cv/your-username', isInternal: false },
    { name: 'LinkedIn', href: 'https://linkedin.com/in/withshubhajit', isInternal: false }
  ];
  
  return (
    <footer className="relative w-full bg-black border-t border-white/10">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-red-500/10 opacity-50" />
      
      <div className="relative max-w-7xl mx-auto px-4 py-12">
        {/* Contact Section */}
        <div className="mb-8 group">
          <h3 className="text-gray-400 text-sm font-medium mb-2">Contact</h3>
          <div className="space-y-3">
            <a 
              href="mailto:sarkarshubhajit7704@gmail.com"
              className="relative text-white hover:text-blue-400 transition-colors duration-300 group-hover:pl-2 block flex items-center gap-3"
            >
              <span className="w-5 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              sarkarshubhajit7704@gmail.com
            </a>
            <a 
              href="mailto:roysouvik8220@gmail.com"
              className="relative text-white hover:text-blue-400 transition-colors duration-300 group-hover:pl-2 block flex items-center gap-3"
            >
              <span className="w-5 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              roysouvik8220@gmail.com
            </a>
          </div>
        </div>

        {/* Links Section */}
        <div className="mb-12">
          <h3 className="text-gray-400 text-sm font-medium mb-4">Links</h3>
          <div className="space-y-3">
            {links.map((link) => {
              const LinkComponent = link.isInternal ? Link : 'a';
              return (
                <LinkComponent 
                  key={link.name}
                  href={link.href}
                  target={link.isInternal ? undefined : '_blank'}
                  rel={link.isInternal ? undefined : 'noopener noreferrer'}
                  className="group block text-white hover:text-blue-400 transition-all duration-300"
                  onMouseEnter={() => setHoveredLink(link.name)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  <div className="flex items-center gap-2">
                    <span className="relative">
                      {link.name}
                      <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-blue-400 transition-all duration-300 
                                   group-hover:w-full" />
                    </span>
                    <svg 
                      className={`w-4 h-4 transform transition-all duration-300 
                                ${hoveredLink === link.name ? 'translate-x-1 opacity-100' : 'opacity-0'}`} 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d={link.isInternal 
                          ? "M14 5l7 7m0 0l-7 7m7-7H3" 
                          : "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        } 
                      />
                    </svg>
                  </div>
                </LinkComponent>
              );
            })}
          </div>
        </div>

        {/* Accolades Section */}
        <div className="mb-12">
          <h3 className="text-gray-400 text-sm font-medium mb-4">Accolades</h3>
          <div className="flex items-center justify-between">
            <div className="text-4xl font-bold tracking-tighter text-white hover:text-transparent hover:bg-clip-text 
                          hover:bg-gradient-to-r hover:from-cyan-500 hover:via-purple-500 hover:to-red-500 
                          transition-all duration-300 cursor-default">
              RoastedCode
            </div>
            <div className="text-2xl font-medium text-white flex items-center gap-2">
              <span className="relative">
                ©{currentYear}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gradient-to-r from-cyan-500 via-purple-500 
                             to-red-500 transition-all duration-300 group-hover:w-full" />
              </span>
            </div>
          </div>
        </div>

        {/* Rainbow Border */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-red-500" />
      </div>
    </footer>
  );
};

export default Footer; 