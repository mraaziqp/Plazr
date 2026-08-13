import React, { useState } from 'react';
import { ChatThread, ChatMessage } from '../types';
import { MessageSquare, Send, X, User, Store, ShieldCheck, CheckCheck } from 'lucide-react';

interface InAppChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  thread: ChatThread | null;
  currentUserRole: 'vendor' | 'planner';
  onSendMessage: (threadId: string, text: string) => void;
}

export const InAppChatModal: React.FC<InAppChatModalProps> = ({
  isOpen,
  onClose,
  thread,
  currentUserRole,
  onSendMessage,
}) => {
  const [inputText, setInputText] = useState('');

  if (!isOpen || !thread) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(thread.id, inputText.trim());
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl text-slate-900 flex flex-col h-[600px]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-white">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {currentUserRole === 'vendor' ? thread.plannerName : thread.vendorName}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium truncate max-w-[280px]">
                Market: {thread.marketTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-slate-50/60">
          <div className="text-center py-2">
            <span className="px-3 py-1 rounded-full bg-white text-[10px] text-slate-600 font-semibold border border-slate-200 shadow-2xs">
              Official Negotiating Channel • End-to-End Encrypted
            </span>
          </div>

          {thread.messages.map((msg) => {
            const isMe = msg.sender === currentUserRole;

            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-xs space-y-1 ${
                    isMe
                      ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                      : 'bg-white text-slate-900 border border-slate-200 rounded-bl-none shadow-2xs'
                  }`}
                >
                  <p className="leading-relaxed font-medium">{msg.text}</p>
                  <div className="flex items-center justify-end space-x-1 text-[9px] opacity-80">
                    <span>{msg.timestamp}</span>
                    {isMe && <CheckCheck className="w-3 h-3 text-indigo-200" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Preset Quick Questions */}
        <div className="p-2 px-3 bg-white border-t border-slate-200 flex items-center space-x-2 overflow-x-auto text-[11px]">
          <span className="text-slate-500 shrink-0 font-bold text-[10px]">Quick:</span>
          <button
            onClick={() => setInputText('Can we request a 15A high-draw socket near Zone A?')}
            className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-200 whitespace-nowrap transition-colors"
          >
            Power Socket Request
          </button>
          <button
            onClick={() => setInputText('What is the exact load-in time for food vendors?')}
            className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-200 whitespace-nowrap transition-colors"
          >
            Load-In Setup Time
          </button>
          <button
            onClick={() => setInputText('Is there overnight security for stall gazebos?')}
            className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-200 whitespace-nowrap transition-colors"
          >
            Overnight Security
          </button>
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSend}
          className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message or placement request..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
