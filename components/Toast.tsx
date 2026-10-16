"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

type Toast = {
  id: number;
  type: ToastType;
  message: string;
  leaving?: boolean;
};

export type PushToast = (message: string, type?: ToastType) => void;

const ToastContext = createContext<PushToast | null>(null);

/** Push a toast. Safe to call from any client component (no-op outside provider). */
export function useToast(): PushToast {
  return useContext(ToastContext) ?? (() => {});
}

const DISMISS_MS = 3600;
const LEAVE_MS = 220;
const MAX_VISIBLE = 3;

type TimerRec = {
  timer: ReturnType<typeof setTimeout>;
  dismissAt: number;
  remaining: number;
};

const typeMeta: Record<
  ToastType,
  { icon: typeof CheckCircle2; color: string; ring: string }
> = {
  success: { icon: CheckCircle2, color: "text-wire", ring: "bg-wire" },
  error: { icon: AlertTriangle, color: "text-alert", ring: "bg-alert" },
  info: { icon: Info, color: "text-signal", ring: "bg-signal" },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);
  const timers = useRef(new Map<number, TimerRec>());

  const clearTimer = useCallback((id: number) => {
    const rec = timers.current.get(id);
    if (rec) {
      clearTimeout(rec.timer);
      timers.current.delete(id);
    }
  }, []);

  const dismiss = useCallback(
    (id: number) => {
      clearTimer(id);
      // mark leaving → CSS plays toast-out → then unmount
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, LEAVE_MS);
    },
    [clearTimer],
  );

  const schedule = useCallback(
    (id: number, ms: number) => {
      const rec = timers.current.get(id);
      if (rec) clearTimeout(rec.timer);
      timers.current.set(id, {
        timer: setTimeout(() => dismiss(id), ms),
        dismissAt: Date.now() + ms,
        remaining: ms,
      });
    },
    [dismiss],
  );

  const push = useCallback<PushToast>(
    (message, type = "success") => {
      const id = nextId.current++;
      setToasts((prev) => {
        const next = [...prev, { id, type, message }];
        // evict oldest beyond the visible cap
        for (const dropped of next.slice(0, Math.max(0, next.length - MAX_VISIBLE))) {
          clearTimer(dropped.id);
        }
        return next.slice(-MAX_VISIBLE);
      });
      schedule(id, DISMISS_MS);
    },
    [schedule, clearTimer],
  );

  // pause countdown while the pointer rests on a toast
  const pause = useCallback((id: number) => {
    const rec = timers.current.get(id);
    if (!rec) return;
    clearTimeout(rec.timer);
    rec.remaining = Math.max(200, rec.dismissAt - Date.now());
  }, []);

  const resume = useCallback(
    (id: number) => {
      const rec = timers.current.get(id);
      if (rec && rec.remaining > 200) schedule(id, rec.remaining);
    },
    [schedule],
  );

  useEffect(() => {
    const map = timers.current;
    return () => {
      for (const rec of map.values()) clearTimeout(rec.timer);
      map.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 top-[4.5rem] z-[70] flex flex-col items-end gap-2 sm:inset-x-auto sm:right-5"
      >
        {toasts.map((t) => {
          const { icon: Icon, color, ring } = typeMeta[t.type];
          return (
            <div
              key={t.id}
              className={`toast-item glass pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-lg border border-hair shadow-lift ${
                t.leaving ? "toast-leaving" : ""
              }`}
              onPointerEnter={() => pause(t.id)}
              onPointerLeave={() => resume(t.id)}
            >
              <div className="flex items-start gap-2.5 px-3.5 py-3">
                <Icon size={15} className={`mt-0.5 shrink-0 ${color}`} />
                <p className="flex-1 text-sm leading-6 text-foreground">{t.message}</p>
                <button
                  type="button"
                  onClick={() => dismiss(t.id)}
                  aria-label="关闭提示"
                  className="-mr-1 -mt-0.5 shrink-0 rounded-sm p-1 text-muted transition-colors hover:text-foreground"
                >
                  <X size={13} />
                </button>
              </div>
              <span
                aria-hidden
                className={`toast-progress absolute inset-x-0 bottom-0 h-0.5 ${ring}`}
                style={{ animationDuration: `${DISMISS_MS}ms` }}
              />
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
