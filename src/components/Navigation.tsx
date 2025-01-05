import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-lg py-4">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl md:text-2xl">
            <span className="text-[#00ff00]">AGENTZ A</span>
            <span className="text-[#00ff00]">I</span>
          </Link>

          <div className="flex items-center gap-6 text-sm">
            <Link 
              href="/about" 
              className="text-[#00ff00]/70 hover:text-[#00ff00] transition-colors"
            >
              ABOUT
            </Link>
            <Link 
              href="/app" 
              className="text-[#00ff00]/70 hover:text-[#00ff00] transition-colors"
            >
              AGENTS
            </Link>
            <Link 
              href="/create" 
              className="text-[#00ff00]/70 hover:text-[#00ff00] transition-colors"
            >
              AGENT CREATOR
            </Link>
            <a 
              href="https://twitter.com/agentz" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#00ff00]/70 hover:text-[#00ff00] transition-colors"
            >
              TWITTER
            </a>
            <a 
              href="https://t.me/agentz" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#00ff00]/70 hover:text-[#00ff00] transition-colors"
            >
              TELEGRAM
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
} 