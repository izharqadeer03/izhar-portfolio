'use client';

import { OSButton } from '@izhar-os/ui';
import {
  Check,
  Copy,
  Download,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  Printer,
  Sparkles,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

import type { ApplicationViewProps } from '@/components/applications/ApplicationRegistry';
import { GithubIcon, LinkedInIcon } from '@/components/system/BrandIcons';
import { usePortfolioStore } from '@/lib/store/portfolio-store';
import { useToastStore } from '@/lib/store/toast-store';

export function ResumeApp(_props: ApplicationViewProps) {
  const addToast = useToastStore((state) => state.addToast);
  const resume = usePortfolioStore((state) => state.resume);
  const experiences = usePortfolioStore((state) => state.experiences);
  const projects = usePortfolioStore((state) => state.projects);
  const profile = usePortfolioStore((state) => state.profile);

  const [zoom, setZoom] = useState(100);
  const [copied, setCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleDownload = useCallback(() => {
    const link = document.createElement('a');
    link.href = '/Izhar_Qadeer_Resume.pdf';
    link.download = 'Izhar_Qadeer_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('Downloading Izhar_Qadeer_Resume.pdf', 'success');
  }, [addToast]);

  const handleCopyText = useCallback(() => {
    const summary = `${profile.name} — ${profile.role}\nEmail: ${profile.links.find((l) => l.id === 'email')?.href.replace('mailto:', '') || ''} | Location: ${profile.location}\n\nSummary:\n${resume.summary}`;
    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true);
      addToast('Resume summary copied to clipboard.', 'info');
      setTimeout(() => setCopied(false), 2000);
    });
  }, [addToast, profile, resume.summary]);

  return (
    <div className="flex h-full min-h-0 flex-col bg-void/90 select-none @container">
      {/* PDF Document Reader Toolbar */}
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-surface/50 px-3 py-2 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-line bg-void/40 px-2.5 py-1 text-[12px] text-fg">
            <FileText size={13} className="text-slate-300" />
            <span className="font-medium">Resume.pdf · Document Viewer</span>
          </div>

          <div className="hidden sm:flex items-center rounded-lg border border-line bg-void/40 p-0.5 text-[11.5px]">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(70, z - 10))}
              className="p-1 text-muted hover:text-fg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={13} />
            </button>
            <span className="px-2 font-mono text-[11px] text-fg/80">{zoom}%</span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(130, z + 10))}
              className="p-1 text-muted hover:text-fg transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={13} />
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <OSButton size="sm" variant="ghost" onClick={handleCopyText} className="text-[12px]">
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            <span className="hidden sm:inline">Copy Text</span>
          </OSButton>

          <OSButton size="sm" variant="ghost" onClick={handlePrint} className="text-[12px]">
            <Printer size={12} />
            <span className="hidden sm:inline">Print</span>
          </OSButton>

          <OSButton size="sm" variant="accent" onClick={handleDownload} className="text-[12px]">
            <Download size={12} />
            <span>Download</span>
          </OSButton>
        </div>
      </header>

      {/* Document Desk Surface */}
      <main className="os-scroll flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-void/70">
        <div
          ref={printRef}
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          className="printable-resume w-full max-w-[780px] rounded-xl border border-line bg-[#0e1217] p-6 sm:p-10 shadow-2xl text-fg space-y-7 transition-transform duration-150"
        >
          {/* Header */}
          <header className="border-b border-line pb-6 space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-[24px] sm:text-[28px] font-extrabold tracking-tight text-white">
                  {profile.name}
                </h1>
                <p className="text-[14px] font-semibold text-emerald-400 mt-0.5">
                  {profile.role}
                </p>
              </div>

              <div className="flex flex-col items-start sm:items-end gap-1 text-[12px] text-muted">
                <span className="flex items-center gap-1.5">
                  <Mail size={12} className="text-faint" />
                  {profile.links.find((l) => l.id === 'email')?.href.replace('mailto:', '') || 'izharqadeer03@gmail.com'}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={12} className="text-faint" />
                  {profile.location}
                </span>
              </div>
            </div>

            {/* Social / Portfolio links */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-[12px]">
              {profile.links.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-1 text-muted hover:text-white transition-colors"
                >
                  {link.id === 'github' ? (
                    <GithubIcon size={13} />
                  ) : link.id === 'linkedin' ? (
                    <LinkedInIcon size={13} />
                  ) : (
                    <Mail size={13} />
                  )}
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </header>

          {/* Executive Summary */}
          <section className="space-y-2">
            <h2 className="text-[12px] font-bold tracking-[0.14em] text-emerald-400 uppercase">
              Executive Summary
            </h2>
            <p className="text-[13px] leading-relaxed text-fg/90">{resume.summary}</p>
          </section>

          {/* Core Competencies Matrix */}
          {resume.competencies && resume.competencies.length > 0 ? (
            <section className="space-y-3">
              <h2 className="text-[12px] font-bold tracking-[0.14em] text-emerald-400 uppercase">
                Technical Competencies
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12.5px]">
                {resume.competencies.map((comp) => (
                  <div key={comp.category} className="rounded-lg border border-line/60 bg-void/30 p-2.5">
                    <span className="font-semibold text-fg/90">{comp.category}:</span>{' '}
                    <span className="text-muted">{comp.skills.join(', ')}</span>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {/* Professional Experience */}
          <section className="space-y-5">
            <h2 className="text-[12px] font-bold tracking-[0.14em] text-emerald-400 uppercase">
              Work Experience
            </h2>

            <div className="space-y-5">
              {experiences.map((exp) => (
                <div key={exp.id} className="space-y-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-1">
                    <div>
                      <h3 className="text-[14px] font-bold text-white">{exp.role}</h3>
                      <p className="text-[12.5px] font-medium text-emerald-400">{exp.company}</p>
                    </div>
                    <span className="font-mono text-[11.5px] text-faint">
                      {exp.period} · {exp.location}
                    </span>
                  </div>

                  <p className="text-[12.5px] text-fg/80 leading-relaxed">{exp.summary}</p>

                  <ul className="space-y-1.5 pl-1">
                    {exp.achievements.map((ach, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[12px] text-muted leading-relaxed">
                        <span className="mt-1.5 size-1 shrink-0 rounded-full bg-emerald-400" />
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Key Featured Projects */}
          <section className="space-y-4">
            <h2 className="text-[12px] font-bold tracking-[0.14em] text-emerald-400 uppercase">
              Selected Featured Systems
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {projects.slice(0, 4).map((p) => (
                <div key={p.id} className="rounded-xl border border-line/70 bg-surface/20 p-3 space-y-1.5">
                  <h3 className="text-[13px] font-bold text-white">{p.name}</h3>
                  <p className="text-[11.5px] text-muted leading-snug">{p.shortDescription}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {p.technologies.slice(0, 4).map((t) => (
                      <span key={t} className="rounded bg-void/60 px-1.5 py-0.5 font-mono text-[10px] text-faint">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Education & Certifications */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-line/60">
            <div className="space-y-2">
              <h2 className="text-[12px] font-bold tracking-[0.14em] text-emerald-400 uppercase flex items-center gap-1.5">
                <GraduationCap size={13} /> Education
              </h2>
              {resume.education.map((edu, idx) => (
                <div key={idx} className="text-[12px]">
                  <h3 className="font-bold text-white">{edu.degree}</h3>
                  <p className="text-muted">{edu.institution}</p>
                  <p className="text-faint font-mono text-[11px]">{edu.period} · {edu.location}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <h2 className="text-[12px] font-bold tracking-[0.14em] text-emerald-400 uppercase flex items-center gap-1.5">
                <Sparkles size={13} /> Certifications
              </h2>
              <ul className="space-y-1.5 text-[12px]">
                {resume.certifications.map((cert, idx) => (
                  <li key={idx} className="text-muted">
                    <span className="font-medium text-white">{cert.name}</span> — {cert.issuer} ({cert.year})
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </main>

      {/* Footer status */}
      <footer className="flex shrink-0 items-center justify-between border-t border-line px-3 py-1.5 text-[11.5px] text-muted">
        <span>A4 Format · Ready for Print & PDF Export</span>
        <span className="hidden sm:block text-faint">
          {profile.name} · {profile.role}
        </span>
      </footer>
    </div>
  );
}
