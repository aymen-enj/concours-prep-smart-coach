import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';
import Chatbot from './Chatbot'; // Assuming Chatbot component is in the same directory
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const FloatingChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const toggleChat = () => {
    // If we are already on the support page and the chat is closed, we can redirect to the chatbot tab
    if (location.pathname === '/support' && !isOpen) {
      navigate('/support', { state: { defaultTab: 'chatbot' } });
      toast({
        title: "Assistant Concours Prep",
        description: "Nous sommes là pour vous aider"
      });
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <>
      {/* 
        ROBUST STYLE FIX:
        This <style> block directly injects CSS rules for our button container.
        - It uses an ID (#floating-chat-container) for high specificity.
        - It uses "!important" to override any other conflicting styles from other files.
        - This ensures the correct positioning on both mobile and desktop.
      */}
      <style>
        {`
          #floating-chat-container {
            position: fixed;
            bottom: 16px; /* 1rem, for mobile */
            right: 16px !important; /* Force position for mobile */
            z-index: 50;
          }

          @media (min-width: 768px) {
            #floating-chat-container {
              bottom: 24px; /* 1.5rem, for desktop */
              right: 24px !important; /* Restore position for desktop */
            }
          }
        `}
      </style>

      {/* 
        We add the ID to this div so the <style> block can target it.
        We remove the positioning classes (bottom-*, right-*) as they are now handled by the style block.
      */}
      <div id="floating-chat-container">
        
        {isOpen && location.pathname !== '/support' && (
          <div className="mb-4 w-full max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden animate-fade-in">
            <div className="p-0">
              <Chatbot onClose={() => setIsOpen(false)} />
            </div>
          </div>
        )}
        
        <Button
          onClick={toggleChat}
          size="icon"
          className={`rounded-full w-14 h-14 shadow-lg ${
            isOpen ? 'bg-gray-600 hover:bg-gray-700' : 'bg-royal-blue hover:bg-blue-700'
          } transition-colors duration-200`}
          aria-label="Assistant"
        >
          {isOpen && location.pathname !== '/support' ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircle className="h-6 w-6" />
          )}
        </Button>

      </div>
    </>
  );
};

export default FloatingChatButton;