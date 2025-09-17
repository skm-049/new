import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import type { PersonalInfo } from "@shared/schema";

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

interface SentimentResponse {
  message: string;
  sentiment: {
    type: string;
    score: number;
    summary: string;
  };
  aiResponse: string;
}

export default function ContactSection() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sentimentData, setSentimentData] = useState<any>(null);
  const [aiResponse, setAiResponse] = useState<string>("");

  const { data: personalInfo } = useQuery<PersonalInfo>({
    queryKey: ["/api/portfolio/info"],
    retry: false,
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: (data: SentimentResponse) => {
      toast({ 
        title: "Message sent successfully!", 
        description: "Thank you for reaching out. I'll get back to you soon." 
      });
      setSentimentData(data.sentiment);
      setAiResponse(data.aiResponse);
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      });
    },
    onError: (error) => {
      toast({ 
        title: "Error sending message", 
        description: "Please try again or contact me directly.",
        variant: "destructive" 
      });
    },
  });

  // Real-time sentiment analysis simulation
  useEffect(() => {
    if (formData.message.length > 10) {
      const timeout = setTimeout(() => {
        // Simple sentiment simulation for UI feedback
        const positiveWords = ['great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'excited', 'interested'];
        const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'disappointed', 'frustrated'];
        
        const lowerMessage = formData.message.toLowerCase();
        const positiveCount = positiveWords.filter(word => lowerMessage.includes(word)).length;
        const negativeCount = negativeWords.filter(word => lowerMessage.includes(word)).length;
        
        let sentiment: string;
        let color: string;
        
        if (positiveCount > negativeCount) {
          sentiment = 'Positive sentiment detected - This sounds like an exciting opportunity!';
          color = 'bg-accent/20 text-accent';
        } else if (negativeCount > positiveCount) {
          sentiment = 'Concerned tone detected - Let me help address your challenges.';
          color = 'bg-destructive/20 text-destructive';
        } else {
          sentiment = 'Neutral tone - Professional inquiry detected.';
          color = 'bg-primary/20 text-primary';
        }
        
        setSentimentData({ sentiment, color });
      }, 1000);

      return () => clearTimeout(timeout);
    } else {
      setSentimentData(null);
    }
  }, [formData.message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="contact" className="py-20 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent" data-testid="text-contact-title">
            Let's Work Together
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-contact-subtitle">
            Ready to bring your ideas to life? Let's discuss your project and create something amazing together.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form with AI Features */}
          <div className="space-y-8">
            <div className="glass rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <i className="fas fa-envelope text-primary mr-3"></i>
                Send a Message
              </h3>
              
              {/* AI Sentiment Indicator */}
              {sentimentData && (
                <div className={`mb-4 p-3 rounded-lg ${sentimentData.color}`} data-testid="sentiment-indicator">
                  <div className="flex items-center text-sm">
                    <i className="fas fa-brain text-accent mr-2"></i>
                    <span>{sentimentData.sentiment}</span>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                      placeholder="John"
                      data-testid="input-first-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                      placeholder="Doe"
                      data-testid="input-last-name"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    placeholder="john@example.com"
                    data-testid="input-email"
                  />
                </div>
                
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <select
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={(e) => handleInputChange("subject", e.target.value)}
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    data-testid="select-subject"
                  >
                    <option value="">Select a subject</option>
                    <option value="project">New Project Inquiry</option>
                    <option value="collaboration">Collaboration Opportunity</option>
                    <option value="consultation">Technical Consultation</option>
                    <option value="job">Job Opportunity</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Tell me about your project or ideas..."
                    data-testid="textarea-message"
                  />
                  <div className="text-xs text-muted-foreground mt-2">
                    <i className="fas fa-robot mr-1"></i>
                    AI will analyze sentiment and provide smart suggestions
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="consent"
                    required
                    className="w-4 h-4 text-primary bg-card border border-border rounded focus:ring-2 focus:ring-primary"
                    data-testid="checkbox-consent"
                  />
                  <Label htmlFor="consent" className="ml-2 text-sm text-muted-foreground">
                    I agree to the <a href="#" className="text-primary hover:underline">Privacy Policy</a> and consent to data processing
                  </Label>
                </div>
                
                <Button
                  type="submit"
                  disabled={contactMutation.isPending}
                  className="w-full gradient-border px-8 py-4 rounded-lg text-primary-foreground font-semibold hover:scale-105 transform transition-all duration-200 bg-primary animate-glow"
                  data-testid="button-send-message"
                >
                  <i className="fas fa-paper-plane mr-2"></i>
                  {contactMutation.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
              
              {/* AI Response Preview */}
              {aiResponse && (
                <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20" data-testid="ai-response">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                      <i className="fas fa-robot text-accent text-sm"></i>
                    </div>
                    <div>
                      <div className="font-semibold text-accent mb-1">AI Assistant Response</div>
                      <div className="text-sm text-muted-foreground">{aiResponse}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Contact Information & Map */}
          <div className="space-y-8">
            {/* Contact Details */}
            <div className="glass rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <i className="fas fa-address-card text-accent mr-3"></i>
                Get in Touch
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                    <i className="fas fa-envelope text-primary"></i>
                  </div>
                  <div>
                    <div className="font-semibold">Email</div>
                    <div className="text-muted-foreground" data-testid="contact-email">
                      {personalInfo?.email || "alex.chen@email.com"}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                    <i className="fas fa-phone text-primary"></i>
                  </div>
                  <div>
                    <div className="font-semibold">Phone</div>
                    <div className="text-muted-foreground" data-testid="contact-phone">
                      {personalInfo?.phone || "+1 (555) 123-4567"}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                    <i className="fas fa-map-marker-alt text-primary"></i>
                  </div>
                  <div>
                    <div className="font-semibold">Location</div>
                    <div className="text-muted-foreground" data-testid="contact-location">
                      {personalInfo?.location || "San Francisco, CA"}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                    <i className="fas fa-clock text-primary"></i>
                  </div>
                  <div>
                    <div className="font-semibold">Response Time</div>
                    <div className="text-muted-foreground">Usually within 24 hours</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="glass rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">Connect With Me</h3>
              <div className="grid grid-cols-2 gap-4">
                <a href="#" className="flex items-center p-4 hover:bg-primary/10 rounded-lg transition-all duration-200" data-testid="link-github">
                  <i className="fab fa-github text-2xl text-primary mr-3"></i>
                  <div>
                    <div className="font-semibold">GitHub</div>
                    <div className="text-sm text-muted-foreground">@alexchen</div>
                  </div>
                </a>
                
                <a href="#" className="flex items-center p-4 hover:bg-primary/10 rounded-lg transition-all duration-200" data-testid="link-linkedin">
                  <i className="fab fa-linkedin text-2xl text-blue-400 mr-3"></i>
                  <div>
                    <div className="font-semibold">LinkedIn</div>
                    <div className="text-sm text-muted-foreground">Alex Chen</div>
                  </div>
                </a>
                
                <a href="#" className="flex items-center p-4 hover:bg-primary/10 rounded-lg transition-all duration-200" data-testid="link-twitter">
                  <i className="fab fa-twitter text-2xl text-blue-300 mr-3"></i>
                  <div>
                    <div className="font-semibold">Twitter</div>
                    <div className="text-sm text-muted-foreground">@alexchendev</div>
                  </div>
                </a>
                
                <a href="#" className="flex items-center p-4 hover:bg-primary/10 rounded-lg transition-all duration-200" data-testid="link-dribbble">
                  <i className="fab fa-dribbble text-2xl text-pink-400 mr-3"></i>
                  <div>
                    <div className="font-semibold">Dribbble</div>
                    <div className="text-sm text-muted-foreground">alexchen</div>
                  </div>
                </a>
              </div>
            </div>
            
            {/* Map Placeholder */}
            <div className="glass rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">Find Me</h3>
              <div className="w-full h-64 bg-muted rounded-lg relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
                  alt="San Francisco Bay Area map view" 
                  className="w-full h-full object-cover"
                  data-testid="img-map"
                />
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <div className="text-center text-white">
                    <i className="fas fa-map-marker-alt text-2xl mb-2"></i>
                    <div className="font-semibold" data-testid="text-map-location">
                      {personalInfo?.location || "San Francisco, CA"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
