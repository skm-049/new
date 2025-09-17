import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import type { Project, Skill, Experience, ContactMessage, PersonalInfo } from "@shared/schema";

export default function Admin() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: messages } = useQuery<ContactMessage[]>({
    queryKey: ["/api/admin/messages"],
    retry: false,
  });

  const { data: projects } = useQuery<Project[]>({
    queryKey: ["/api/portfolio/projects"],
    retry: false,
  });

  const { data: skills } = useQuery<Skill[]>({
    queryKey: ["/api/portfolio/skills"],
    retry: false,
  });

  const { data: experiences } = useQuery<Experience[]>({
    queryKey: ["/api/portfolio/experiences"],
    retry: false,
  });

  const { data: personalInfo } = useQuery<PersonalInfo>({
    queryKey: ["/api/portfolio/info"],
    retry: false,
  });

  // Project form state
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    liveUrl: "",
    sourceUrl: "",
    technologies: "",
    category: "",
    year: new Date().getFullYear(),
    featured: false,
  });

  // Skill form state
  const [skillForm, setSkillForm] = useState({
    name: "",
    category: "technical",
    proficiency: 50,
    icon: "",
    color: "#3b82f6",
  });

  // Experience form state
  const [experienceForm, setExperienceForm] = useState({
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
    technologies: "",
    achievements: "",
  });

  // Personal info form state
  const [personalInfoForm, setPersonalInfoForm] = useState({
    name: personalInfo?.name || "",
    title: personalInfo?.title || "",
    bio: personalInfo?.bio || "",
    location: personalInfo?.location || "",
    email: personalInfo?.email || "",
    phone: personalInfo?.phone || "",
    profileImageUrl: personalInfo?.profileImageUrl || "",
    resumeUrl: personalInfo?.resumeUrl || "",
    socialLinks: JSON.stringify(personalInfo?.socialLinks || {}),
    interests: Array.isArray(personalInfo?.interests) ? personalInfo.interests.join(", ") : "",
  });

  // Update personal info form when data loads
  useEffect(() => {
    if (personalInfo) {
      setPersonalInfoForm({
        name: personalInfo.name || "",
        title: personalInfo.title || "",
        bio: personalInfo.bio || "",
        location: personalInfo.location || "",
        email: personalInfo.email || "",
        phone: personalInfo.phone || "",
        profileImageUrl: personalInfo.profileImageUrl || "",
        resumeUrl: personalInfo.resumeUrl || "",
        socialLinks: JSON.stringify(personalInfo.socialLinks || {}),
        interests: Array.isArray(personalInfo.interests) ? personalInfo.interests.join(", ") : "",
      });
    }
  }, [personalInfo]);

  // Mutations
  const createProjectMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/admin/projects", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio/projects"] });
      setProjectForm({
        title: "",
        description: "",
        imageUrl: "",
        liveUrl: "",
        sourceUrl: "",
        technologies: "",
        category: "",
        year: new Date().getFullYear(),
        featured: false,
      });
      toast({ title: "Project created successfully" });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({ title: "Error creating project", variant: "destructive" });
    },
  });

  const createSkillMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/admin/skills", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio/skills"] });
      setSkillForm({
        name: "",
        category: "technical",
        proficiency: 50,
        icon: "",
        color: "#3b82f6",
      });
      toast({ title: "Skill created successfully" });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({ title: "Error creating skill", variant: "destructive" });
    },
  });

  const createExperienceMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/admin/experiences", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio/experiences"] });
      setExperienceForm({
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
        technologies: "",
        achievements: "",
      });
      toast({ title: "Experience created successfully" });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({ title: "Error creating experience", variant: "destructive" });
    },
  });

  const updatePersonalInfoMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("PUT", "/api/admin/personal-info", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio/info"] });
      toast({ title: "Personal info updated successfully" });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({ title: "Error updating personal info", variant: "destructive" });
    },
  });

  const handleCreateProject = () => {
    const data = {
      ...projectForm,
      technologies: projectForm.technologies.split(",").map(t => t.trim()),
    };
    createProjectMutation.mutate(data);
  };

  const handleCreateSkill = () => {
    createSkillMutation.mutate(skillForm);
  };

  const handleCreateExperience = () => {
    const data = {
      ...experienceForm,
      startDate: new Date(experienceForm.startDate),
      endDate: experienceForm.endDate ? new Date(experienceForm.endDate) : null,
      technologies: experienceForm.technologies.split(",").map(t => t.trim()),
      achievements: experienceForm.achievements.split(",").map(a => a.trim()).filter(Boolean),
    };
    createExperienceMutation.mutate(data);
  };

  const handleUpdatePersonalInfo = () => {
    try {
      const data = {
        ...personalInfoForm,
        socialLinks: JSON.parse(personalInfoForm.socialLinks),
        interests: personalInfoForm.interests.split(",").map(i => i.trim()).filter(Boolean),
      };
      updatePersonalInfoMutation.mutate(data);
    } catch (error) {
      toast({ title: "Invalid JSON in social links", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <div className="flex space-x-4">
            <Link href="/">
              <Button variant="outline" data-testid="button-back-home">
                <i className="fas fa-home mr-2"></i>
                Back to Portfolio
              </Button>
            </Link>
            <Button variant="outline" onClick={() => window.location.href = "/api/logout"} data-testid="button-logout">
              <i className="fas fa-sign-out-alt mr-2"></i>
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="personal" data-testid="tab-personal">Personal Info</TabsTrigger>
            <TabsTrigger value="projects" data-testid="tab-projects">Projects</TabsTrigger>
            <TabsTrigger value="skills" data-testid="tab-skills">Skills</TabsTrigger>
            <TabsTrigger value="experience" data-testid="tab-experience">Experience</TabsTrigger>
            <TabsTrigger value="messages" data-testid="tab-messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <i className="fas fa-project-diagram text-primary mr-2"></i>
                    Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary" data-testid="text-projects-count">
                    {projects?.length || 0}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <i className="fas fa-code text-accent mr-2"></i>
                    Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent" data-testid="text-skills-count">
                    {skills?.length || 0}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <i className="fas fa-briefcase text-primary mr-2"></i>
                    Experiences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary" data-testid="text-experiences-count">
                    {experiences?.length || 0}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <i className="fas fa-envelope text-accent mr-2"></i>
                    Messages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent" data-testid="text-messages-count">
                    {messages?.length || 0}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messages?.slice(0, 5).map((message) => (
                    <div key={message.id} className="border-l-4 border-primary pl-4" data-testid={`message-${message.id}`}>
                      <div className="font-semibold">{message.firstName} {message.lastName}</div>
                      <div className="text-sm text-muted-foreground">{message.email}</div>
                      <div className="text-sm">{message.subject}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(message.createdAt!).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={personalInfoForm.name}
                      onChange={(e) => setPersonalInfoForm({ ...personalInfoForm, name: e.target.value })}
                      data-testid="input-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={personalInfoForm.title}
                      onChange={(e) => setPersonalInfoForm({ ...personalInfoForm, title: e.target.value })}
                      data-testid="input-title"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={personalInfoForm.bio}
                    onChange={(e) => setPersonalInfoForm({ ...personalInfoForm, bio: e.target.value })}
                    rows={4}
                    data-testid="input-bio"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={personalInfoForm.location}
                      onChange={(e) => setPersonalInfoForm({ ...personalInfoForm, location: e.target.value })}
                      data-testid="input-location"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={personalInfoForm.email}
                      onChange={(e) => setPersonalInfoForm({ ...personalInfoForm, email: e.target.value })}
                      data-testid="input-email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={personalInfoForm.phone}
                      onChange={(e) => setPersonalInfoForm({ ...personalInfoForm, phone: e.target.value })}
                      data-testid="input-phone"
                    />
                  </div>
                  <div>
                    <Label htmlFor="profileImageUrl">Profile Image URL</Label>
                    <Input
                      id="profileImageUrl"
                      value={personalInfoForm.profileImageUrl}
                      onChange={(e) => setPersonalInfoForm({ ...personalInfoForm, profileImageUrl: e.target.value })}
                      data-testid="input-profile-image"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="socialLinks">Social Links (JSON)</Label>
                  <Textarea
                    id="socialLinks"
                    value={personalInfoForm.socialLinks}
                    onChange={(e) => setPersonalInfoForm({ ...personalInfoForm, socialLinks: e.target.value })}
                    rows={3}
                    placeholder='{"github": "https://github.com/...", "linkedin": "https://linkedin.com/..."}'
                    data-testid="input-social-links"
                  />
                </div>

                <div>
                  <Label htmlFor="interests">Interests (comma-separated)</Label>
                  <Input
                    id="interests"
                    value={personalInfoForm.interests}
                    onChange={(e) => setPersonalInfoForm({ ...personalInfoForm, interests: e.target.value })}
                    placeholder="AI Research, Photography, Rock Climbing"
                    data-testid="input-interests"
                  />
                </div>

                <Button
                  onClick={handleUpdatePersonalInfo}
                  disabled={updatePersonalInfoMutation.isPending}
                  data-testid="button-update-personal-info"
                >
                  {updatePersonalInfoMutation.isPending ? "Updating..." : "Update Personal Info"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Project</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="projectTitle">Title</Label>
                    <Input
                      id="projectTitle"
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      data-testid="input-project-title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="projectCategory">Category</Label>
                    <Input
                      id="projectCategory"
                      value={projectForm.category}
                      onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                      placeholder="AI/ML, Full Stack, 3D/Graphics, etc."
                      data-testid="input-project-category"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="projectDescription">Description</Label>
                  <Textarea
                    id="projectDescription"
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    rows={3}
                    data-testid="input-project-description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="projectImageUrl">Image URL</Label>
                    <Input
                      id="projectImageUrl"
                      value={projectForm.imageUrl}
                      onChange={(e) => setProjectForm({ ...projectForm, imageUrl: e.target.value })}
                      data-testid="input-project-image"
                    />
                  </div>
                  <div>
                    <Label htmlFor="projectLiveUrl">Live URL</Label>
                    <Input
                      id="projectLiveUrl"
                      value={projectForm.liveUrl}
                      onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                      data-testid="input-project-live-url"
                    />
                  </div>
                  <div>
                    <Label htmlFor="projectSourceUrl">Source URL</Label>
                    <Input
                      id="projectSourceUrl"
                      value={projectForm.sourceUrl}
                      onChange={(e) => setProjectForm({ ...projectForm, sourceUrl: e.target.value })}
                      data-testid="input-project-source-url"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="projectTechnologies">Technologies (comma-separated)</Label>
                    <Input
                      id="projectTechnologies"
                      value={projectForm.technologies}
                      onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                      placeholder="React, Node.js, MongoDB"
                      data-testid="input-project-technologies"
                    />
                  </div>
                  <div>
                    <Label htmlFor="projectYear">Year</Label>
                    <Input
                      id="projectYear"
                      type="number"
                      value={projectForm.year}
                      onChange={(e) => setProjectForm({ ...projectForm, year: parseInt(e.target.value) })}
                      data-testid="input-project-year"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleCreateProject}
                  disabled={createProjectMutation.isPending}
                  data-testid="button-create-project"
                >
                  {createProjectMutation.isPending ? "Creating..." : "Create Project"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Existing Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects?.map((project) => (
                    <div key={project.id} className="border rounded-lg p-4" data-testid={`project-${project.id}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{project.title}</h3>
                          <p className="text-sm text-muted-foreground">{project.category} • {project.year}</p>
                          <p className="text-sm mt-2">{project.description}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {project.technologies.map((tech, index) => (
                              <span key={index} className="px-2 py-1 bg-muted text-xs rounded">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Skill</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="skillName">Skill Name</Label>
                    <Input
                      id="skillName"
                      value={skillForm.name}
                      onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                      data-testid="input-skill-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="skillCategory">Category</Label>
                    <select
                      id="skillCategory"
                      value={skillForm.category}
                      onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md"
                      data-testid="select-skill-category"
                    >
                      <option value="technical">Technical</option>
                      <option value="ai_ml">AI/ML</option>
                      <option value="tools">Tools</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="skillProficiency">Proficiency (1-100)</Label>
                    <Input
                      id="skillProficiency"
                      type="number"
                      min="1"
                      max="100"
                      value={skillForm.proficiency}
                      onChange={(e) => setSkillForm({ ...skillForm, proficiency: parseInt(e.target.value) })}
                      data-testid="input-skill-proficiency"
                    />
                  </div>
                  <div>
                    <Label htmlFor="skillIcon">Icon (CSS class)</Label>
                    <Input
                      id="skillIcon"
                      value={skillForm.icon}
                      onChange={(e) => setSkillForm({ ...skillForm, icon: e.target.value })}
                      placeholder="fab fa-react"
                      data-testid="input-skill-icon"
                    />
                  </div>
                  <div>
                    <Label htmlFor="skillColor">Color</Label>
                    <Input
                      id="skillColor"
                      type="color"
                      value={skillForm.color}
                      onChange={(e) => setSkillForm({ ...skillForm, color: e.target.value })}
                      data-testid="input-skill-color"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleCreateSkill}
                  disabled={createSkillMutation.isPending}
                  data-testid="button-create-skill"
                >
                  {createSkillMutation.isPending ? "Creating..." : "Create Skill"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Existing Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {skills?.map((skill) => (
                    <div key={skill.id} className="border rounded-lg p-4" data-testid={`skill-${skill.id}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {skill.icon && <i className={`${skill.icon} mr-2`} style={{ color: skill.color || undefined }}></i>}
                          <span className="font-semibold">{skill.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{skill.proficiency}%</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{skill.category}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="experienceTitle">Job Title</Label>
                    <Input
                      id="experienceTitle"
                      value={experienceForm.title}
                      onChange={(e) => setExperienceForm({ ...experienceForm, title: e.target.value })}
                      data-testid="input-experience-title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="experienceCompany">Company</Label>
                    <Input
                      id="experienceCompany"
                      value={experienceForm.company}
                      onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })}
                      data-testid="input-experience-company"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="experienceLocation">Location</Label>
                    <Input
                      id="experienceLocation"
                      value={experienceForm.location}
                      onChange={(e) => setExperienceForm({ ...experienceForm, location: e.target.value })}
                      data-testid="input-experience-location"
                    />
                  </div>
                  <div>
                    <Label htmlFor="experienceStartDate">Start Date</Label>
                    <Input
                      id="experienceStartDate"
                      type="date"
                      value={experienceForm.startDate}
                      onChange={(e) => setExperienceForm({ ...experienceForm, startDate: e.target.value })}
                      data-testid="input-experience-start-date"
                    />
                  </div>
                  <div>
                    <Label htmlFor="experienceEndDate">End Date</Label>
                    <Input
                      id="experienceEndDate"
                      type="date"
                      value={experienceForm.endDate}
                      onChange={(e) => setExperienceForm({ ...experienceForm, endDate: e.target.value })}
                      disabled={experienceForm.current}
                      data-testid="input-experience-end-date"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="experienceCurrent"
                    checked={experienceForm.current}
                    onChange={(e) => setExperienceForm({ ...experienceForm, current: e.target.checked })}
                    data-testid="checkbox-experience-current"
                  />
                  <Label htmlFor="experienceCurrent">Current Position</Label>
                </div>

                <div>
                  <Label htmlFor="experienceDescription">Description</Label>
                  <Textarea
                    id="experienceDescription"
                    value={experienceForm.description}
                    onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })}
                    rows={3}
                    data-testid="input-experience-description"
                  />
                </div>

                <div>
                  <Label htmlFor="experienceTechnologies">Technologies (comma-separated)</Label>
                  <Input
                    id="experienceTechnologies"
                    value={experienceForm.technologies}
                    onChange={(e) => setExperienceForm({ ...experienceForm, technologies: e.target.value })}
                    placeholder="React, Node.js, AWS"
                    data-testid="input-experience-technologies"
                  />
                </div>

                <div>
                  <Label htmlFor="experienceAchievements">Achievements (comma-separated)</Label>
                  <Textarea
                    id="experienceAchievements"
                    value={experienceForm.achievements}
                    onChange={(e) => setExperienceForm({ ...experienceForm, achievements: e.target.value })}
                    rows={2}
                    placeholder="Increased performance by 40%, Led team of 5 developers"
                    data-testid="input-experience-achievements"
                  />
                </div>

                <Button
                  onClick={handleCreateExperience}
                  disabled={createExperienceMutation.isPending}
                  data-testid="button-create-experience"
                >
                  {createExperienceMutation.isPending ? "Creating..." : "Create Experience"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Existing Experiences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {experiences?.map((experience) => (
                    <div key={experience.id} className="border rounded-lg p-4" data-testid={`experience-${experience.id}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{experience.title}</h3>
                          <p className="text-sm text-muted-foreground">{experience.company} • {experience.location}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(experience.startDate).toLocaleDateString()} - 
                            {experience.current ? " Present" : new Date(experience.endDate!).toLocaleDateString()}
                          </p>
                          <p className="text-sm mt-2">{experience.description}</p>
                          {experience.technologies && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {experience.technologies.map((tech, index) => (
                                <span key={index} className="px-2 py-1 bg-muted text-xs rounded">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messages?.map((message) => (
                    <div key={message.id} className="border rounded-lg p-4" data-testid={`message-${message.id}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{message.firstName} {message.lastName}</h3>
                          <p className="text-sm text-muted-foreground">{message.email}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">
                            {new Date(message.createdAt!).toLocaleDateString()}
                          </div>
                          {message.sentiment && (
                            <div className={`text-xs px-2 py-1 rounded mt-1 ${
                              message.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                              message.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {message.sentiment} ({message.sentimentScore}/5)
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="mb-2">
                        <strong>Subject:</strong> {message.subject}
                      </div>
                      
                      <div className="mb-4">
                        <strong>Message:</strong>
                        <p className="mt-1">{message.message}</p>
                      </div>
                      
                      {message.aiResponse && (
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <strong className="text-sm">AI Response:</strong>
                          <p className="text-sm mt-1">{message.aiResponse}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
