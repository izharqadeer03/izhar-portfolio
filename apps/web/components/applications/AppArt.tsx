'use client';

import React, { memo } from 'react';

export interface AppArtProps {
  icon: string;
  size?: number;
  className?: string;
  isMuted?: boolean;
}

/**
 * About / Profile Art — Futuristic ID badge with glowing avatar, holographic seal & glass depth.
 */
function AboutArt({ isMuted }: { isMuted?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-full">
      <defs>
        <linearGradient id="ab-bg" x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38cfe8" />
          <stop offset="0.45" stopColor="#0284c7" />
          <stop offset="1" stopColor="#1e3a8a" />
        </linearGradient>
        <linearGradient id="ab-glass" x1="12" y1="8" x2="52" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ab-avatar" x1="20" y1="16" x2="44" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="0.7" stopColor="#e0f2fe" />
          <stop offset="1" stopColor="#bae6fd" />
        </linearGradient>
        <radialGradient id="ab-glow" cx="32" cy="28" r="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38cfe8" stopOpacity="0.8" />
          <stop offset="1" stopColor="#38cfe8" stopOpacity="0" />
        </radialGradient>
        <filter id="ab-shadow" x="0" y="0" width="64" height="64" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Ambient background glow */}
      <circle cx="32" cy="32" r="22" fill="url(#ab-glow)" opacity={isMuted ? 0.3 : 0.6} />

      {/* Main Badge Body */}
      <rect
        x="9"
        y="9"
        width="46"
        height="46"
        rx="13"
        fill="url(#ab-bg)"
        filter="url(#ab-shadow)"
      />

      {/* Subtle Inner Glass Refraction */}
      <rect
        x="10"
        y="10"
        width="44"
        height="24"
        rx="12"
        fill="url(#ab-glass)"
      />
      <rect
        x="9.5"
        y="9.5"
        width="45"
        height="45"
        rx="12.5"
        stroke="#ffffff"
        strokeOpacity="0.35"
        strokeWidth="1"
      />

      {/* Top ID Card Header Slit */}
      <rect x="25" y="13" width="14" height="2.5" rx="1.25" fill="#ffffff" fillOpacity="0.4" />

      {/* Avatar Head */}
      <circle
        cx="32"
        cy="26"
        r="7.5"
        fill="url(#ab-avatar)"
        filter="drop-shadow(0 2px 3px rgba(0,0,0,0.25))"
      />
      <circle cx="30" cy="23.5" r="2" fill="#ffffff" fillOpacity="0.8" />

      {/* Avatar Shoulders */}
      <path
        d="M20 45C20 38.5 25.5 36 32 36C38.5 36 44 38.5 44 45"
        stroke="url(#ab-avatar)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M20 45.5C20 39.5 25.5 37 32 37C38.5 37 44 39.5 44 45.5"
        fill="url(#ab-avatar)"
        fillOpacity="0.2"
      />

      {/* Holographic Verified Star / Orb */}
      <circle cx="43" cy="41" r="5.5" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
      <circle cx="43" cy="41" r="3.5" fill="#38cfe8" />
      <path
        d="M41.5 41L42.5 42L44.5 40"
        stroke="#ffffff"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Portfolio / File Explorer Art — Fluent dual-layer folder with document preview & glass pocket.
 */
function FilesArt({ isMuted }: { isMuted?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-full">
      <defs>
        <linearGradient id="fl-back" x1="10" y1="12" x2="54" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f59e0b" />
          <stop offset="0.6" stopColor="#d97706" />
          <stop offset="1" stopColor="#b45309" />
        </linearGradient>
        <linearGradient id="fl-front" x1="8" y1="26" x2="56" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fbbf24" />
          <stop offset="0.3" stopColor="#f59e0b" />
          <stop offset="1" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="fl-sheet" x1="20" y1="16" x2="46" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#e2e8f0" />
        </linearGradient>
        <linearGradient id="fl-sheen" x1="10" y1="28" x2="54" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="0.6" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="fl-glow" cx="32" cy="34" r="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f59e0b" stopOpacity="0.75" />
          <stop offset="1" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient background glow */}
      <circle cx="32" cy="34" r="22" fill="url(#fl-glow)" opacity={isMuted ? 0.3 : 0.6} />

      {/* Folder Back with Tab */}
      <path
        d="M10 17C10 14.7909 11.7909 13 14 13H25.5C27.0913 13 28.5826 13.7845 29.5 15.1L31.5 18H50C52.2091 18 54 19.7909 54 22V47C54 49.2091 52.2091 51 50 51H14C11.7909 51 10 49.2091 10 47V17Z"
        fill="url(#fl-back)"
        stroke="#ffffff"
        strokeOpacity="0.2"
        strokeWidth="1"
      />

      {/* Internal Document Sheet Peeking Out */}
      <g filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))">
        <rect x="18" y="16" width="28" height="24" rx="3.5" fill="url(#fl-sheet)" />
        <line x1="22" y1="22" x2="32" y2="22" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
        <line x1="22" y1="27" x2="40" y2="27" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="22" y1="31" x2="36" y2="31" stroke="#cbd5e1" strokeWidth="1.6" strokeLinecap="round" />
      </g>

      {/* Folder Front Flap */}
      <path
        d="M8 29C8 26.7909 9.79086 25 12 25H52C54.2091 25 56 26.7909 56 29V47.5C56 50.5376 53.5376 53 50.5 53H13.5C10.4624 53 8 50.5376 8 47.5V29Z"
        fill="url(#fl-front)"
      />

      {/* Front Glass Sheen */}
      <path
        d="M8.5 29C8.5 27.067 10.067 25.5 12 25.5H52C53.933 25.5 55.5 27.067 55.5 29V38C55.5 38 41 33 29 36C18 38.5 8.5 34 8.5 34V29Z"
        fill="url(#fl-sheen)"
      />

      {/* Top Edge Highlight */}
      <line x1="12" y1="25.5" x2="52" y2="25.5" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Projects Explorer Art — 3D Isometric faceted glowing crystals / modular cubes.
 */
