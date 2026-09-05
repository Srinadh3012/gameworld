import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center text-cyan-100 z-[9999] p-8 text-center font-mono">
          <AlertTriangle className="w-24 h-24 text-red-500 mb-6" />
          <h1 className="text-3xl font-bold tracking-widest text-red-400 mb-2">WORLD SIMULATION ERROR</h1>
          <p className="text-xl text-cyan-300/80 mb-8 italic">Something interrupted the world.</p>
          
          <div className="bg-red-950/30 border border-red-500/30 p-6 rounded-lg max-w-2xl text-left mb-8 overflow-hidden">
            <p className="text-red-300 font-mono text-sm opacity-50 break-words">{this.state.error?.message}</p>
          </div>

          <button 
            onClick={this.handleReload}
            className="flex items-center gap-3 px-8 py-4 bg-cyan-900/30 border border-cyan-500/50 rounded hover:bg-cyan-800/50 transition-colors uppercase tracking-widest text-lg"
          >
            <RefreshCw className="w-5 h-5" />
            RETURN TO WORLD
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
