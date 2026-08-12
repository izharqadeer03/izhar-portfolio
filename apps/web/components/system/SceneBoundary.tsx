'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';

interface SceneBoundaryProps {
  children: ReactNode;
  onError: () => void;
}

interface SceneBoundaryState {
  failed: boolean;
}

/**
 * Isolates the WebGL environment from the rest of the OS.
 *
 * If Three.js throws — a lost context, a driver quirk, a blocked canvas — the
 * desktop keeps working and falls back to the CSS environment. The workspace is
 * never unusable because a decoration failed.
 */
export class SceneBoundary extends Component<SceneBoundaryProps, SceneBoundaryState> {
  override state: SceneBoundaryState = { failed: false };

  static getDerivedStateFromError(): SceneBoundaryState {
    return { failed: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn('[izhar-os] environment unavailable, falling back to CSS layers', error, info);
    this.props.onError();
  }

  override render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}
