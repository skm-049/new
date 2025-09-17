import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  message: string;
  timestamp: Date;
}

interface ChatResponse {
  message: string;
  suggestions?: string[];
}

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      message: "Hi! I'm Alex's AI assistant. I can help you learn more about his skills, experience, or projects. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/ai/chat", { message });
      return response.json();
    },
    onSuccess: (data: ChatResponse) => {
      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        message: data.message,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    },
    onError: () => {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        message: "I apologize, but I cannot respond right now. Please try contacting Alex directly through the contact form.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  });

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    chatMutation.mutate(inputMessage);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl animate-pulse hover:animate-none transition-all duration-300"
            data-testid="button-open-chat"
          >
            <i className="fas fa-robot text-xl"></i>
          </Button>
        </div>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50" id="aiChatWidget" data-testid="ai-chat-widget">
          <div className="glass rounded-2xl shadow-2xl max-w-sm w-80 max-h-96 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center mr-3">
                    <i className="fas fa-robot text-accent"></i>
                  </div>
                  <div>
                    <div className="font-semibold">AI Assistant</div>
                    <div className="text-xs text-accent">Online</div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                  data-testid="button-close-chat"
                >
                  <i className="fas fa-times"></i>
                </Button>
              </div>
            </div>
            
            {/* Chat Messages */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-64" data-testid="chat-messages">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'items-start'}`}
                >
                  {message.type === 'ai' && (
                    <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                      <i className="fas fa-robot text-accent text-xs"></i>
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-lg text-sm max-w-xs ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                    data-testid={`message-${message.type}-${message.id}`}
                  >
                    {message.message}
                  </div>
                </div>
              ))}
              
              {chatMutation.isPending && (
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                    <i className="fas fa-robot text-accent text-xs"></i>
                  </div>
                  <div className="bg-muted p-3 rounded-lg text-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Quick Suggestions */}
            <div className="px-4 pb-2">
              <div className="flex flex-wrap gap-1">
                {['React experience', 'AI projects', 'Contact info', 'Latest work'].map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestionClick(`Tell me about Alex's ${suggestion.toLowerCase()}`)}
                    className="text-xs px-2 py-1 h-auto"
                    data-testid={`suggestion-${suggestion.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Chat Input */}
            <div className="p-4 border-t border-border/50">
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about Alex's skills..."
                  className="flex-1 px-3 py-2 bg-card border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={chatMutation.isPending}
                  data-testid="input-chat-message"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={chatMutation.isPending || !inputMessage.trim()}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  data-testid="button-send-chat"
                >
                  <i className="fas fa-paper-plane text-sm"></i>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
