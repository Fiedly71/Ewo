"use client";

import { useEffect, useState } from "react";

export function AnnouncementBar({ messages }: { messages: string[] }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (messages.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % messages.length), 4500);
    return () => clearInterval(id);
  }, [messages.length]);
  if (messages.length === 0) return null;
  return (
    <div className="bg-fg text-bg">
      <p key={index} className="page py-2.5 text-center text-xs font-medium tracking-wide" aria-live="polite">
        {messages[index]}
      </p>
    </div>
  );
}
