'use client';

import { cn } from '@izhar-os/ui';
import { Check, Image as ImageIcon, Palette, RotateCcw, Sparkles, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';

import {
  DEFAULT_THEME_ID,
  THEME_PRESETS,
  useThemeStore,
} from '@/lib/store/theme-store';
import { WALLPAPER_CATALOG } from '@/lib/wallpaper';

interface PersonalizationModalProps {
  open: boolean;
  onClose: () => void;
}

export function PersonalizationModal({ open, onClose }: PersonalizationModalProps) {
  const themeId = useThemeStore((state) => state.themeId);
  const wallpaperId = useThemeStore((state) => state.wallpaperId);
  const setTheme = useThemeStore((state) => state.setTheme);
  const setWallpaper = useThemeStore((state) => state.setWallpaper);

  if (!open) return null;

  const currentPreset = THEME_PRESETS[themeId] ?? THEME_PRESETS[DEFAULT_THEME_ID]!;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-[620px] rounded-2xl border border-white/12 bg-raised/95 shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col max-h-[85vh]"
          style={{
            boxShadow:
              '0 32px 72px -20px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
            <div className="flex items-center gap-3">
              <div
                className="grid size-9 place-items-center rounded-xl border border-line"
                style={{
                  backgroundColor: `color-mix(in oklab, ${currentPreset.accent} 20%, transparent)`,
                  color: currentPreset.accent,
                }}
              >
                <Palette size={18} strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-[15px] font-semibold text-fg">Personalization & Themes</h2>
                <p className="text-[12px] text-muted">Customize accent colors, 3D atmosphere, and desktop wallpapers</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="grid size-8 place-items-center rounded-lg text-muted hover:bg-white/8 hover:text-fg transition-colors"
            >
              <X size={16} strokeWidth={2} />
            </button>
          </div>

          {/* Body */}
          <div className="os-scroll flex-1 overflow-y-auto p-6 space-y-6">
            {/* Theme Accent Color Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-[13px] font-semibold text-fg flex items-center gap-2">
                  <Sparkles size={14} className="text-amber-400" />
                  Accent Color & 3D Atmosphere
                </label>
                <span
                  className="font-mono text-[11px] font-medium px-2 py-0.5 rounded-full border border-line"
                  style={{ color: currentPreset.accent }}
                >
                  {currentPreset.name}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {Object.values(THEME_PRESETS).map((preset) => {
                  const isSelected = themeId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setTheme(preset.id)}
                      className={cn(
                        'flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all',
                        isSelected
                          ? 'border-white/30 bg-white/10 shadow-md ring-1 ring-white/20'
                          : 'border-line bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20',
                      )}
                    >
                      <span
                        className="size-7 rounded-lg shrink-0 flex items-center justify-center shadow-inner"
                        style={{ backgroundColor: preset.accent }}
                      >
                        {isSelected ? <Check size={14} strokeWidth={3} className="text-black" /> : null}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-medium text-fg truncate">{preset.name}</p>
                        <p className="font-mono text-[10px] text-muted">{preset.accent}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Desktop Wallpaper Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-[13px] font-semibold text-fg flex items-center gap-2">
                  <ImageIcon size={14} className="text-cyan-400" />
                  Desktop Wallpaper
                </label>
                <span className="text-[11px] text-muted font-mono">
                  {WALLPAPER_CATALOG[wallpaperId]?.name ?? 'Custom'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.values(WALLPAPER_CATALOG).map((wall) => {
                  const isSelected = wallpaperId === wall.id;
                  return (
                    <button
                      key={wall.id}
                      type="button"
                      onClick={() => setWallpaper(wall.id)}
                      className={cn(
                        'group relative aspect-video rounded-xl border overflow-hidden text-left transition-all',
                        isSelected
                          ? 'border-white/50 ring-2 ring-white/30 shadow-lg scale-[1.02]'
                          : 'border-line hover:border-white/30 opacity-75 hover:opacity-100',
                      )}
                    >
                      <Image
                        src={wall.image}
                        alt={wall.name}
                        fill
                        sizes="200px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between">
                        <span className="text-[11px] font-medium text-white truncate drop-shadow">
                          {wall.name}
                        </span>
                        {isSelected ? (
                          <span
                            className="size-4 rounded-full flex items-center justify-center shadow"
                            style={{ backgroundColor: currentPreset.accent }}
                          >
                            <Check size={10} strokeWidth={3} className="text-black" />
                          </span>
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-line px-6 py-3.5 bg-white/[0.02]">
            <button
              type="button"
              onClick={() => setTheme(DEFAULT_THEME_ID, true)}
              className="flex items-center gap-1.5 text-[12px] text-muted hover:text-fg transition-colors"
            >
              <RotateCcw size={13} />
              <span>Reset to default</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-[12.5px] font-medium text-black transition-all shadow"
              style={{ backgroundColor: currentPreset.accent }}
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