function ProjectsArt({ isMuted }: { isMuted?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-full">
      <defs>
        <linearGradient id="pr-top" x1="16" y1="12" x2="48" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c084fc" />
          <stop offset="0.6" stopColor="#a855f7" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="pr-left" x1="14" y1="26" x2="32" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9333ea" />
          <stop offset="1" stopColor="#581c87" />
        </linearGradient>
        <linearGradient id="pr-right" x1="32" y1="26" x2="50" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1" />
          <stop offset="0.7" stopColor="#4338ca" />
          <stop offset="1" stopColor="#312e81" />
        </linearGradient>
        <linearGradient id="pr-glass" x1="18" y1="12" x2="46" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.05" />
        </linearGradient>
        <radialGradient id="pr-glow" cx="32" cy="32" r="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a855f7" stopOpacity="0.8" />
          <stop offset="0.6" stopColor="#6366f1" stopOpacity="0.3" />
          <stop offset="1" stopColor="#a855f7" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient background glow */}
      <circle cx="32" cy="32" r="22" fill="url(#pr-glow)" opacity={isMuted ? 0.3 : 0.65} />

      {/* Background Plate / Back Shadow */}
      <rect
        x="9"
        y="9"
        width="46"
        height="46"
        rx="13"
        fill="#1e1b4b"
        fillOpacity="0.7"
        stroke="#a855f7"
        strokeOpacity="0.3"
        strokeWidth="1"
      />

      {/* 3D Isometric Central Cube */}
      <g filter="drop-shadow(0 4px 6px rgba(0,0,0,0.4))">
        {/* Top Face */}
        <polygon points="32,14 48,22 32,30 16,22" fill="url(#pr-top)" />
        {/* Top Face Glass Highlights */}
        <polygon points="32,15 46,22 32,29 18,22" stroke="url(#pr-glass)" strokeWidth="1" />

        {/* Left Face */}
        <polygon points="16,22 32,30 32,46 16,38" fill="url(#pr-left)" />

        {/* Right Face */}
        <polygon points="32,30 48,22 48,38 32,46" fill="url(#pr-right)" />

        {/* Center Edge Highlight */}
        <line x1="32" y1="14" x2="32" y2="46" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1.2" />
        <line x1="16" y1="22" x2="32" y2="30" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1.2" />
        <line x1="48" y1="22" x2="32" y2="30" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1.2" />
      </g>

      {/* Glowing Floating Satellite Nodes */}
      <circle cx="21" cy="44" r="2.5" fill="#38cfe8" filter="drop-shadow(0 0 3px #38cfe8)" />
      <circle cx="43" cy="44" r="2.5" fill="#c084fc" filter="drop-shadow(0 0 3px #c084fc)" />
      <circle cx="32" cy="22" r="2" fill="#ffffff" filter="drop-shadow(0 0 4px #ffffff)" />
    </svg>
  );
}

