import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Skill } from "@shared/schema";

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const { data: skills = [] } = useQuery<Skill[]>({
    queryKey: ["/api/portfolio/skills"],
    retry: false,
  });

  const { data: skillSuggestions = [] } = useQuery<string[]>({
    queryKey: ["/api/ai/skill-suggestions"],
    retry: false,
    enabled: skills.length > 0,
  });

  const technicalSkills = skills.filter(skill => skill.category === "technical");
  const aiMlSkills = skills.filter(skill => skill.category === "ai_ml");
  const toolsSkills = skills.filter(skill => skill.category === "tools");

  useEffect(() => {
    // Animate skill progress bars on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const progressBars = entry.target.querySelectorAll(".skill-progress");
            progressBars.forEach((bar) => {
              const progressElement = bar as HTMLElement;
              const targetWidth = progressElement.dataset.progress;
              if (targetWidth) {
                progressElement.style.width = "0%";
                setTimeout(() => {
                  progressElement.style.width = `${targetWidth}%`;
                }, 200);
              }
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [skills]);

  const SkillCategory = ({ title, skillsList, icon }: { title: string; skillsList: Skill[]; icon: string }) => (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold mb-6 flex items-center">
        <i className={`${icon} text-primary mr-3`}></i>
        {title}
      </h3>
      
      <div className="space-y-6">
        {skillsList.map((skill) => (
          <div key={skill.id} className="skill-item" data-testid={`skill-${skill.id}`}>
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold flex items-center">
                {skill.icon && <i className={`${skill.icon} mr-2`} style={{ color: skill.color || undefined }}></i>}
                {skill.name}
              </span>
              <span className="text-muted-foreground" data-testid={`skill-proficiency-${skill.id}`}>
                {skill.proficiency}%
              </span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden relative">
              <div 
                className="skill-progress h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 animate-glow"
                data-progress={skill.proficiency}
                style={{ width: "0%" }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section id="skills" className="py-20" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent" data-testid="text-skills-title">
            Technical Expertise
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-skills-subtitle">
            A comprehensive skill set spanning modern web technologies, AI/ML, and cutting-edge development practices
          </p>
        </div>
        
        {/* Skills Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Technical Skills */}
          <SkillCategory 
            title="Core Technologies" 
            skillsList={technicalSkills} 
            icon="fas fa-code"
          />
          
          {/* AI/ML & Specialized Skills */}
          <SkillCategory 
            title="AI & Specialized" 
            skillsList={[...aiMlSkills, ...toolsSkills]} 
            icon="fas fa-robot"
          />
        </div>
        
        {/* Technology Icons Orbit */}
        <div className="mt-20 relative">
          <h3 className="text-2xl font-bold text-center mb-12">Technology Stack</h3>
          <div className="relative w-80 h-80 mx-auto three-d-container">
            {/* Center */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-primary rounded-full flex items-center justify-center animate-pulse-slow">
              <i className="fas fa-code text-primary-foreground text-xl"></i>
            </div>
            
            {/* Orbiting Technology Icons */}
            {skills.slice(0, 6).map((skill, index) => (
              <div 
                key={skill.id}
                className="absolute inset-0 animate-spin"
                style={{ 
                  animationDuration: `${20 + index * 3}s`,
                  animationDirection: index % 2 === 0 ? "normal" : "reverse"
                }}
              >
                <div 
                  className="absolute w-12 h-12 bg-card rounded-full flex items-center justify-center glass"
                  style={{
                    top: index % 2 === 0 ? "0" : index % 3 === 0 ? "75%" : "25%",
                    left: index % 3 === 0 ? "0" : index % 4 === 0 ? "75%" : "50%",
                    transform: "translate(-50%, -50%)"
                  }}
                >
                  {skill.icon && <i className={`${skill.icon} text-xl`} style={{ color: skill.color || undefined }}></i>}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* AI Skill Suggestions */}
        {skillSuggestions.length > 0 && (
          <div className="mt-16 text-center">
            <div className="glass rounded-2xl p-8 max-w-2xl mx-auto">
              <h4 className="text-xl font-semibold mb-4 flex items-center justify-center">
                <i className="fas fa-lightbulb text-accent mr-2"></i>
                AI-Suggested Learning Path
              </h4>
              <p className="text-muted-foreground mb-6">
                Based on current market trends and your existing skills, here are recommended areas for growth:
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {skillSuggestions.map((suggestion, index) => (
                  <span 
                    key={index}
                    className={`px-4 py-2 rounded-full text-sm animate-pulse ${
                      index % 2 === 0 ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent"
                    }`}
                    data-testid={`suggestion-${suggestion.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  >
                    {suggestion}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
