'use client';

import type { CertificationEntry, EducationEntry, ResumeData } from '@izhar-os/types';
import { OSButton } from '@izhar-os/ui';
import {
  FileText,
  GraduationCap,
  Loader2,
  Plus,
  Save,
  Sparkles,
  Trash2,
} from 'lucide-react';
import React, { useState } from 'react';

interface AdminResumeTabProps {
  initialResume: ResumeData;
  onSaveResume: (resume: ResumeData) => Promise<void>;
}

export function AdminResumeTab({
  initialResume,
  onSaveResume,
}: AdminResumeTabProps) {
  const [resume, setResume] = useState<ResumeData>(initialResume);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      await onSaveResume(resume);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddEducation = () => {
    const newEdu: EducationEntry = {
      degree: 'Degree / Program',
      institution: 'University / Institute',
      period: '2020 — 2024',
      location: 'New Delhi, India',
    };
    setResume({ ...resume, education: [...resume.education, newEdu] });
  };

  const handleAddCertification = () => {
    const newCert: CertificationEntry = {
      name: 'Certification Name',
      issuer: 'Issuing Body / Org',
      year: '2024',
    };
    setResume({ ...resume, certifications: [...resume.certifications, newCert] });
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
        <div>
          <h2 className="text-[18px] font-bold text-fg flex items-center gap-2">
            <FileText size={18} className="text-emerald-400" />
            <span>Resume & Education Matrix</span>
          </h2>
          <p className="text-[12px] text-muted">
            Manage resume executive summary, education entries, certifications, and download URL.
          </p>
        </div>

        <OSButton
          size="md"
          variant="accent"
          type="submit"
          disabled={isSaving}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[12.5px]"
        >
          {isSaving ? (
            <>
              <Loader2 size={13} className="animate-spin mr-1.5" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save size={13} className="mr-1.5" />
              <span>{savedSuccess ? 'Saved to Supabase!' : 'Save Resume Data'}</span>
            </>
          )}
        </OSButton>
      </div>

      {/* 1. Resume Summary & Contact */}
      <section className="rounded-2xl border border-line bg-surface/30 p-5 space-y-4">
        <h3 className="text-[14px] font-bold text-fg uppercase tracking-wider text-emerald-400 font-mono">
          1. Identity & Executive Summary
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[11.5px] font-semibold text-faint uppercase">Name on Resume</label>
            <input
              type="text"
              value={resume.name}
              onChange={(e) => setResume({ ...resume, name: e.target.value })}
              className="w-full h-9 rounded-lg border border-line bg-void/60 px-3 text-[13px] text-fg focus:border-emerald-500/60 focus:outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11.5px] font-semibold text-faint uppercase">Title / Heading</label>
            <input
              type="text"
              value={resume.title}
              onChange={(e) => setResume({ ...resume, title: e.target.value })}
              className="w-full h-9 rounded-lg border border-line bg-void/60 px-3 text-[13px] text-fg focus:border-emerald-500/60 focus:outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11.5px] font-semibold text-faint uppercase">Contact Email</label>
            <input
              type="text"
              value={resume.email}
              onChange={(e) => setResume({ ...resume, email: e.target.value })}
              className="w-full h-9 rounded-lg border border-line bg-void/60 px-3 text-[13px] text-fg focus:border-emerald-500/60 focus:outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11.5px] font-semibold text-faint uppercase">Location</label>
            <input
              type="text"
              value={resume.location}
              onChange={(e) => setResume({ ...resume, location: e.target.value })}
              className="w-full h-9 rounded-lg border border-line bg-void/60 px-3 text-[13px] text-fg focus:border-emerald-500/60 focus:outline-hidden"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-[11.5px] font-semibold text-faint uppercase">Executive Summary</label>
            <textarea
              rows={4}
              value={resume.summary}
              onChange={(e) => setResume({ ...resume, summary: e.target.value })}
              className="w-full rounded-lg border border-line bg-void/60 p-3 text-[13px] text-fg focus:border-emerald-500/60 focus:outline-hidden resize-none"
            />
          </div>
        </div>
      </section>

      {/* 2. Education Entries */}
      <section className="rounded-2xl border border-line bg-surface/30 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[14px] font-bold text-fg uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-1.5">
            <GraduationCap size={15} /> 2. Education History
          </h3>
          <button
            type="button"
            onClick={handleAddEducation}
            className="text-[11.5px] text-emerald-400 hover:underline flex items-center gap-1"
          >
            <Plus size={13} /> Add Degree
          </button>
        </div>

        <div className="space-y-3">
          {resume.education.map((edu, idx) => (
            <div key={idx} className="rounded-xl border border-line/60 bg-void/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-faint">Entry #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => {
                    const next = resume.education.filter((_, i) => i !== idx);
                    setResume({ ...resume, education: next });
                  }}
                  className="p-1 text-muted hover:text-rose-400"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10.5px] font-mono text-faint uppercase">Degree</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => {
                      const next = [...resume.education];
                      next[idx] = { ...edu, degree: e.target.value };
                      setResume({ ...resume, education: next });
                    }}
                    className="w-full h-8 rounded-md border border-line bg-void/70 px-2.5 text-[12.5px] text-fg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-mono text-faint uppercase">Institution</label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => {
                      const next = [...resume.education];
                      next[idx] = { ...edu, institution: e.target.value };
                      setResume({ ...resume, education: next });
                    }}
                    className="w-full h-8 rounded-md border border-line bg-void/70 px-2.5 text-[12.5px] text-fg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-mono text-faint uppercase">Period</label>
                  <input
                    type="text"
                    value={edu.period}
                    onChange={(e) => {
                      const next = [...resume.education];
                      next[idx] = { ...edu, period: e.target.value };
                      setResume({ ...resume, education: next });
                    }}
                    className="w-full h-8 rounded-md border border-line bg-void/70 px-2.5 text-[12.5px] text-fg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-mono text-faint uppercase">Location</label>
                  <input
                    type="text"
                    value={edu.location}
                    onChange={(e) => {
                      const next = [...resume.education];
                      next[idx] = { ...edu, location: e.target.value };
                      setResume({ ...resume, education: next });
                    }}
                    className="w-full h-8 rounded-md border border-line bg-void/70 px-2.5 text-[12.5px] text-fg"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Certifications */}
      <section className="rounded-2xl border border-line bg-surface/30 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[14px] font-bold text-fg uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-1.5">
            <Sparkles size={15} /> 3. Certifications
          </h3>
          <button
            type="button"
            onClick={handleAddCertification}
            className="text-[11.5px] text-emerald-400 hover:underline flex items-center gap-1"
          >
            <Plus size={13} /> Add Certification
          </button>
        </div>

        <div className="space-y-3">
          {resume.certifications.map((cert, idx) => (
            <div key={idx} className="flex items-center gap-3 rounded-xl border border-line/60 bg-void/40 p-3">
              <input
                type="text"
                value={cert.name}
                onChange={(e) => {
                  const next = [...resume.certifications];
                  next[idx] = { ...cert, name: e.target.value };
                  setResume({ ...resume, certifications: next });
                }}
                placeholder="Certificate Name"
                className="flex-1 h-8 rounded-md border border-line bg-void/70 px-2.5 text-[12.5px] text-fg"
              />
              <input
                type="text"
                value={cert.issuer}
                onChange={(e) => {
                  const next = [...resume.certifications];
                  next[idx] = { ...cert, issuer: e.target.value };
                  setResume({ ...resume, certifications: next });
                }}
                placeholder="Issuer"
                className="w-40 h-8 rounded-md border border-line bg-void/70 px-2.5 text-[12.5px] text-fg"
              />
              <input
                type="text"
                value={cert.year}
                onChange={(e) => {
                  const next = [...resume.certifications];
                  next[idx] = { ...cert, year: e.target.value };
                  setResume({ ...resume, certifications: next });
                }}
                placeholder="Year"
                className="w-20 h-8 rounded-md border border-line bg-void/70 px-2.5 text-[12.5px] text-fg font-mono"
              />
              <button
                type="button"
                onClick={() => {
                  const next = resume.certifications.filter((_, i) => i !== idx);
                  setResume({ ...resume, certifications: next });
                }}
                className="p-1 text-muted hover:text-rose-400"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <OSButton
          size="md"
          variant="accent"
          type="submit"
          disabled={isSaving}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-8"
        >
          {isSaving ? (
            <>
              <Loader2 size={14} className="animate-spin mr-2" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save size={14} className="mr-2" />
              <span>Save Resume Data</span>
            </>
          )}
        </OSButton>
      </div>
    </form>
  );
}