/**
 * Experience Art — Luminous compass waypoint & milestone navigation dial.
 */
function ExperienceArt({ isMuted }: { isMuted?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-full">
      <defs>
        <linearGradient id="ex-bg" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10b981" />
          <stop offset="0.5" stopColor="#059669" />
          <stop offset="1" stopColor="#064e3b" />
        </linearGradient>
        <radialGradient id="ex-glow" cx="32" cy="32" r="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10b981" stopOpacity="0.8" />
          <stop offset="1" stopColor="#10b981" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient background glow */}
      <circle cx="32" cy="32" r="22" fill="url(#ex-glow)" opacity={isMuted ? 0.3 : 0.6} />

      {/* Main Dial Body */}
      <rect
        x="9"
        y="9"
        width="46"
        height="46"
        rx="13"
        fill="url(#ex-bg)"
        stroke="#ffffff"
        strokeOpacity="0.25"
        strokeWidth="1"
      />

      {/* Dial Orbital Rings */}
      <circle cx="32" cy="32" r="18" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1.2" strokeDasharray="3 3" />
      <circle cx="32" cy="32" r="14" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="1" />

      {/* Compass Tick Marks */}
      <line x1="32" y1="14" x2="32" y2="17" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      <line x1="32" y1="47" x2="32" y2="50" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14" y1="32" x2="17" y2="32" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="47" y1="32" x2="50" y2="32" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="1.5" strokeLinecap="round" />

      {/* Glowing Milestone Route Line */}
      <path
        d="M20 38C24 38 24 26 32 26C40 26 40 38 44 38"
        stroke="#34d399"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="drop-shadow(0 0 3px #10b981)"
      />
      {/* Route Waypoint Nodes */}
      <circle cx="20" cy="38" r="3" fill="#ffffff" stroke="#10b981" strokeWidth="1.5" />
      <circle cx="32" cy="26" r="3.5" fill="#38cfe8" stroke="#ffffff" strokeWidth="1.5" filter="drop-shadow(0 0 4px #38cfe8)" />
      <circle cx="44" cy="38" r="3" fill="#ffffff" stroke="#10b981" strokeWidth="1.5" />
    </svg>
  );
}

/**
 * Skills Matrix Art — 3D tiered isometric tech stack / floating glass slabs.
 */
