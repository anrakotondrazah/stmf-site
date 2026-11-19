"use client";

const ITEMS = [
  "Forward Deployed Engineers",
  "Automatisation RPA",
  "Solutions IA",
  "Back-Office Digital",
  "Service Client 24/7",
  "Developpement Web",
  "Workflows n8n",
  "Chatbots Intelligents",
];

export function Marquee() {
  return (
    <div className="relative overflow-hidden bg-card py-4 border-y border-line">
      <div className="marquee-track">
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <div key={i} className="flex items-center px-8">
            <span className="text-sm font-medium text-mute whitespace-nowrap">{item}</span>
            <span className="ml-8 w-1.5 h-1.5 rounded-full bg-primary" />
          </div>
        ))}
      </div>
    </div>
  );
}
