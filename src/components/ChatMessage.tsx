import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  isTyping?: boolean;
}

export default function ChatMessage({ message, isUser, isTyping = false }: ChatMessageProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    setShowMessage(true);
    
    if (!isUser && !isTyping) {
      // Typing effect for bot messages
      let i = 0;
      const timer = setInterval(() => {
        if (i < message.length) {
          setDisplayedText(message.slice(0, i + 1));
          i++;
        } else {
          clearInterval(timer);
        }
      }, 30);
      
      return () => clearInterval(timer);
    } else {
      setDisplayedText(message);
    }
  }, [message, isUser, isTyping]);

  if (isTyping) {
    return (
      <div className={cn(
        "flex animate-slide-up",
        isUser ? "justify-end" : "justify-start"
      )}>
        <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl bg-gradient-to-r from-gray-50 to-white border border-gray-200">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-[rgb(99,193,243)] rounded-full animate-typing"></div>
            <div className="w-2 h-2 bg-[rgb(99,193,243)] rounded-full animate-typing [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 bg-[rgb(99,193,243)] rounded-full animate-typing [animation-delay:0.4s]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex transition-all duration-300",
      showMessage ? "animate-slide-up" : "opacity-0",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105",
        isUser 
          ? "bg-gradient-to-r from-[rgb(29,35,62)] to-[rgb(42,49,87)] text-white" 
          : "bg-gradient-to-r from-gray-50 to-white text-[rgb(29,35,62)] border border-gray-200"
      )}>
        <p className="text-sm leading-relaxed font-medium">
          {isUser ? message : displayedText}
          {!isUser && displayedText.length < message.length && (
            <span className="inline-block w-2 h-4 bg-[rgb(99,193,243)] ml-1 animate-pulse" />
          )}
        </p>
      </div>
    </div>
  );
}