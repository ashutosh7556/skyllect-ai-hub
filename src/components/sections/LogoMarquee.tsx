const CLIENTS = ["Meridian", "Northwind", "Ferro", "Cascade", "Anchorpoint", "Lumen"];
const LOOPED_CLIENTS = [...CLIENTS, ...CLIENTS];

export function LogoMarquee() {
  return (
    <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 pb-8 sm:flex-row sm:items-center sm:gap-12 sm:pb-10">
      <p className="whitespace-pre-line text-xs text-foreground/50 sm:text-sm">
        {"Trusted by teams\nrunning real operations"}
      </p>

      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-marquee items-center gap-10 sm:gap-16">
          {LOOPED_CLIENTS.map((client, index) => (
            <div key={`${client}-${index}`} className="flex items-center gap-3">
              <span className="liquid-glass flex h-6 w-6 items-center justify-center rounded-lg text-xs font-semibold text-foreground/80">
                {client[0]}
              </span>
              <span className="text-base font-semibold text-foreground">{client}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
