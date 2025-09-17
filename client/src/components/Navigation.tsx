import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";

interface NavigationProps {
  showAdminLink?: boolean;
}

export default function Navigation({ showAdminLink = false }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    // Smooth scrolling for navigation links
    const handleAnchorClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.getAttribute("href")?.startsWith("#")) {
        e.preventDefault();
        const id = target.getAttribute("href")?.substring(1);
        const element = document.getElementById(id || "");
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
          // Close mobile menu if open
          setMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Alex Chen
            </span>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#home" className="hover:text-primary transition-colors duration-200 font-medium" data-testid="nav-home">Home</a>
              <a href="#projects" className="hover:text-primary transition-colors duration-200 font-medium" data-testid="nav-projects">Projects</a>
              <a href="#skills" className="hover:text-primary transition-colors duration-200 font-medium" data-testid="nav-skills">Skills</a>
              <a href="#experience" className="hover:text-primary transition-colors duration-200 font-medium" data-testid="nav-experience">Experience</a>
              <a href="#about" className="hover:text-primary transition-colors duration-200 font-medium" data-testid="nav-about">About</a>
              <a href="#contact" className="hover:text-primary transition-colors duration-200 font-medium" data-testid="nav-contact">Contact</a>
              {showAdminLink && (
                <a href="/admin" className="hover:text-accent transition-colors duration-200 font-medium" data-testid="nav-admin">Admin</a>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-muted transition-colors duration-200"
              aria-label="Toggle theme"
              data-testid="button-theme-toggle"
            >
              <i className={`${theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'} text-lg`}></i>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2 rounded-full hover:bg-muted transition-colors duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              <i className="fas fa-bars text-lg"></i>
            </Button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-border/50">
              <a href="#home" className="block px-3 py-2 hover:text-primary transition-colors duration-200" data-testid="mobile-nav-home">Home</a>
              <a href="#projects" className="block px-3 py-2 hover:text-primary transition-colors duration-200" data-testid="mobile-nav-projects">Projects</a>
              <a href="#skills" className="block px-3 py-2 hover:text-primary transition-colors duration-200" data-testid="mobile-nav-skills">Skills</a>
              <a href="#experience" className="block px-3 py-2 hover:text-primary transition-colors duration-200" data-testid="mobile-nav-experience">Experience</a>
              <a href="#about" className="block px-3 py-2 hover:text-primary transition-colors duration-200" data-testid="mobile-nav-about">About</a>
              <a href="#contact" className="block px-3 py-2 hover:text-primary transition-colors duration-200" data-testid="mobile-nav-contact">Contact</a>
              {showAdminLink && (
                <a href="/admin" className="block px-3 py-2 hover:text-accent transition-colors duration-200" data-testid="mobile-nav-admin">Admin</a>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
