'use client'

export default function BubbleBackground({ className = '' }) { // NOSONAR javascript:S6774
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
    >
      <div className="rp-b1" />
      <div className="rp-b2" />
      <div className="rp-b3" />
      <div className="rp-b4" />
      <div className="rp-b5" />

      <style>{`
        /* ── shared ─────────────────────────────────────────────────────── */
        .rp-b1, .rp-b2, .rp-b3, .rp-b4, .rp-b5 {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          will-change: transform;
        }

        /* ── 1  deep-navy large — top-right ──────────────────────────── */
        .rp-b1 {
          width: 1100px; height: 1100px;
          top: -420px; right: -300px;
          background: radial-gradient(circle,
            rgba(10,42,136,0.30) 0%,
            rgba(10,42,136,0.12) 45%,
            transparent 70%
          );
          animation: b1 6s ease-in-out infinite;
        }

        /* ── 2  sky-cyan — centre ────────────────────────────────────── */
        .rp-b2 {
          width: 960px; height: 960px;
          top: -100px; left: -280px;
          background: radial-gradient(circle,
            rgba(89,205,233,0.32) 0%,
            rgba(0,131,254,0.14) 48%,
            transparent 70%
          );
          animation: b2 5s ease-in-out infinite;
        }

        /* ── 3  brand-blue — bottom-left ─────────────────────────────── */
        .rp-b3 {
          width: 880px; height: 880px;
          bottom: -320px; left: 8%;
          background: radial-gradient(circle,
            rgba(0,131,254,0.28) 0%,
            rgba(89,205,233,0.12) 48%,
            transparent 70%
          );
          animation: b3 7s ease-in-out infinite;
        }

        /* ── 4  deep-navy accent — bottom-right ──────────────────────── */
        .rp-b4 {
          width: 780px; height: 780px;
          bottom: -240px; right: 4%;
          background: radial-gradient(circle,
            rgba(10,42,136,0.22) 0%,
            rgba(0,131,254,0.10) 48%,
            transparent 70%
          );
          animation: b4 4s ease-in-out infinite;
        }

        /* ── 5  cyan highlight — top-left ────────────────────────────── */
        .rp-b5 {
          width: 700px; height: 700px;
          top: -180px; left: 20%;
          background: radial-gradient(circle,
            rgba(89,205,233,0.22) 0%,
            rgba(10,42,136,0.08) 48%,
            transparent 70%
          );
          animation: b5 8s ease-in-out infinite;
        }

        /* ── keyframes — unique erratic paths per blob ───────────────── */
        @keyframes b1 {
          0%   { transform: translate(0px,    0px)   scale(1);    }
          15%  { transform: translate(-90px,  70px)  scale(1.07); }
          32%  { transform: translate(70px,  -100px) scale(0.93); }
          50%  { transform: translate(130px,  50px)  scale(1.06); }
          68%  { transform: translate(-60px,  120px) scale(0.96); }
          85%  { transform: translate(100px, -70px)  scale(1.09); }
          100% { transform: translate(0px,    0px)   scale(1);    }
        }

        @keyframes b2 {
          0%   { transform: translate(0px,   0px)    scale(1);    }
          20%  { transform: translate(110px, -80px)  scale(1.08); }
          42%  { transform: translate(-80px,  100px) scale(0.92); }
          62%  { transform: translate(90px,   90px)  scale(1.05); }
          82%  { transform: translate(-100px,-60px)  scale(0.95); }
          100% { transform: translate(0px,   0px)    scale(1);    }
        }

        @keyframes b3 {
          0%   { transform: translate(0px,    0px)    scale(1);    }
          18%  { transform: translate(100px, -90px)   scale(1.06); }
          40%  { transform: translate(-80px,  60px)   scale(0.94); }
          58%  { transform: translate(120px,  80px)   scale(1.07); }
          78%  { transform: translate(-50px, -110px)  scale(0.91); }
          100% { transform: translate(0px,    0px)    scale(1);    }
        }

        @keyframes b4 {
          0%   { transform: translate(0px,    0px)   scale(1);    }
          25%  { transform: translate(-110px, 90px)  scale(1.08); }
          50%  { transform: translate(80px,  -70px)  scale(0.93); }
          75%  { transform: translate(-60px, -90px)  scale(1.06); }
          100% { transform: translate(0px,   0px)    scale(1);    }
        }

        @keyframes b5 {
          0%   { transform: translate(0px,    0px)    scale(1);    }
          22%  { transform: translate(-120px, 70px)   scale(1.07); }
          45%  { transform: translate(80px,  -90px)   scale(0.94); }
          67%  { transform: translate(-90px, -70px)   scale(1.05); }
          88%  { transform: translate(70px,   100px)  scale(0.96); }
          100% { transform: translate(0px,    0px)    scale(1);    }
        }
      `}</style>
    </div>
  )
}
