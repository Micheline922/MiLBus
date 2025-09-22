'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Bot, Send, X } from 'lucide-react';

type Message = {
  text: string;
  sender: 'user' | 'bot';
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Bonjour ! Comment puis-je vous aider à développer votre entreprise aujourd'hui ?", sender: 'bot' },
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const userMessage: Message = { text: inputValue, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);

    // Simple bot response logic
    setTimeout(() => {
      const botResponse: Message = { text: `Je traite votre demande : "${inputValue}". Pour l'instant, je suis en phase d'apprentissage, mais bientôt je pourrai vous donner des conseils sur vos produits, vos ventes et vos stratégies de croissance !`, sender: 'bot' };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);

    setInputValue('');
  };

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg"
          size="icon"
        >
          <Bot className="h-8 w-8" />
        </Button>
      )}

      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 h-[28rem] flex flex-col shadow-xl z-50">
          <CardHeader className="flex flex-row items-center justify-between bg-primary text-primary-foreground p-4">
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6" />
              <CardTitle className="text-lg">Assistant MiLBus</CardTitle>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-full p-4">
              <div className="flex flex-col gap-3">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-2 text-sm ${
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 ${
                        message.sender === 'user'
                          ? 'bg-secondary text-secondary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
          <div className="p-2 border-t flex items-center gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Posez une question..."
            />
            <Button onClick={handleSendMessage} size="icon" disabled={!inputValue.trim()}>
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </Card>
      )}
    </>
  );
}
