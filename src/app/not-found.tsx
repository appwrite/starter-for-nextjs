"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        router.back();
      } else if (e.key === 'Enter') {
        router.push('/');
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  return (
    <div
      style={{
        background: '#002248',
        color: '#fff',
        minHeight: '100vh',
        width: '100vw',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 1rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
        <img src="/myPM-logo.png" alt="myPM Logo" style={{ width: 48, height: 48, background: '#fff', borderRadius: 8, padding: 4 }} />
        <span style={{ fontFamily: 'Literata, serif', fontWeight: 700, fontSize: 32, color: '#fff', letterSpacing: 1 }}>
          myPM
        </span>
      </div>
      <div style={{ maxWidth: 480, width: '100%' }}>
        <div style={{ fontSize: 18, marginBottom: 24, fontWeight: 600, letterSpacing: 1 }}>
          MYPM ERROR 0x00000404
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
          PAGE_NOT_FOUND — The file you&apos;re looking for went off the deep end.
        </div>
        <div style={{ marginBottom: 24 }}>
          A fatal exception has occurred in module <b>navigation.exe</b>.<br />
          Attempted to access a route that does not exist.
        </div>
        <div style={{ marginBottom: 24 }}>
          INITIATING MEMORY DUMP…<br />
          <span style={{ opacity: 0.8 }}>&gt; Saving stack trace to /mainquad/missing.html</span><br />
          <span style={{ opacity: 0.8 }}>&gt; Debating with Jeremy Bentham</span><br />
          <span style={{ opacity: 0.8 }}>&gt; Surfacing redirect protocol…</span>
        </div>
        <div>
          <span style={{ display: 'inline-block', marginRight: 8 }}>
            Press <kbd style={{ background: '#fff', color: '#002248', borderRadius: 4, padding: '2px 6px', fontWeight: 700, fontSize: 14, border: '1px solid #fff' }}>Enter</kbd> to go home.
          </span>
        </div>
        <div style={{ marginTop: 32, textAlign: 'left' }}>
          <button
            onClick={() => router.push('/')}
            style={{
              background: '#fff',
              color: '#002248',
              border: 'none',
              borderRadius: 6,
              padding: '5px 18px',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)',
              marginTop: 8,
              transition: 'background 0.2s, color 0.2s',
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#e6e6e6')}
            onMouseOut={e => (e.currentTarget.style.background = '#fff')}
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
} 