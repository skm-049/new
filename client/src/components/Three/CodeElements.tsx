import { useEffect, useRef } from "react";

export default function CodeElements() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create floating code elements with CSS transforms since Three.js would be complex to setup
    const createCodeElement = (content: string, size: string, color: string) => {
      const element = document.createElement("div");
      element.textContent = content;
      element.className = `absolute font-mono ${size} ${color} opacity-30 pointer-events-none`;
      element.style.fontFamily = "JetBrains Mono, monospace";
      
      // Random position
      element.style.left = `${Math.random() * 100}%`;
      element.style.top = `${Math.random() * 100}%`;
      
      // Random animation
      const duration = 10 + Math.random() * 20;
      element.style.animation = `float ${duration}s ease-in-out infinite, rotate-y ${duration * 2}s linear infinite`;
      
      return element;
    };

    const codeSnippets = [
      "const developer = { name: 'Alex', skills: ['React', 'AI'] }",
      "function innovate() { return creativity + technology; }",
      "if (problem) solve(problem);",
      "while (learning) { skills++; }",
      "import { future } from 'tomorrow';",
      "export default Excellence;",
      "<Component ai-powered />",
      "npm install innovation",
      "git commit -m 'Changed the world'",
      "console.log('Building the future...')"
    ];

    const elements: HTMLElement[] = [];

    // Create multiple floating elements
    for (let i = 0; i < 15; i++) {
      const snippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
      const sizes = ["text-xs", "text-sm", "text-base"];
      const colors = ["text-primary/30", "text-accent/30", "text-muted-foreground/20"];
      
      const element = createCodeElement(
        snippet,
        sizes[Math.floor(Math.random() * sizes.length)],
        colors[Math.floor(Math.random() * colors.length)]
      );
      
      elements.push(element);
      containerRef.current.appendChild(element);
      
      // Delay appearance
      setTimeout(() => {
        element.style.opacity = "0.4";
      }, i * 200);
    }

    // Cleanup
    return () => {
      elements.forEach(el => {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 three-d-container opacity-30 overflow-hidden"
      style={{ 
        perspective: "1000px",
        transformStyle: "preserve-3d"
      }}
    >
      {/* Static geometric elements for visual interest */}
      <div className="absolute top-1/4 left-1/4 w-16 h-16 border border-primary/50 rotate-45 rotate-y"></div>
      <div className="absolute top-3/4 right-1/4 w-12 h-12 border border-accent/50 rotate-12 animate-pulse-slow"></div>
      <div className="absolute top-1/2 left-3/4 w-8 h-8 bg-primary/30 rounded-full animate-float"></div>
      <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-accent/40 rotate-45 animate-float" style={{ animationDelay: "1s" }}></div>
      <div className="absolute bottom-1/4 left-1/3 w-10 h-10 border-2 border-primary/40 rounded-full animate-pulse-slow"></div>
    </div>
  );
}
