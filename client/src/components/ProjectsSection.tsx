import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";

export default function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["/api/portfolio/projects"],
    retry: false,
  });

  const categories = ["All", ...Array.from(new Set(projects.map(project => project.category)))];

  const filteredProjects = useMemo(() => {
    let filtered = projects;

    if (activeFilter !== "All") {
      filtered = filtered.filter(project => project.category === activeFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered;
  }, [projects, activeFilter, searchTerm]);

  return (
    <section id="projects" className="py-20 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent" data-testid="text-projects-title">
            Featured Projects
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-projects-subtitle">
            A showcase of innovative applications built with cutting-edge technologies and AI integration
          </p>
        </div>
        
        {/* Project Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeFilter === category ? "default" : "outline"}
              onClick={() => setActiveFilter(category)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                activeFilter === category 
                  ? "bg-primary text-primary-foreground" 
                  : "glass hover:bg-primary/20"
              }`}
              data-testid={`filter-${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
            >
              {category}
            </Button>
          ))}
        </div>
        
        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-card border border-border rounded-full focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              data-testid="input-search-projects"
            />
            <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"></i>
          </div>
        </div>
        
        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <i className="fas fa-search text-4xl text-muted-foreground mb-4"></i>
              <p className="text-lg text-muted-foreground">No projects found matching your criteria.</p>
            </div>
          ) : (
            filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group glass rounded-2xl p-6 hover:scale-105 transform transition-all duration-300 three-d-container"
                data-testid={`project-card-${project.id}`}
              >
                <div className="relative overflow-hidden rounded-xl mb-6">
                  <img
                    src={project.imageUrl || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"}
                    alt={`${project.title} Screenshot`}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    data-testid={`img-project-${project.id}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <div className="flex space-x-2">
                      <span className="px-2 py-1 bg-accent/80 text-accent-foreground text-xs rounded-full">
                        {project.category}
                      </span>
                      <span className="px-2 py-1 bg-primary/80 text-primary-foreground text-xs rounded-full">
                        {project.year}
                      </span>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-200" data-testid={`text-project-title-${project.id}`}>
                  {project.title}
                </h3>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed" data-testid={`text-project-description-${project.id}`}>
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, index) => (
                    <span 
                      key={index} 
                      className="px-2 py-1 bg-muted text-xs rounded"
                      data-testid={`tag-tech-${tech.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex space-x-3">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-accent transition-colors duration-200"
                        title="Live Demo"
                        data-testid={`link-live-${project.id}`}
                      >
                        <i className="fas fa-external-link-alt"></i>
                      </a>
                    )}
                    {project.sourceUrl && (
                      <a
                        href={project.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-accent transition-colors duration-200"
                        title="Source Code"
                        data-testid={`link-source-${project.id}`}
                      >
                        <i className="fab fa-github"></i>
                      </a>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground" data-testid={`text-project-year-${project.id}`}>
                    {project.year}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* View More Button */}
        <div className="text-center mt-12">
          <Button 
            variant="outline"
            className="glass px-8 py-4 rounded-full hover:bg-primary/20 transition-all duration-200 font-semibold"
            onClick={() => window.open("#", "_blank")}
            data-testid="button-view-all-projects"
          >
            <i className="fab fa-github mr-2"></i>
            View All Projects on GitHub
          </Button>
        </div>
      </div>
    </section>
  );
}
