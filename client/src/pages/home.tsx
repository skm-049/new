import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsSection from "@/components/SkillsSection";
import ExperienceSection from "@/components/ExperienceSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import AIChatWidget from "@/components/AIChatWidget";
import { Link } from "wouter";

export default function Home() {
  const { user } = useAuth();

  useEffect(() => {
    // Dynamic background based on time of day
    const updateBackgroundForTimeOfDay = () => {
      const hour = new Date().getHours();
      const hero = document.querySelector('#home') as HTMLElement;
      
      if (hero) {
        if (hour >= 6 && hour < 12) {
          hero.style.background = 'linear-gradient(135deg, hsl(217 91% 60% / 0.1), hsl(142 76% 36% / 0.1))';
        } else if (hour >= 12 && hour < 18) {
          hero.style.background = 'linear-gradient(135deg, hsl(217 91% 60% / 0.15), hsl(42 100% 50% / 0.1))';
        } else {
          hero.style.background = 'linear-gradient(135deg, hsl(217 91% 60% / 0.2), hsl(142 76% 36% / 0.2))';
        }
      }
    };

    updateBackgroundForTimeOfDay();
    const interval = setInterval(updateBackgroundForTimeOfDay, 3600000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased overflow-x-hidden">
      <Navigation showAdminLink={true} />
      
      {/* Welcome message for authenticated users */}
      <div className="fixed top-20 right-4 z-40 glass rounded-lg px-4 py-2 text-sm">
        <span className="text-muted-foreground">Welcome back, </span>
        <span className="text-primary font-semibold">{(user as any)?.firstName || 'Admin'}</span>
        <Link href="/admin" className="ml-2 text-accent hover:underline" data-testid="link-admin-panel">
          Admin Panel
        </Link>
      </div>
      
      <Hero />
      <ProjectsSection />
      <SkillsSection />
      <ExperienceSection />
      <AboutSection />
      <ContactSection />
      <AIChatWidget />
      
      {/* Footer */}
      <footer className="py-12 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="mb-4">
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Alex Chen
                </span>
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                AI-Powered Full Stack Developer creating innovative solutions for the modern web. 
                Let's build something amazing together.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-github">
                  <i className="fab fa-github text-xl"></i>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-linkedin">
                  <i className="fab fa-linkedin text-xl"></i>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-twitter">
                  <i className="fab fa-twitter text-xl"></i>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-dribbble">
                  <i className="fab fa-dribbble text-xl"></i>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2 text-muted-foreground">
                <a href="#home" className="block hover:text-primary transition-colors" data-testid="link-home">Home</a>
                <a href="#projects" className="block hover:text-primary transition-colors" data-testid="link-projects">Projects</a>
                <a href="#skills" className="block hover:text-primary transition-colors" data-testid="link-skills">Skills</a>
                <a href="#experience" className="block hover:text-primary transition-colors" data-testid="link-experience">Experience</a>
                <a href="#about" className="block hover:text-primary transition-colors" data-testid="link-about">About</a>
                <a href="#contact" className="block hover:text-primary transition-colors" data-testid="link-contact">Contact</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Admin</h4>
              <div className="space-y-2 text-muted-foreground">
                <Link href="/admin" className="block hover:text-primary transition-colors" data-testid="link-admin">Admin Panel</Link>
                <a href="/api/logout" className="block hover:text-primary transition-colors" data-testid="link-logout">Logout</a>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center">
            <div className="text-muted-foreground text-sm mb-4 md:mb-0">
              © 2024 Alex Chen. All rights reserved. Built with ❤️ and cutting-edge tech.
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors" data-testid="link-privacy">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors" data-testid="link-terms">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors" data-testid="link-cookies">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