function SkillsArt({ isMuted }: { isMuted?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-full">
      <defs>
        <linearGradient id="sk-t1" x1="16" y1="12" x2="48" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fef08a" />
          <stop offset="0.4" stopColor="#fde047" />
          <stop offset="1" stopColor="#eab308" />
        </linearGradient>
        <linearGradient id="sk-t2" x1="16" y1="24" x2="48" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fbbf24" />
          <stop offset="0.6" stopColor="#f59e0b" />
          <stop offset="1" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="sk-t3" x1="16" y1="36" x2="48" y2="50" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f97316" />
          <stop offset="0.6" stopColor="#ea580c" />
          <stop offset="1" stopColor="#c2410c" />
        </linearGradient>
        <radialGradient id="sk-glow" cx="32" cy="32" r="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f59e0b" stopOpacity="0.8" />
          <stop offset="1" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient background glow */}
      <circle cx="32" cy="32" r="22" fill="url(#sk-glow)" opacity={isMuted ? 0.3 : 0.65} />

      {/* Dark Plate Body */}
      <rect
        x="9"
        y="9"
        width="46"
        height="46"
        rx="13"
        fill="#1c1917"
        fillOpacity="0.75"
        stroke="#f59e0b"
        strokeOpacity="0.3"
        strokeWidth="1"
      />

      {/* Layer 3 (Bottom) */}
      <g filter="drop-shadow(0 2px 3px rgba(0,0,0,0.5))">
        <polygon points="32,36 49,42 32,48 15,42" fill="url(#sk-t3)" />
        <polygon points="15,42 32,48 32,51 15,45" fill="#9a3412" />
        <polygon points="32,48 49,42 49,45 32,51" fill="#7c2d12" />
      </g>

      {/* Layer 2 (Middle) */}
      <g filter="drop-shadow(0 2px 3px rgba(0,0,0,0.5))">
        <polygon points="32,25 49,31 32,37 15,31" fill="url(#sk-t2)" />
        <polygon points="15,31 32,37 32,40 15,34" fill="#b45309" />
        <polygon points="32,37 49,31 49,34 32,40" fill="#92400e" />
      </g>

      {/* Layer 1 (Top) */}
      <g filter="drop-shadow(0 3px 4px rgba(0,0,0,0.5))">
        <polygon points="32,14 49,20 32,26 15,20" fill="url(#sk-t1)" />
        <polygon points="15,20 32,26 32,29 15,23" fill="#ca8a04" />
        <polygon points="32,26 49,20 49,23 32,29" fill="#a16207" />
        {/* Specular edge */}
        <polygon points="32,15 47,20 32,25 17,20" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="1" />
      </g>

      {/* Vertical Connecting Energy Sparks */}
      <circle cx="32" cy="20" r="2" fill="#ffffff" filter="drop-shadow(0 0 3px #ffffff)" />
    </svg>
  );
}

/**
 * AI Lab Art — Quantum neural microchip with neon circuit bus & central star core.
 */
function AiLabArt({ isMuted }: { isMuted?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-full">
      <defs>
        <linearGradient id="ai-bg" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0891b2" />
          <stop offset="0.5" stopColor="#0284c7" />
          <stop offset="1" stopColor="#312e81" />
        </linearGradient>
        <linearGradient id="ai-core" x1="24" y1="24" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38cfe8" />
          <stop offset="1" stopColor="#818cf8" />
        </linearGradient>
        <radialGradient id="ai-glow" cx="32" cy="32" r="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38cfe8" stopOpacity="0.85" />
          <stop offset="0.6" stopColor="#818cf8" stopOpacity="0.3" />
          <stop offset="1" stopColor="#38cfe8" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient background glow */}
      <circle cx="32" cy="32" r="22" fill="url(#ai-glow)" opacity={isMuted ? 0.3 : 0.65} />

      {/* Silicon Chip Carrier Body */}
      <rect
        x="9"
        y="9"
        width="46"
        height="46"
        rx="13"
        fill="url(#ai-bg)"
        stroke="#38cfe8"
        strokeOpacity="0.4"
        strokeWidth="1"
      />

      {/* Outer Chip Pins */}
      <line x1="22" y1="6" x2="22" y2="9" stroke="#38cfe8" strokeWidth="2" strokeLinecap="round" />
      <line x1="32" y1="6" x2="32" y2="9" stroke="#38cfe8" strokeWidth="2" strokeLinecap="round" />
      <line x1="42" y1="6" x2="42" y2="9" stroke="#38cfe8" strokeWidth="2" strokeLinecap="round" />

      <line x1="22" y1="55" x2="22" y2="58" stroke="#38cfe8" strokeWidth="2" strokeLinecap="round" />
      <line x1="32" y1="55" x2="32" y2="58" stroke="#38cfe8" strokeWidth="2" strokeLinecap="round" />
      <line x1="42" y1="55" x2="42" y2="58" stroke="#38cfe8" strokeWidth="2" strokeLinecap="round" />

      {/* Circuit Traces */}
      <path
        d="M17 24H25V17M47 24H39V17M17 40H25V47M47 40H39V47"
        stroke="#38cfe8"
        strokeOpacity="0.75"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="17" cy="24" r="1.5" fill="#ffffff" />
      <circle cx="47" cy="24" r="1.5" fill="#ffffff" />
      <circle cx="17" cy="40" r="1.5" fill="#ffffff" />
      <circle cx="47" cy="40" r="1.5" fill="#ffffff" />

      {/* Center Neural Processor Core */}
      <rect
        x="23"
        y="23"
        width="18"
        height="18"
        rx="4.5"
        fill="#0f172a"
        stroke="#38cfe8"
        strokeWidth="1.5"
        filter="drop-shadow(0 0 6px rgba(56,207,232,0.6))"
      />

      {/* Central 4-Point Neural Spark */}
      <path
        d="M32 26V38M26 32H38M28 28L36 36M36 28L28 36"
        stroke="url(#ai-core)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="32" cy="32" r="3" fill="#ffffff" filter="drop-shadow(0 0 4px #ffffff)" />
    </svg>
  );
}

