'use client';

import type { ContactMessage } from '@izhar-os/database';
import { cn, OSButton } from '@izhar-os/ui';
import {
  Clock,
  Inbox,
  Mail,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';

interface AdminMessagesTabProps {
  messages: ContactMessage[];
  onUpdateStatus: (id: string, status: 'unread' | 'read' | 'replied' | 'archived') => Promise<void>;
  onDeleteMessage: (id: string) => Promise<void>;
}

export function AdminMessagesTab({
  messages,
  onUpdateStatus,
  onDeleteMessage,
}: AdminMessagesTabProps) {
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'replied'>('all');
  const [search, setSearch] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      if (filter !== 'all' && msg.status !== filter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          msg.name.toLowerCase().includes(q) ||
          msg.email.toLowerCase().includes(q) ||
          msg.message.toLowerCase().includes(q) ||
          (msg.topic && msg.topic.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [messages, filter, search]);

  const handleOpenMessage = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (msg.status === 'unread') {
      onUpdateStatus(msg.id, 'read');
    }
  };

  const handleReplyMail = (msg: ContactMessage) => {
    onUpdateStatus(msg.id, 'replied');
    const subject = encodeURIComponent(`Re: Portfolio Inquiry [${msg.topic || 'General'}]`);
    const body = encodeURIComponent(`Hi ${msg.name},\n\nThank you for reaching out via my portfolio!\n\n> ${msg.message}\n\n`);
    window.location.href = `mailto:${msg.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Search Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4">
        <div>
          <h2 className="text-[18px] font-bold text-fg flex items-center gap-2">
            <Inbox size={18} className="text-rose-400" />
            <span>Contact Submissions & Inquiries</span>
          </h2>
          <p className="text-[12px] text-muted">
            All messages sent through the Contact application on IZHAR OS.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-void/50 p-1 rounded-xl border border-line text-[11.5px]">
          {(['all', 'unread', 'read', 'replied'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                'px-3 py-1 rounded-lg capitalize font-medium transition-colors',
                filter === f
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'text-muted hover:text-fg',
              )}
            >
              {f} ({f === 'all' ? messages.length : messages.filter((m) => m.status === f).length})
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-3 text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search inquiries by sender, email, topic, or message contents..."
          className="w-full h-9 rounded-xl border border-line bg-void/50 pl-9 pr-3 text-[12.5px] text-fg placeholder:text-faint focus:border-rose-500/60 focus:outline-hidden"
        />
      </div>

      {/* Messages List / Table */}
      {filteredMessages.length === 0 ? (
        <div className="rounded-2xl border border-line/60 bg-surface/20 p-12 text-center text-muted space-y-2">
          <Inbox size={32} className="mx-auto text-faint opacity-60" />
          <p className="text-[14px] font-medium text-fg">No inquiries found</p>
          <p className="text-[12px] text-muted">Try changing your search terms or filter selection.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-line bg-surface/30 divide-y divide-line/60 overflow-hidden">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => handleOpenMessage(msg)}
              className={cn(
                'p-4 hover:bg-surface/50 cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3',
                msg.status === 'unread' ? 'bg-rose-500/[0.03]' : '',
              )}
            >
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <span
                  className={cn(
                    'mt-1 size-2.5 rounded-full shrink-0',
                    msg.status === 'unread'
                      ? 'bg-rose-500 animate-pulse'
                      : msg.status === 'replied'
                      ? 'bg-emerald-400'
                      : 'bg-muted/40',
                  )}
                />

                <div className="min-w-0 space-y-0.5">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="font-bold text-[13.5px] text-fg">{msg.name}</span>
                    <span className="text-[12px] text-faint font-mono">· {msg.email}</span>
                    {msg.topic ? (
                      <span className="rounded-md border border-line/80 bg-void/50 px-1.5 py-0.2 font-mono text-[10px] text-muted uppercase">
                        {msg.topic}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-[12.5px] text-muted line-clamp-1">{msg.message}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 text-[11.5px] text-faint">
                <span>{new Date(msg.created_at).toLocaleString()}</span>
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                    msg.status === 'unread'
                      ? 'bg-rose-500/20 text-rose-300'
                      : msg.status === 'replied'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-white/5 text-muted',
                  )}
                >
                  {msg.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message Reader Modal */}
      {selectedMessage ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-line bg-[#0e1218] p-6 shadow-2xl space-y-5">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-line pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[16px] font-bold text-fg">{selectedMessage.name}</h3>
                  <span className="text-[11px] font-mono text-muted uppercase">
                    [{selectedMessage.topic || 'Inquiry'}]
                  </span>
                </div>
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="text-[12.5px] text-rose-400 hover:underline flex items-center gap-1 mt-0.5"
                >
                  <Mail size={12} />
                  <span>{selectedMessage.email}</span>
                </a>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="p-1 rounded-lg text-muted hover:text-fg hover:bg-white/10"
              >
                <X size={16} />
              </button>
            </div>

            {/* Date and Status Chips */}
            <div className="flex items-center justify-between text-[11.5px] text-muted">
              <span className="flex items-center gap-1.5">
                <Clock size={12} className="text-faint" />
                {new Date(selectedMessage.created_at).toLocaleString()}
              </span>

              <div className="flex items-center gap-1">
                {(['unread', 'read', 'replied'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      onUpdateStatus(selectedMessage.id, s);
                      setSelectedMessage({ ...selectedMessage, status: s });
                    }}
                    className={cn(
                      'px-2 py-0.5 rounded-md text-[10.5px] capitalize font-medium',
                      selectedMessage.status === s
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'text-faint hover:text-fg',
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Full Message Body */}
            <div className="rounded-xl border border-line/60 bg-void/60 p-4 text-[13px] text-fg/90 leading-relaxed max-h-[300px] overflow-y-auto whitespace-pre-wrap">
              {selectedMessage.message}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-line/60">
              <OSButton
                size="sm"
                variant="ghost"
                onClick={() => {
                  if (confirm('Delete this message permanently?')) {
                    onDeleteMessage(selectedMessage.id);
                    setSelectedMessage(null);
                  }
                }}
                className="text-rose-400 hover:bg-rose-500/10 text-[12px]"
              >
                <Trash2 size={13} className="mr-1" />
                <span>Delete</span>
              </OSButton>

              <div className="flex items-center gap-2">
                <OSButton
                  size="sm"
                  variant="subtle"
                  onClick={() => setSelectedMessage(null)}
                  className="text-[12px]"
                >
                  Close
                </OSButton>

                <OSButton
                  size="sm"
                  variant="accent"
                  onClick={() => handleReplyMail(selectedMessage)}
                  className="bg-rose-600 hover:bg-rose-500 text-white text-[12px]"
                >
                  <Mail size={13} className="mr-1" />
                  <span>Reply via Email</span>
                </OSButton>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
