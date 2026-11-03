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
    <>
      <div className="bg-accent text-white">
        <p key={index} className="page py-2.5 text-center text-[13px] tracking-[0.08em]" aria-live="polite">
          {messages[index]}
        </p>
      </div>
      {/* liseré aux couleurs du logo Ewo */}
      <div className="flex h-[3px]" aria-hidden="true">
        <span className="flex-1 bg-fg" />
        <span className="flex-1 bg-sun" />
        <span className="flex-1 bg-accent-deep" />
      </div>
    </>
  );
}
