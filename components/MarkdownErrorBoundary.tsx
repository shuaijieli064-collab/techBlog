"use client";

import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class MarkdownErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Markdown rendering error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="border border-alert/40 bg-alert/10 p-4 text-sm text-alert">
          <p className="font-mono text-xs mb-2">{"//"} 内容渲染出错</p>
          <p>{this.state.error?.message ?? "未知错误"}</p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-2 btn-secondary btn-xs"
          >
            重试
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}