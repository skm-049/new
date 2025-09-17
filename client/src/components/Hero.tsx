import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import CodeElements from "@/components/Three/CodeElements";
import type { PersonalInfo } from "@shared/schema";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  const { data: personalInfo } = useQuery<PersonalInfo>({
    queryKey: ["/api/portfolio/info"],
    retry: false,
  });

  useEffect(() => {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const animatedElements = document.querySelectorAll(".animate-on-scroll");
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleCTAClick = () => {
    const projectsSection = document.getElementById("projects");
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleResumeDownload = () => {
    if (personalInfo?.resumeUrl) {
      window.open(personalInfo.resumeUrl, "_blank");
    } else {
      // Fallback - create a sample resume URL
      window.open("#", "_blank");
    }
  };

  return (
    <section id="home" className="min-h-screen relative flex items-center justify-center overflow-hidden" ref={heroRef}>
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20"></div>
        
        {/* Three.js Code Elements */}
        <CodeElements />
        
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 animate-gradient-x opacity-50"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <div className="animate-float animate-on-scroll">
          {/* Profile image */}
          <div className="w-32 h-32 mx-auto mb-8 rounded-full overflow-hidden border-4 border-primary/50 animate-glow">
            <img 
              src={personalInfo?.profileImageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"} 
              alt={`${personalInfo?.name || 'Alex Chen'} - Full Stack Developer`} 
              className="w-full h-full object-cover"
              data-testid="img-profile"
            />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse-slow animate-on-scroll" data-testid="text-name">
          {personalInfo?.name || "Alex Chen"}
        </h1>
        
        <p className="text-2xl md:text-3xl text-muted-foreground mb-8 font-light animate-on-scroll" data-testid="text-title">
          {personalInfo?.title || "AI-Powered Full Stack Developer"}
        </p>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-on-scroll" data-testid="text-bio">
          {personalInfo?.bio || "Building the future with cutting-edge AI integration, modern web technologies, and high-performance applications that scale."}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-on-scroll">
          <Button 
            onClick={handleCTAClick}
            className="gradient-border px-8 py-4 rounded-full text-primary-foreground font-semibold hover:scale-105 transform transition-all duration-200 bg-primary animate-glow"
            data-testid="button-view-work"
          >
            <i className="fas fa-rocket mr-2"></i>
            View My Work
          </Button>
          <Button 
            variant="outline"
            onClick={handleResumeDownload}
            className="glass px-8 py-4 rounded-full hover:bg-white/10 transition-all duration-200 font-semibold"
            data-testid="button-download-resume"
          >
            <i className="fas fa-download mr-2"></i>
            Download Resume
          </Button>
        </div>
        
        {/* AI Chat Trigger Button */}
        <div className="mt-12 animate-on-scroll">
          <Button 
            variant="outline"
            className="inline-flex items-center space-x-2 glass px-6 py-3 rounded-full hover:bg-primary/20 transition-all duration-200"
            onClick={() => {
              const chatWidget = document.getElementById("aiChatWidget");
              if (chatWidget) {
                chatWidget.classList.remove("hidden");
              }
            }}
            data-testid="button-ai-chat-trigger"
          >
            <i className="fas fa-robot text-accent"></i>
            <span>Ask AI about my skills</span>
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
          </Button>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <i className="fas fa-chevron-down text-muted-foreground text-xl"></i>
      </div>
    </section>
  );
}