/**
 * Resume Art — Executive document sheet with folded corner & certification badge.
 */
function ResumeArt({ isMuted }: { isMuted?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-full">
      <defs>
        <linearGradient id="rs-bg" x1="12" y1="8" x2="52" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#475569" />
          <stop offset="0.6" stopColor="#334155" />
          <stop offset="1" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id="rs-sheet" x1="14" y1="10" x2="48" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f8fafc" />
          <stop offset="0.8" stopColor="#e2e8f0" />
          <stop offset="1" stopColor="#cbd5e1" />
        </linearGradient>
        <radialGradient id="rs-glow" cx="32" cy="32" r="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#94a3b8" stopOpacity="0.7" />
          <stop offset="1" stopColor="#94a3b8" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient background glow */}
      <circle cx="32" cy="32" r="22" fill="url(#rs-glow)" opacity={isMuted ? 0.3 : 0.55} />

      {/* Dark Plate Outer Frame */}
      <rect
        x="9"
        y="9"
        width="46"
        height="46"
        rx="13"
        fill="url(#rs-bg)"
        stroke="#ffffff"
        strokeOpacity="0.2"
        strokeWidth="1"
      />

      {/* Document Sheet with Folded Corner */}
      <g filter="drop-shadow(0 2px 4px rgba(0,0,0,0.35))">
        {/* Main Document Body */}
        <path
          d="M17 15C17 13.8954 17.8954 13 19 13H39L47 21V49C47 50.1046 46.1046 51 45 51H19C17.8954 51 17 50.1046 17 49V15Z"
          fill="url(#rs-sheet)"
        />
        {/* Folded Corner Dog-Ear */}
        <path
          d="M39 13V19C39 20.1046 39.8954 21 41 21H47L39 13Z"
          fill="#94a3b8"
        />
        <path
          d="M39 13L47 21H41C39.8954 21 39 20.1046 39 19V13Z"
          fill="#cbd5e1"
        />
      </g>

      {/* Resume Content Skeleton Lines */}
      {/* Title / Header Bar */}
      <rect x="21" y="19" width="14" height="3" rx="1.5" fill="#0284c7" />
      {/* Text Lines */}
      <rect x="21" y="26" width="22" height="2" rx="1" fill="#64748b" />
      <rect x="21" y="31" width="18" height="2" rx="1" fill="#94a3b8" />
      <rect x="21" y="36" width="22" height="2" rx="1" fill="#94a3b8" />

      {/* Verification Seal Badge */}
      <circle cx="39" cy="43" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="1" />
      <path d="M37.5 43L38.5 44L40.5 42" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Contact Art — Modern glass envelope & communication beacon in rose-violet.
 */
function ContactArt({ isMuted }: { isMuted?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-full">
      <defs>
        <linearGradient id="ct-bg" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f43f5e" />
          <stop offset="0.5" stopColor="#e11d48" />
          <stop offset="1" stopColor="#9f1239" />
        </linearGradient>
        <linearGradient id="ct-glass" x1="12" y1="12" x2="52" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="0.7" stopColor="#ffffff" stopOpacity="0.05" />
        </linearGradient>
        <radialGradient id="ct-glow" cx="32" cy="32" r="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f43f5e" stopOpacity="0.8" />
          <stop offset="1" stopColor="#f43f5e" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient background glow */}
      <circle cx="32" cy="32" r="22" fill="url(#ct-glow)" opacity={isMuted ? 0.3 : 0.65} />

      {/* Envelope Outer Plate */}
      <rect
        x="9"
        y="9"
        width="46"
        height="46"
        rx="13"
        fill="url(#ct-bg)"
        stroke="#ffffff"
        strokeOpacity="0.25"
        strokeWidth="1"
      />

      {/* Specular Inner Glint */}
      <rect
        x="10"
        y="10"
        width="44"
        height="22"
        rx="12"
        fill="url(#ct-glass)"
      />

      {/* Communication Signal Arc Waves */}
      <path
        d="M21 21C27.5 15.5 36.5 15.5 43 21"
        stroke="#ffffff"
        strokeOpacity="0.4"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Envelope Flap Fold Lines */}
      <path
        d="M13 22L32 35L51 22"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="drop-shadow(0 2px 3px rgba(0,0,0,0.3))"
      />
      <path
        d="M13 42L25 31M51 42L39 31"
        stroke="#ffffff"
        strokeOpacity="0.4"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Floating Glowing @ Beacon */}
      <circle cx="32" cy="36" r="8" fill="#ffffff" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))" />
      <path
        d="M34.5 35.5C34.5 37 33.5 38 32 38C30.5 38 29.5 36.8 29.5 35.2C29.5 33.5 30.8 32.2 32.5 32.2C34.2 32.2 35.5 33.5 35.5 35.2V36.2C35.5 37.2 36.2 37.8 37 37.8C37.8 37.8 38.5 37.2 38.5 36"
        stroke="#e11d48"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Terminal Art — Developer obsidian CLI console window with colored dots & prompt.
 */
