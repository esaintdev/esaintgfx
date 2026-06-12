"use client";

export default function OpenChatButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => (window as any).__openChat?.()}
      className={className}
    >
      {children}
    </button>
  );
}
