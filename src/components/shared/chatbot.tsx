'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, X } from 'lucide-react';
import { getMenuSuggestion } from '@/app/actions';

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
  const [isPending, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isPending, isOpen]);


  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const userMessage: Message = { text: inputValue, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');

    startTransition(async () => {
      const result = await getMenuSuggestion(currentInput);
      let botResponse: Message;

      if (result.error || !result.data) {
        botResponse = { text: "Désolé, je n'ai pas pu traiter votre demande. Veuillez réessayer.", sender: 'bot' };
      } else {
        botResponse = { text: result.data.suggestion, sender: 'bot' };
      }
      setMessages((prev) => [...prev, botResponse]);
    });
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
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full p-4" viewportRef={scrollAreaRef}>
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
          <div className="p-2 border-t flex items-center gap-2">
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
      )}
    </>
  );
}
