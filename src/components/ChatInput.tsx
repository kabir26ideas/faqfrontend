import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export default function ChatInput({ 
  onSendMessage, 
  isLoading, 
  placeholder = "Ask me anything..." 
}: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-2xl shadow-sm">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={isLoading}
          className={cn(
            "flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0",
            "text-base placeholder:text-gray-500 transition-all duration-300",
            "disabled:opacity-50"
          )}
        />
        <Button
          type="submit"
          disabled={!message.trim() || isLoading}
          size="sm"
          className={cn(
            "rounded-xl px-4 py-2 bg-gradient-to-r from-[rgb(29,35,62)] to-[rgb(42,49,87)] hover:from-[rgb(42,49,87)] hover:to-[rgb(29,35,62)] transition-all duration-300",
            "disabled:opacity-50 disabled:pointer-events-none",
            "active:scale-95 transform"
          )}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </form>
  );
}