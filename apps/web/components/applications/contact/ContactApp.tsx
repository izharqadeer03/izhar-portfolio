'use client';

import { CONTACT_CONFIG, SYSTEM_PROFILE } from '@izhar-os/config';
import { cn, OSButton } from '@izhar-os/ui';
import {
  AtSign,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Loader2,
  Mail,
  MapPin,
  Send,
  Sparkles,
} from 'lucide-react';
import { useCallback, useState } from 'react';

import type { ApplicationViewProps } from '@/components/applications/ApplicationRegistry';
import { GithubIcon, LinkedInIcon } from '@/components/system/BrandIcons';
import { useToastStore } from '@/lib/store/toast-store';

export function ContactApp(_props: ApplicationViewProps) {
  const addToast = useToastStore((state) => state.addToast);

  const [selectedTopic, setSelectedTopic] = useState<string>(CONTACT_CONFIG.topics[0]?.id ?? 'job');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = useCallback(
    (text: string, id: string) => {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedId(id);
        addToast(`Copied ${text} to clipboard.`, 'info');
        setTimeout(() => setCopiedId(null), 2000);
      });
    },
    [addToast],
  );

  const [preparedDraft, setPreparedDraft] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      addToast('Please fill in your name, email, and message.', 'warning');
      return;
    }

    setIsSending(true);

    const topicObj = CONTACT_CONFIG.topics.find((t) => t.id === selectedTopic);
    const subject = encodeURIComponent(`[${topicObj?.label ?? 'Portfolio Inquiry'}] Message from ${name}`);
    const body = encodeURIComponent(
      `Hi Izhar,\n\nName: ${name}\nEmail: ${email}\nInquiry Topic: ${topicObj?.label ?? selectedTopic}\n\nMessage:\n${message}\n\n---\nSent via IZHAR OS Portfolio`,
    );
    const mailtoUrl = `mailto:${CONTACT_CONFIG.email}?subject=${subject}&body=${body}`;

    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      setPreparedDraft(mailtoUrl);
      addToast('Opening email client with prepared message...', 'success');
      window.location.href = mailtoUrl;
    }, 600);
  };


  return (
    <div className="flex h-full min-h-0 flex-col bg-surface/15 select-none @container">
      {/* OS Toolbar */}
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-surface/40 px-3 py-2 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-line bg-void/40 px-2.5 py-1 text-[12px] text-fg">
            <AtSign size={13} className="text-rose-400" />
            <span className="font-medium">Contact & Engagement Hub</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11.5px] text-emerald-400">
          <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium">{CONTACT_CONFIG.availability.status} for New Roles</span>
        </div>
      </header>

      {/* Main Body */}
      <main className="os-scroll flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col md:flex-row gap-6">
        {/* Left Side: Identity, Availability & Channels */}
        <div className="w-full md:w-72 shrink-0 space-y-5">
          {/* Availability Card */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-emerald-400 uppercase tracking-wider">
              <Sparkles size={13} />
              Availability Status
            </div>
            <p className="text-[13px] font-semibold text-fg">
              {CONTACT_CONFIG.availability.status}
            </p>
            <p className="text-[12px] leading-relaxed text-muted">
              {CONTACT_CONFIG.availability.notice}
            </p>
          </div>

          {/* Location & Timezone */}
          <div className="rounded-xl border border-line bg-surface/30 p-3.5 space-y-2 text-[12px]">
            <div className="flex items-center gap-2 text-muted">
              <MapPin size={13} className="text-rose-400" />
              <span>Location: <strong className="text-fg">{CONTACT_CONFIG.location}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-muted">
              <Clock size={13} className="text-amber-400" />
              <span>{CONTACT_CONFIG.timezone}</span>
            </div>
          </div>

          {/* Direct Channels */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-mono tracking-[0.14em] text-faint uppercase px-1">
              Direct Channels
            </h4>

            <div className="space-y-1.5">
              {CONTACT_CONFIG.channels.map((channel) => (
                <div
                  key={channel.id}
                  className="flex items-center justify-between gap-2 rounded-xl border border-line bg-surface/30 p-2.5 hover:border-line-strong hover:bg-surface/50 transition-colors"
                >
                  <a
                    href={channel.href}
                    target={channel.href.startsWith('http') ? '_blank' : undefined}
                    rel={channel.href.startsWith('http') ? 'noreferrer noopener' : undefined}
                    className="flex items-center gap-2.5 text-[12.5px] font-medium text-fg min-w-0 flex-1 hover:text-rose-300 transition-colors"
                  >
                    <ChannelIcon icon={channel.icon} />
                    <span className="truncate">{channel.label}</span>
                  </a>

                  {channel.copyable ? (
                    <button
                      type="button"
                      onClick={() => handleCopy(channel.value, channel.id)}
                      className="p-1 text-muted hover:text-fg rounded-md transition-colors"
                      title="Copy Value"
                    >
                      {copiedId === channel.id ? (
                        <Check size={13} className="text-emerald-400" />
                      ) : (
                        <Copy size={13} />
                      )}
                    </button>
                  ) : (
                    <a
                      href={channel.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="p-1 text-muted hover:text-fg"
                    >
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Direct Message Form */}
        <div className="flex-1 rounded-2xl border border-line bg-surface/30 p-5 sm:p-6 flex flex-col justify-between">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h3 className="text-[16px] font-bold text-fg">Send a Direct Message</h3>
              <p className="text-[12.5px] text-muted mt-0.5">
                Reach out directly regarding opportunities, contracts, or engineering inquiries.
              </p>
            </div>

            {/* Purpose / Topic selector */}
            <div className="space-y-1.5">
              <span className="text-[11.5px] font-semibold text-faint uppercase tracking-wider block">
                Inquiry Type
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CONTACT_CONFIG.topics.map((topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => setSelectedTopic(topic.id)}
                    className={cn(
                      'text-left rounded-xl p-2.5 border transition-all text-[12px]',
                      selectedTopic === topic.id
                        ? 'border-rose-500/50 bg-rose-500/10 text-fg shadow-xs'
                        : 'border-line/60 bg-void/30 text-muted hover:bg-void/60 hover:text-fg',
                    )}
                  >
                    <p className="font-semibold text-fg/90">{topic.label}</p>
                    <p className="text-[11px] text-faint truncate mt-0.5">{topic.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Name & Email inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="contact-name" className="text-[11.5px] font-semibold text-faint uppercase tracking-wider block">
                  Your Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Miller"
                  className="w-full h-9 rounded-lg border border-line bg-void/60 px-3 text-[13px] text-fg placeholder:text-faint focus:border-rose-500/60 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="contact-email" className="text-[11.5px] font-semibold text-faint uppercase tracking-wider block">
                  Your Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full h-9 rounded-lg border border-line bg-void/60 px-3 text-[13px] text-fg placeholder:text-faint focus:border-rose-500/60 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Message input */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="contact-message" className="text-[11.5px] font-semibold text-faint uppercase tracking-wider">
                  Message
                </label>
                <span className="text-[11px] text-faint font-mono">{message.length}/500</span>
              </div>
              <textarea
                id="contact-message"
                required
                rows={4}
                maxLength={500}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Details on project scope, role requirements, or question..."
                className="w-full rounded-lg border border-line bg-void/60 p-3 text-[13px] text-fg placeholder:text-faint focus:border-rose-500/60 focus:outline-hidden resize-none"
              />
            </div>

            {/* Submission feedback & buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              {isSent ? (
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 text-[12px] text-emerald-400 font-medium">
                    <CheckCircle2 size={14} /> Ready for dispatch to {CONTACT_CONFIG.email}
                  </div>
                  {preparedDraft ? (
                    <a
                      href={preparedDraft}
                      className="inline-flex items-center gap-1 rounded-md border border-line bg-void/50 px-2 py-1 text-[11.5px] text-fg hover:bg-white/10"
                    >
                      <Mail size={12} /> Open Mail Client
                    </a>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSent(false);
                      setPreparedDraft(null);
                    }}
                    className="text-[11.5px] text-muted hover:text-fg underline ml-1"
                  >
                    Edit message
                  </button>
                </div>
              ) : (
                <span className="text-[11.5px] text-faint">
                  Direct dispatch to {CONTACT_CONFIG.email}
                </span>
              )}

              <OSButton
                size="md"
                variant="subtle"
                type="submit"
                disabled={isSending}
                className="hover:border-rose-500/50 hover:text-rose-200"
              >
                {isSending ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Preparing...</span>
                  </>
                ) : (
                  <>
                    <Send size={13} />
                    <span>{isSent ? 'Resend' : 'Send Message'}</span>
                  </>
                )}
              </OSButton>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex shrink-0 items-center justify-between border-t border-line px-3 py-1.5 text-[11.5px] text-muted">
        <span>Email & Messaging Dispatcher · Active Response</span>
        <span className="hidden sm:block text-faint">
          {SYSTEM_PROFILE.name} · {SYSTEM_PROFILE.role}
        </span>
      </footer>
    </div>
  );
}

function ChannelIcon({ icon }: { icon: string }) {
  if (icon === 'github') return <GithubIcon size={14} />;
  if (icon === 'linkedin') return <LinkedInIcon size={14} />;
  return <Mail size={14} />;
}
