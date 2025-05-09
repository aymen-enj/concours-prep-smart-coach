
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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

      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="bg-royal-blue text-white p-4 rounded-t-lg flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium">Assistant Concours Prep</h2>
            <p className="text-sm opacity-80">Nous sommes là pour vous aider</p>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-white hover:text-white/80 hover:bg-royal-blue/80">
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
        
        <div className="h-96 overflow-y-auto p-4 space-y-4 flex flex-col">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex flex-col max-w-[80%] ${
                message.sender === 'user' ? 'self-end' : 'self-start'
              }`}
            >
              <div
                className={`p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-royal-blue text-white rounded-br-none'
                    : 'bg-gray-200 text-gray-800 rounded-bl-none dark:bg-gray-700 dark:text-gray-200'
                }`}
              >
                {message.text}
              </div>
              <span className={`text-xs mt-1 ${
                message.sender === 'user' ? 'self-end' : 'self-start'
              } text-gray-500 dark:text-gray-400`}>
                {formatTime(message.timestamp)}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={handleSendMessage} className="border-t p-4 flex gap-2 dark:border-gray-700">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Tapez votre message..."
            className="min-h-[50px] flex-grow resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (newMessage.trim()) handleSendMessage(e);
              }
            }}
          />
          <Button type="submit" className="self-end" disabled={!newMessage.trim()}>
            Envoyer
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Chatbot;
