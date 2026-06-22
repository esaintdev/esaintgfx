export type ToastType = "success" | "error" | "info";

export type ToastItem = {
  id: string;
  message: string;
  type: ToastType;
  exiting?: boolean;
};

type Listener = (toasts: ToastItem[]) => void;

let toasts: ToastItem[] = [];
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((fn) => fn([...toasts]));
}

export function toast(message: string, type: ToastType = "info") {
  const id = crypto.randomUUID();
  toasts = [...toasts, { id, message, type }];
  emit();

  setTimeout(() => {
    toasts = toasts.map((t) => (t.id === id ? { ...t, exiting: true } : t));
    emit();
    setTimeout(() => {
      toasts = toasts.filter((t) => t.id !== id);
      emit();
    }, 200);
  }, 4000);
}

export function subscribe(fn: Listener) {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}
