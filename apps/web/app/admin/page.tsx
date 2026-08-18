'use client';

import type { ContactMessage } from '@izhar-os/database';
import type {
  AboutProfile,
  ExperienceItem,
  Project,
  ProjectCategory,
  ResumeData,
  SkillCategory,
  SkillItem,
  SystemProfile,
} from '@izhar-os/types';
import { Loader2 } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

import { AdminAuthGate } from '@/components/admin/AdminAuthGate';
import { AdminDatabaseTab } from '@/components/admin/AdminDatabaseTab';
import { AdminExperiencesTab } from '@/components/admin/AdminExperiencesTab';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminMessagesTab } from '@/components/admin/AdminMessagesTab';
import { AdminOverviewTab } from '@/components/admin/AdminOverviewTab';
import { AdminProfileTab } from '@/components/admin/AdminProfileTab';
import { AdminProjectsTab } from '@/components/admin/AdminProjectsTab';
import { AdminResumeTab } from '@/components/admin/AdminResumeTab';
import { AdminSidebar, type AdminTab } from '@/components/admin/AdminSidebar';
import { AdminSkillsTab } from '@/components/admin/AdminSkillsTab';
import { useToastStore } from '@/lib/store/toast-store';

export default function AdminPage() {
  const addToast = useToastStore((state) => state.addToast);
  const mainRef = React.useRef<HTMLElement>(null);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isSyncing, setIsSyncing] = useState(false);
  const [dbConnected, setDbConnected] = useState(true);
  const [latencyMs, setLatencyMs] = useState(30);

  const handleSidebarWheel = (e: React.WheelEvent<HTMLElement>) => {
    if (mainRef.current) {
      mainRef.current.scrollTop += e.deltaY;
    }
  };

  // Portfolio Entities State
  const [profile, setProfile] = useState<SystemProfile | null>(null);
  const [about, setAbout] = useState<AboutProfile | null>(null);
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectCategories, setProjectCategories] = useState<ProjectCategory[]>([]);
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  // Check auth session
  const checkAuth = useCallback(async () => {
    try {
      const storedKey = localStorage.getItem('izhar_admin_key');
      const res = await fetch('/api/auth/admin', {
        headers: storedKey ? { 'x-admin-key': storedKey } : {},
      });
      const data = await res.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }
  }, []);

  const getAdminHeaders = useCallback(() => {
    const key = typeof window !== 'undefined' ? localStorage.getItem('izhar_admin_key') || '' : '';
    return {
      'Content-Type': 'application/json',
      'x-admin-key': key,
    };
  }, []);

  // Fetch all data
  const fetchData = useCallback(async () => {
    setIsSyncing(true);
    try {
      const headers = getAdminHeaders();
      const [portfolioRes, contactRes, statusRes] = await Promise.all([
        fetch('/api/portfolio', { cache: 'no-store' }),
        fetch('/api/contact', { headers, cache: 'no-store' }),
        fetch('/api/status', { cache: 'no-store' }),
      ]);

      if (portfolioRes.ok) {
        const pData = await portfolioRes.json();
        if (pData.success && pData.data) {
          setProfile(pData.data.profile);
          setAbout(pData.data.about);
          setSkills(pData.data.skills);
          setSkillCategories(pData.data.skillCategories);
          setProjects(pData.data.projects);
          setProjectCategories(pData.data.projectCategories);
          setExperiences(pData.data.experiences);
          setResume(pData.data.resume);
        }
      }

      if (contactRes.ok) {
        const cData = await contactRes.json();
        if (cData.success && cData.data?.messages) {
          setMessages(cData.data.messages);
        }
      }

      if (statusRes.ok) {
        const sData = await statusRes.json();
        setDbConnected(sData.connected);
        if (sData.latencyMs) setLatencyMs(sData.latencyMs);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [getAdminHeaders]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, fetchData]);

  const handleLogout = () => {
    localStorage.removeItem('izhar_admin_key');
    document.cookie = 'izhar_admin_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    setIsAuthenticated(false);
    addToast('Signed out of admin session', 'info');
  };

  // -------------------------------------------------------------------------
  // Handlers for CRUD Operations
  // -------------------------------------------------------------------------

  const handleSaveProfile = async (newProfile: SystemProfile) => {
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: getAdminHeaders(),
      body: JSON.stringify(newProfile),
    });
    if (res.ok) {
      setProfile(newProfile);
      addToast('Profile updated in Supabase', 'success');
    } else {
      addToast('Failed to update profile', 'warning');
    }
  };

  const handleSaveAbout = async (newAbout: AboutProfile) => {
    const res = await fetch('/api/about', {
      method: 'PUT',
      headers: getAdminHeaders(),
      body: JSON.stringify(newAbout),
    });
    if (res.ok) {
      setAbout(newAbout);
      addToast('About profile updated in Supabase', 'success');
    } else {
      addToast('Failed to update about data', 'warning');
    }
  };

  const handleSaveProject = async (project: Project) => {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify(project),
    });
    if (res.ok) {
      setProjects((current) => {
        const idx = current.findIndex((p) => p.id === project.id);
        if (idx >= 0) {
          const next = [...current];
          next[idx] = project;
          return next;
        }
        return [project, ...current];
      });
      addToast(`Project "${project.name}" saved!`, 'success');
    } else {
      addToast('Failed to save project', 'warning');
    }
  };

  const handleDeleteProject = async (id: string) => {
    const res = await fetch(`/api/projects?id=${id}`, {
      method: 'DELETE',
      headers: getAdminHeaders(),
    });
    if (res.ok) {
      setProjects((current) => current.filter((p) => p.id !== id));
      addToast('Project deleted successfully', 'info');
    } else {
      addToast('Failed to delete project', 'warning');
    }
  };

  const handleSaveSkill = async (skill: SkillItem) => {
    const res = await fetch('/api/skills', {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify(skill),
    });
    if (res.ok) {
      setSkills((current) => {
        const idx = current.findIndex((s) => s.id === skill.id);
        if (idx >= 0) {
          const next = [...current];
          next[idx] = skill;
          return next;
        }
        return [skill, ...current];
      });
      addToast(`Skill "${skill.name}" saved!`, 'success');
    } else {
      addToast('Failed to save skill', 'warning');
    }
  };

  const handleDeleteSkill = async (id: string) => {
    const res = await fetch(`/api/skills?id=${id}`, {
      method: 'DELETE',
      headers: getAdminHeaders(),
    });
    if (res.ok) {
      setSkills((current) => current.filter((s) => s.id !== id));
      addToast('Skill deleted successfully', 'info');
    } else {
      addToast('Failed to delete skill', 'warning');
    }
  };

  const handleSaveExperience = async (exp: ExperienceItem) => {
    const res = await fetch('/api/experiences', {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify(exp),
    });
    if (res.ok) {
      setExperiences((current) => {
        const idx = current.findIndex((e) => e.id === exp.id);
        if (idx >= 0) {
          const next = [...current];
          next[idx] = exp;
          return next;
        }
        return [exp, ...current];
      });
      addToast(`Experience at "${exp.company}" saved!`, 'success');
    } else {
      addToast('Failed to save experience', 'warning');
    }
  };

  const handleDeleteExperience = async (id: string) => {
    const res = await fetch(`/api/experiences?id=${id}`, {
      method: 'DELETE',
      headers: getAdminHeaders(),
    });
    if (res.ok) {
      setExperiences((current) => current.filter((e) => e.id !== id));
      addToast('Experience deleted successfully', 'info');
    } else {
      addToast('Failed to delete experience', 'warning');
    }
  };

  const handleSaveResume = async (newResume: ResumeData) => {
    const res = await fetch('/api/resume', {
      method: 'PUT',
      headers: getAdminHeaders(),
      body: JSON.stringify(newResume),
    });
    if (res.ok) {
      setResume(newResume);
      addToast('Resume matrix updated in Supabase', 'success');
    } else {
      addToast('Failed to update resume', 'warning');
    }
  };

  const handleUpdateMessageStatus = async (
    id: string,
    status: 'unread' | 'read' | 'replied' | 'archived',
  ) => {
    const res = await fetch('/api/contact', {
      method: 'PATCH',
      headers: getAdminHeaders(),
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      setMessages((current) =>
        current.map((m) => (m.id === id ? { ...m, status } : m)),
      );
    }
  };

  const handleDeleteMessage = async (id: string) => {
    const res = await fetch(`/api/contact?id=${id}`, {
      method: 'DELETE',
      headers: getAdminHeaders(),
    });
    if (res.ok) {
      setMessages((current) => current.filter((m) => m.id !== id));
      addToast('Message deleted', 'info');
    }
  };

  const handleTriggerSeed = async (force: boolean = false) => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/seed', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({ force }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchData();
        addToast('Database successfully synchronized with defaults!', 'success');
        return { success: true, message: data.message };
      }
      addToast(data.message || 'Seeding error', 'warning');
      return { success: false, message: data.message };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Seeding failed';
      addToast(message, 'warning');
      return { success: false, message };
    } finally {
      setIsSyncing(false);
    }
  };

  // Loading state during auth check
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#080a0f] flex items-center justify-center text-muted">
        <Loader2 size={24} className="animate-spin text-rose-400" />
      </div>
    );
  }

  // Not authenticated -> show lock screen gate
  if (!isAuthenticated) {
    return (
      <AdminAuthGate
        onAuthenticated={() => {
          setIsAuthenticated(true);
          fetchData();
        }}
      />
    );
  }

  const unreadMessagesCount = messages.filter((m) => m.status === 'unread').length;

  return (
    <div className="h-screen h-dvh w-full bg-[#080a0f] text-fg flex flex-col font-sans selection:bg-rose-500/30 selection:text-white overflow-hidden">
      {/* Top Header */}
      <AdminHeader
        dbConnected={dbConnected}
        latencyMs={latencyMs}
        onRefresh={fetchData}
        onLogout={handleLogout}
        isSyncing={isSyncing}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        {/* Sidebar Navigation */}
        <AdminSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          unreadCount={unreadMessagesCount}
          onWheel={handleSidebarWheel}
        />

        {/* Tab Content Area */}
        <main
          ref={mainRef}
          tabIndex={0}
          className="admin-scroll flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto overscroll-contain min-h-0 w-full outline-none focus:outline-none focus-visible:outline-none select-text"
        >
          <div className="max-w-7xl mx-auto pb-28">
            {activeTab === 'overview' && profile && about ? (
            <AdminOverviewTab
              skillsCount={skills.length}
              projectsCount={projects.length}
              experiencesCount={experiences.length}
              messages={messages}
              profileName={profile.name}
              profileRole={profile.role}
              location={profile.location}
              onNavigate={setActiveTab}
              onTriggerSeed={() => handleTriggerSeed(false)}
              isSeeding={isSyncing}
            />
          ) : null}

          {activeTab === 'messages' ? (
            <AdminMessagesTab
              messages={messages}
              onUpdateStatus={handleUpdateMessageStatus}
              onDeleteMessage={handleDeleteMessage}
            />
          ) : null}

          {activeTab === 'profile' && profile && about ? (
            <AdminProfileTab
              initialProfile={profile}
              initialAbout={about}
              onSaveProfile={handleSaveProfile}
              onSaveAbout={handleSaveAbout}
            />
          ) : null}

          {activeTab === 'projects' ? (
            <AdminProjectsTab
              projects={projects}
              categories={projectCategories}
              onSaveProject={handleSaveProject}
              onDeleteProject={handleDeleteProject}
            />
          ) : null}

          {activeTab === 'skills' ? (
            <AdminSkillsTab
              skills={skills}
              categories={skillCategories}
              onSaveSkill={handleSaveSkill}
              onDeleteSkill={handleDeleteSkill}
            />
          ) : null}

          {activeTab === 'experiences' ? (
            <AdminExperiencesTab
              experiences={experiences}
              onSaveExperience={handleSaveExperience}
              onDeleteExperience={handleDeleteExperience}
            />
          ) : null}

          {activeTab === 'resume' && resume ? (
            <AdminResumeTab
              initialResume={resume}
              onSaveResume={handleSaveResume}
            />
          ) : null}

          {activeTab === 'database' ? (
            <AdminDatabaseTab
              dbConnected={dbConnected}
              latencyMs={latencyMs}
              onTriggerSeed={handleTriggerSeed}
              fullData={{
                profile,
                about,
                skills,
                skillCategories,
                projects,
                projectCategories,
                experiences,
                resume,
                messages,
              }}
            />
          ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}
