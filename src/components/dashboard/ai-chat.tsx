
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, Wand2 } from 'lucide-react';

type Message = {
  text: string;
  sender: 'user' | 'bot';
};

export default function AiChat() {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Posez-moi une question sur vos données de vente, vos produits, ou comment agrandir votre entreprise.", sender: 'bot' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isPending, setIsPending] = useState(false);

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const userMessage: Message = { text: inputValue, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsPending(true);

    // Simple bot response logic
    setTimeout(() => {
      const botResponse: Message = { text: `Je traite votre demande : "${inputValue}". Pour l'instant, je suis en phase d'apprentissage, mais bientôt je pourrai vous donner des conseils sur vos produits, vos ventes et vos stratégies de croissance !`, sender: 'bot' };
      setMessages((prev) => [...prev, botResponse]);
      setIsPending(false);
    }, 1500);
  };

  return (
    <Card className="flex flex-col h-[34rem]">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Wand2 className="text-primary" />
                Conseiller d'Entreprise IA
            </CardTitle>
            <CardDescription>
                Dialoguez avec l'IA pour obtenir des conseils personnalisés.
            </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4 p-0">
            <ScrollArea className="flex-1 p-4">
              <div className="flex flex-col gap-3">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-2 text-sm ${
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.sender === 'bot' && <Bot className="h-5 w-5 text-primary shrink-0" />}
                    <div
                      className={`max-w-[85%] rounded-lg px-3 py-2 ${
                        message.sender === 'user'
                          ? 'bg-secondary text-secondary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                {isPending && (
                    <div className="flex gap-2 text-sm justify-start">
                        <Bot className="h-5 w-5 text-primary shrink-0 animate-pulse" />
                        <div className="max-w-[85%] rounded-lg px-3 py-2 bg-muted">
                           <div className="h-2 w-16 bg-slate-300 rounded animate-pulse"></div>
                        </div>
                    </div>
                )}
              </div>
            </ScrollArea>
         </CardContent>
         <div className="p-4 border-t flex items-center gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Posez une question..."
              disabled={isPending}
            />
            <Button onClick={handleSendMessage} size="icon" disabled={!inputValue.trim() || isPending}>
              <Send className="h-5 w-5" />
            </Button>
          </div>
    </Card>
  );
}

    