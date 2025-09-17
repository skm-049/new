import { useQuery } from "@tanstack/react-query";
import type { Experience } from "@shared/schema";

export default function ExperienceSection() {
  const { data: experiences = [] } = useQuery<Experience[]>({
    queryKey: ["/api/portfolio/experiences"],
    retry: false,
  });

  return (
    <section id="experience" className="py-20 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent" data-testid="text-experience-title">
            Professional Journey
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-experience-subtitle">
            A timeline of my professional growth, achievements, and contributions to innovative projects
          </p>
        </div>
        
        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary via-accent to-primary rounded-full opacity-30"></div>
          
          <div className="space-y-16">
            {experiences.length === 0 ? (
              <div className="text-center py-12">
                <i className="fas fa-briefcase text-4xl text-muted-foreground mb-4"></i>
                <p className="text-lg text-muted-foreground">No experience data available.</p>
              </div>
            ) : (
              experiences.map((experience, index) => (
                <div key={experience.id} className="relative flex flex-col lg:flex-row items-center justify-between" data-testid={`experience-${experience.id}`}>
                  {/* Timeline Node */}
                  <div className={`absolute left-1/2 transform -translate-x-1/2 w-6 h-6 ${index % 2 === 0 ? 'bg-primary' : 'bg-accent'} rounded-full border-4 border-background z-10 animate-pulse`}></div>
                  
                  {/* Content - Alternating left/right layout */}
                  {index % 2 === 0 ? (
                    <>
                      {/* Content Left */}
                      <div className="lg:w-5/12 mb-8 lg:mb-0 lg:text-right">
                        <div className="glass rounded-2xl p-6 hover:scale-105 transform transition-all duration-300">
                          <div className="flex flex-col lg:items-end">
                            <span className="text-accent text-sm font-semibold mb-2" data-testid={`experience-date-${experience.id}`}>
                              {new Date(experience.startDate).getFullYear()} - {experience.current ? 'Present' : new Date(experience.endDate!).getFullYear()}
                            </span>
                            <h3 className="text-2xl font-bold mb-2" data-testid={`experience-title-${experience.id}`}>{experience.title}</h3>
                            <h4 className="text-lg text-primary mb-4" data-testid={`experience-company-${experience.id}`}>{experience.company}</h4>
                            {experience.location && (
                              <p className="text-sm text-muted-foreground mb-4" data-testid={`experience-location-${experience.id}`}>{experience.location}</p>
                            )}
                            <p className="text-muted-foreground mb-4 leading-relaxed" data-testid={`experience-description-${experience.id}`}>
                              {experience.description}
                            </p>
                            <div className="flex flex-wrap justify-end gap-2">
                              {experience.technologies.map((tech, techIndex) => (
                                <span key={techIndex} className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full" data-testid={`experience-tech-${tech.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                                  {tech}
                                </span>
                              ))}
                            </div>
                            {experience.achievements && experience.achievements.length > 0 && (
                              <div className="mt-4 text-sm">
                                <strong>Key Achievements:</strong>
                                <ul className="list-disc list-inside mt-2 text-muted-foreground">
                                  {experience.achievements.map((achievement, achIndex) => (
                                    <li key={achIndex} data-testid={`experience-achievement-${achIndex}`}>{achievement}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Empty space for alternating layout */}
                      <div className="lg:w-5/12"></div>
                    </>
                  ) : (
                    <>
                      {/* Empty space for alternating layout */}
                      <div className="lg:w-5/12"></div>
                      
                      {/* Content Right */}
                      <div className="lg:w-5/12 mb-8 lg:mb-0">
                        <div className="glass rounded-2xl p-6 hover:scale-105 transform transition-all duration-300">
                          <div className="flex flex-col">
                            <span className="text-accent text-sm font-semibold mb-2" data-testid={`experience-date-${experience.id}`}>
                              {new Date(experience.startDate).getFullYear()} - {experience.current ? 'Present' : new Date(experience.endDate!).getFullYear()}
                            </span>
                            <h3 className="text-2xl font-bold mb-2" data-testid={`experience-title-${experience.id}`}>{experience.title}</h3>
                            <h4 className="text-lg text-primary mb-4" data-testid={`experience-company-${experience.id}`}>{experience.company}</h4>
                            {experience.location && (
                              <p className="text-sm text-muted-foreground mb-4" data-testid={`experience-location-${experience.id}`}>{experience.location}</p>
                            )}
                            <p className="text-muted-foreground mb-4 leading-relaxed" data-testid={`experience-description-${experience.id}`}>
                              {experience.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {experience.technologies.map((tech, techIndex) => (
                                <span key={techIndex} className="px-3 py-1 bg-accent/20 text-accent text-xs rounded-full" data-testid={`experience-tech-${tech.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                                  {tech}
                                </span>
                              ))}
                            </div>
                            {experience.achievements && experience.achievements.length > 0 && (
                              <div className="mt-4 text-sm">
                                <strong>Key Achievements:</strong>
                                <ul className="list-disc list-inside mt-2 text-muted-foreground">
                                  {experience.achievements.map((achievement, achIndex) => (
                                    <li key={achIndex} data-testid={`experience-achievement-${achIndex}`}>{achievement}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Career Stats */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center glass rounded-2xl p-6">
            <div className="text-4xl font-bold text-primary mb-2" data-testid="stat-years-experience">
              {experiences.length > 0 ? `${Math.max(1, new Date().getFullYear() - Math.min(...experiences.map(exp => new Date(exp.startDate).getFullYear())))}+` : '0'}
            </div>
            <div className="text-muted-foreground">Years Experience</div>
          </div>
          <div className="text-center glass rounded-2xl p-6">
            <div className="text-4xl font-bold text-accent mb-2" data-testid="stat-projects-completed">50+</div>
            <div className="text-muted-foreground">Projects Completed</div>
          </div>
          <div className="text-center glass rounded-2xl p-6">
            <div className="text-4xl font-bold text-primary mb-2" data-testid="stat-happy-clients">30+</div>
            <div className="text-muted-foreground">Happy Clients</div>
          </div>
          <div className="text-center glass rounded-2xl p-6">
            <div className="text-4xl font-bold text-accent mb-2" data-testid="stat-awards-won">10+</div>
            <div className="text-muted-foreground">Awards Won</div>
          </div>
        </div>
      </div>
    </section>
  );
}
