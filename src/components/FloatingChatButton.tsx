
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';
import Chatbot from './Chatbot';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const FloatingChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const toggleChat = () => {
    // Si on est déjà sur la page de support et que le chat est fermé, on peut rediriger vers l'onglet chatbot
    if (location.pathname === '/support' && !isOpen) {
      navigate('/support', { state: { defaultTab: 'chatbot' } });
      toast({
        title: "Chatbot activé",
        description: "Vous pouvez maintenant discuter avec notre assistant"
      });
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && location.pathname !== '/support' && (
        <div className="mb-4 w-80 md:w-96 bg-white rounded-lg shadow-lg overflow-hidden animate-fade-in">
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
        aria-label="Chat avec un assistant"
      >
        {isOpen && location.pathname !== '/support' ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
};

export default FloatingChatButton;