function TerminalArt({ isMuted }: { isMuted?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-full">
      <defs>
        <linearGradient id="tm-bg" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1e293b" />
          <stop offset="0.5" stopColor="#0f172a" />
          <stop offset="1" stopColor="#020617" />
        </linearGradient>
        <radialGradient id="tm-glow" cx="32" cy="32" r="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10b981" stopOpacity="0.6" />
          <stop offset="0.7" stopColor="#0ea5e9" stopOpacity="0.25" />
          <stop offset="1" stopColor="#10b981" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient background glow */}
      <circle cx="32" cy="32" r="22" fill="url(#tm-glow)" opacity={isMuted ? 0.3 : 0.6} />

      {/* Console Frame Body */}
      <rect
        x="9"
        y="9"
        width="46"
        height="46"
        rx="13"
        fill="url(#tm-bg)"
        stroke="#334155"
        strokeWidth="1"
      />

      {/* Top Header Bar */}
      <rect x="9" y="9" width="46" height="13" rx="13" fill="#334155" fillOpacity="0.4" />
      <line x1="9" y1="22" x2="55" y2="22" stroke="#475569" strokeWidth="0.8" />

      {/* Window Controls Dots */}
      <circle cx="16" cy="15.5" r="2" fill="#ef4444" />
      <circle cx="21" cy="15.5" r="2" fill="#f59e0b" />
      <circle cx="26" cy="15.5" r="2" fill="#10b981" />

      {/* Command Prompt `>` */}
      <path
        d="M17 29L24 35L17 41"
        stroke="#10b981"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="drop-shadow(0 0 4px #10b981)"
      />

      {/* Blinking Cursor Bar `_` */}
      <line
        x1="28"
        y1="41"
        x2="38"
        y2="41"
        stroke="#38cfe8"
        strokeWidth="3"
        strokeLinecap="round"
        filter="drop-shadow(0 0 4px #38cfe8)"
      />

      {/* Matrix Sub-line dot */}
      <circle cx="45" cy="31" r="1.5" fill="#10b981" fillOpacity="0.6" />
    </svg>
  );
}

