import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, Bot, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

type ChatbotProps = {
  onClose?: () => void;
};

const initialMessages: Message[] = [
  {
    id: 1,
    text: "Bonjour ! Je suis l'assistant Concours Prep. Comment puis-je vous aider aujourd'hui ?",
    sender: 'bot',
    timestamp: new Date(),
  }
];

const Chatbot = ({ onClose }: ChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate bot response after delay
    setTimeout(() => {
      const botResponses = [
        "Merci pour votre question ! Notre équipe va l'examiner et vous répondra dans les plus brefs délais.",
        "Je comprends votre demande. Pouvez-vous me donner plus de détails pour que je puisse mieux vous aider ?",
        "Excellente question ! La réponse se trouve dans notre FAQ, mais je peux vous expliquer davantage si nécessaire.",
        "Je vais transmettre votre demande à notre équipe de support qui pourra vous apporter une réponse plus détaillée.",
        "D'après ce que je comprends, vous avez besoin d'aide avec notre plateforme. Je vous suggère de consulter notre guide utilisateur."
      ];

      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const botMessage: Message = {
        id: messages.length + 2,
        text: randomResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setIsTyping(false);
      setMessages(prev => [...prev, botMessage]);
      
      toast({
        title: "Nouvelle réponse",
        description: "L'assistant a répondu à votre message",
        duration: 3000,
      });
    }, 1500);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-[500px] rounded-lg border border-border overflow-hidden">
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-muted/20">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={cn(
              "flex flex-col max-w-[80%]",
              message.sender === 'user' ? 'self-end ml-auto' : 'self-start mr-auto'
            )}
          >
            <div className={cn(
              "flex gap-2 mb-1",
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            )}>
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center",
                message.sender === 'user' 
                  ? 'bg-primary text-primary-foreground order-2' 
                  : 'bg-muted text-muted-foreground order-1'
              )}>
                {message.sender === 'user' 
                  ? <User className="h-3.5 w-3.5" /> 
                  : <Bot className="h-3.5 w-3.5" />}
              </div>
              <span className="text-xs text-muted-foreground">
                {formatTime(message.timestamp)}
              </span>
            </div>
            <div
              className={cn(
                "p-3 rounded-lg",
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground rounded-tr-none ml-auto'
                  : 'bg-muted border border-border text-foreground rounded-tl-none mr-auto'
              )}
            >
              {message.text}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex flex-col max-w-[80%] self-start mr-auto">
            <div className="flex gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                <Bot className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs text-muted-foreground">En train d'écrire...</span>
            </div>
            <div className="p-3 rounded-lg bg-muted border border-border text-foreground rounded-tl-none mr-auto">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse delay-75"></div>
                <div className="w-2 h-2 rounded-full bg-primary/80 animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="border-t p-3 flex gap-2 bg-background">
        <Textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Écrivez votre message..."
          className="min-h-[50px] max-h-[120px] flex-grow resize-none form-input text-sm py-2"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (newMessage.trim()) handleSendMessage(e);
            }
          }}
        />
        <Button type="submit" className="self-end btn-primary h-10 px-3" disabled={!newMessage.trim() || isTyping}>
          <Send className="h-4 w-4" />
          <span className="sr-only">Envoyer</span>
        </Button>
      </form>
    </div>
  );
};

export default Chatbot;
