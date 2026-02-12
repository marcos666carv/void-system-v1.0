'use client';

import { Component, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('[ErrorBoundary]', {
            error: error.message,
            componentStack: errorInfo.componentStack,
        });
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div role="alert" style={{
                    padding: '2rem',
                    textAlign: 'center',
                    minHeight: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1rem',
                }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>algo deu errado</h2>
                    <p style={{ opacity: 0.7 }}>
                        tente recarregar a página ou volte mais tarde.
                    </p>
                    <button
                        onClick={() => this.setState({ hasError: false, error: null })}
                        style={{
                            padding: '0.5rem 1.5rem',
                            border: '1px solid currentColor',
                            borderRadius: '4px',
                            background: 'transparent',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            textTransform: 'lowercase',
                        }}
                    >
                        tentar novamente
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
