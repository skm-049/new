import { useQuery } from "@tanstack/react-query";
import type { PersonalInfo } from "@shared/schema";

export default function AboutSection() {
  const { data: personalInfo } = useQuery<PersonalInfo>({
    queryKey: ["/api/portfolio/info"],
    retry: false,
  });

  return (
    <section id="about" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent" data-testid="text-about-title">
            About Me
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-about-subtitle">
            Passionate developer with a mission to create innovative solutions that make a difference
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Personal Photo & Info */}
          <div className="space-y-8">
            {/* Professional photo */}
            <div className="relative">
              <img 
                src={personalInfo?.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"} 
                alt={`${personalInfo?.name || 'Alex Chen'} in professional setting`} 
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
                data-testid="img-about-professional"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl"></div>
            </div>
            
            {/* Personal Details */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-2xl font-bold mb-4">Personal Details</h3>
              <div className="space-y-3 text-muted-foreground">
                {personalInfo?.location && (
                  <div className="flex items-center">
                    <i className="fas fa-map-marker-alt text-primary w-5 mr-3"></i>
                    <span data-testid="text-location">{personalInfo.location}</span>
                  </div>
                )}
                {personalInfo?.email && (
                  <div className="flex items-center">
                    <i className="fas fa-envelope text-primary w-5 mr-3"></i>
                    <span data-testid="text-email">{personalInfo.email}</span>
                  </div>
                )}
                {personalInfo?.phone && (
                  <div className="flex items-center">
                    <i className="fas fa-phone text-primary w-5 mr-3"></i>
                    <span data-testid="text-phone">{personalInfo.phone}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <i className="fas fa-graduation-cap text-primary w-5 mr-3"></i>
                  <span>MS Computer Science, Stanford University</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bio & Achievements */}
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-bold mb-6">My Story</h3>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                {personalInfo?.bio ? (
                  <div data-testid="text-bio">
                    {personalInfo.bio.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4">{paragraph}</p>
                    ))}
                  </div>
                ) : (
                  <div>
                    <p>
                      I'm a passionate full-stack developer with extensive experience building innovative web applications and AI-powered solutions. My journey began with a curiosity for how things work, which led me to discover the world of programming during my computer science studies.
                    </p>
                    <p>
                      What drives me is the intersection of technology and human experience. I believe that great software should not only solve problems but also delight users with intuitive interfaces and seamless interactions. This philosophy guides my work, whether I'm architecting complex backend systems or crafting engaging frontend experiences.
                    </p>
                    <p>
                      When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, or mentoring aspiring developers. I'm particularly excited about the potential of AI to transform how we build and interact with software.
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Interests & Hobbies */}
            {personalInfo?.interests && personalInfo.interests.length > 0 && (
              <div className="glass rounded-2xl p-6">
                <h4 className="text-xl font-bold mb-4 flex items-center">
                  <i className="fas fa-heart text-accent mr-2"></i>
                  Interests & Hobbies
                </h4>
                <div className="flex flex-wrap gap-3">
                  {personalInfo.interests.map((interest, index) => (
                    <span 
                      key={index}
                      className={`px-4 py-2 rounded-full text-sm ${
                        index % 2 === 0 ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent'
                      }`}
                      data-testid={`interest-${interest.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Values */}
            <div className="space-y-4">
              <h4 className="text-xl font-bold">Core Values</h4>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <div>
                    <strong className="text-primary">Innovation</strong> - Always seeking new and better ways to solve problems
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <div>
                    <strong className="text-accent">Quality</strong> - Commitment to excellence in every line of code
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <div>
                    <strong className="text-primary">Collaboration</strong> - Believing in the power of teamwork and knowledge sharing
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Fun Facts & 3D Infographics */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-center mb-12">Fun Facts & Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center glass rounded-2xl p-8 hover:scale-105 transform transition-all duration-300">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
                <i className="fas fa-coffee text-primary text-2xl"></i>
              </div>
              <div className="text-3xl font-bold text-primary mb-2" data-testid="stat-coffee-cups">2,847</div>
              <div className="text-muted-foreground">Cups of Coffee</div>
            </div>
            
            <div className="text-center glass rounded-2xl p-8 hover:scale-105 transform transition-all duration-300">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-float" style={{ animationDelay: "1s" }}>
                <i className="fas fa-code text-accent text-2xl"></i>
              </div>
              <div className="text-3xl font-bold text-accent mb-2" data-testid="stat-lines-of-code">1M+</div>
              <div className="text-muted-foreground">Lines of Code</div>
            </div>
            
            <div className="text-center glass rounded-2xl p-8 hover:scale-105 transform transition-all duration-300">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-float" style={{ animationDelay: "2s" }}>
                <i className="fas fa-lightbulb text-primary text-2xl"></i>
              </div>
              <div className="text-3xl font-bold text-primary mb-2" data-testid="stat-ideas-implemented">127</div>
              <div className="text-muted-foreground">Ideas Implemented</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
