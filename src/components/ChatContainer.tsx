import { useState, useRef, useEffect } from "react";
import { Bot, Sparkles, ExternalLink } from "lucide-react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatContainerProps {
  className?: string;
}

export default function ChatContainer({ className }: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hello! I'm here to help answer your questions. What would you like to know?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (messageText: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: messageText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Show typing indicator
    setTimeout(() => {
      setIsTyping(true);
    }, 500);

    try {
      const response = await fetch("https://thinkificbackend.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: messageText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Remove typing indicator
      setIsTyping(false);
      
      // Add bot response
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: data.reply || "I'm sorry, I didn't understand that. Could you please rephrase your question?",
        isUser: false,
        timestamp: new Date()
      };

      setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
      }, 300);

    } catch (error) {
      setIsTyping(false);
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: "I'm having trouble connecting right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Unable to connect to the chat service. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn(
      "flex flex-col h-full bg-white border border-gray-200 rounded-3xl shadow-xl overflow-hidden",
      className
    )}>
      {/* Header with 26ideas branding */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[rgb(29,35,62)] to-[rgb(42,49,87)] border-b">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Bot className="h-6 w-6 text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[rgb(99,193,243)] rounded-full border-2 border-white animate-pulse" />
          </div>
          <div>
            <h3 className="font-semibold text-white">26ideas FAQ Assistant</h3>
            <p className="text-xs text-blue-100">Powered by AI • Always here to help</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Sparkles className="h-4 w-4 text-[rgb(99,193,243)]" />
          <a 
            href="https://26ideas.com" 
            target="_parent"
            className="text-xs text-blue-100 hover:text-white transition-colors duration-200 flex items-center space-x-1"
          >
            <span>26ideas.com</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message.text}
            isUser={message.isUser}
          />
        ))}
        {isTyping && (
          <ChatMessage
            message=""
            isUser={false}
            isTyping={true}
          />
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-100">
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          placeholder="Ask me anything about our services..."
        />
      </div>
    </div>
  );
}