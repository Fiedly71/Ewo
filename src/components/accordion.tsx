import { ChevronDown } from "./icons";

export function Accordion({ items, defaultOpen }: { items: { title: string; content: React.ReactNode }[]; defaultOpen?: number }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item, i) => (
        <details key={item.title} open={i === defaultOpen} className="group">
          <summary className="flex cursor-pointer items-center justify-between py-4 text-sm font-medium">
            {item.title}
            <ChevronDown className="chevron h-4 w-4 transition-transform" />
          </summary>
          <div className="pb-5 text-sm leading-relaxed text-muted">{item.content}</div>
        </details>
      ))}
    </div>
  );
}