/**
 * System Information Art — CPU socket with gold perimeter contacts & glowing cyan silicon die.
 */
function SystemArt({ isMuted }: { isMuted?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-full">
      <defs>
        <linearGradient id="sy-bg" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0f172a" />
          <stop offset="0.6" stopColor="#1e293b" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
        <radialGradient id="sy-glow" cx="32" cy="32" r="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38cfe8" stopOpacity="0.7" />
          <stop offset="1" stopColor="#38cfe8" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient background glow */}
      <circle cx="32" cy="32" r="22" fill="url(#sy-glow)" opacity={isMuted ? 0.3 : 0.6} />

      {/* Socket Body */}
      <rect
        x="9"
        y="9"
        width="46"
        height="46"
        rx="13"
        fill="url(#sy-bg)"
        stroke="#38cfe8"
        strokeOpacity="0.4"
        strokeWidth="1"
      />

      {/* Gold Edge Connector Pins */}
      <rect x="18" y="10" width="4" height="2" rx="1" fill="#f59e0b" />
      <rect x="25" y="10" width="4" height="2" rx="1" fill="#f59e0b" />
      <rect x="35" y="10" width="4" height="2" rx="1" fill="#f59e0b" />
      <rect x="42" y="10" width="4" height="2" rx="1" fill="#f59e0b" />

      <rect x="18" y="52" width="4" height="2" rx="1" fill="#f59e0b" />
      <rect x="25" y="52" width="4" height="2" rx="1" fill="#f59e0b" />
      <rect x="35" y="52" width="4" height="2" rx="1" fill="#f59e0b" />
      <rect x="42" y="52" width="4" height="2" rx="1" fill="#f59e0b" />

      {/* Central Silicon Heat Spreader Die */}
      <rect
        x="20"
        y="20"
        width="24"
        height="24"
        rx="6"
        fill="#0284c7"
        fillOpacity="0.4"
        stroke="#38cfe8"
        strokeWidth="1.5"
        filter="drop-shadow(0 0 6px rgba(56,207,232,0.4))"
      />
      <circle cx="32" cy="32" r="6" fill="#38cfe8" />
      <circle cx="32" cy="32" r="3" fill="#ffffff" />
    </svg>
  );
}

const ART_MAP: Record<string, React.FC<{ isMuted?: boolean }>> = {
  about: AboutArt,
  user: AboutArt,
  files: FilesArt,
  portfolio: FilesArt,
  projects: ProjectsArt,
  experience: ExperienceArt,
  skills: SkillsArt,
  ai: AiLabArt,
  'ai-lab': AiLabArt,
  resume: ResumeArt,
  contact: ContactArt,
  mail: ContactArt,
  terminal: TerminalArt,
  system: SystemArt,
  'system-info': SystemArt,
};

/**
 * Renders rich, bespoke SVG artwork for the given application.
 */
export const AppArt = memo(function AppArt({
  icon,
  size,
  className,
  isMuted = false,
}: AppArtProps) {
  const ArtComponent = ART_MAP[icon] ?? ProjectsArt;

  return (
    <div
      className={className}
      style={{
        width: size !== undefined ? size : '100%',
        height: size !== undefined ? size : '100%',
        display: 'grid',
        placeItems: 'center',
      }}
      aria-hidden="true"
    >
      <ArtComponent isMuted={isMuted} />
    </div>
  );
});

