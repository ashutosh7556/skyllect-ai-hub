"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { NAV_ITEMS, PRIMARY_CTA } from "@/data/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/Logo";
import { NavIcon, monogram } from "@/components/layout/NavIcons";
import type { NavItem, NavLink } from "@/types";

/**
 * The menus sit on their own raised surface rather than on the page colour.
 * The site background is near-black, so a translucent panel disappeared into
 * it — this is a lifted slate with a hairline edge and a soft top sheen.
 */
const PANEL_SURFACE: React.CSSProperties = {
  background:
    "linear-gradient(180deg, rgba(31,26,58,0.98) 0%, rgba(20,16,40,0.98) 45%, rgba(14,11,28,0.98) 100%)",
  boxShadow:
    "0 40px 90px -28px rgba(0,0,0,0.95), inset 0 1px 0 rgba(255,255,255,0.09)",
};

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      className={cn(
        "h-2.5 w-2.5 transition-transform duration-200",
        open && "rotate-180",
      )}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 4.5 6 8l3.5-3.5" />
    </svg>
  );
}

function DropdownLink({ link, onDone }: { link: NavLink; onDone: () => void }) {
  return (
    <Link
      href={link.href}
      onClick={onDone}
      className="group flex items-center gap-3 rounded-xl px-2.5 py-2.5 transition-colors duration-200 hover:bg-white/[0.07]"
    >
      {link.icon ? (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/12 bg-white/[0.05] text-foreground/65 transition-colors duration-200 group-hover:border-white/25 group-hover:bg-white/[0.10] group-hover:text-foreground">
          <NavIcon name={link.icon} />
        </span>
      ) : null}
      <span className="text-sm text-foreground/80 transition-colors duration-200 group-hover:text-foreground">
        {link.label}
      </span>
    </Link>
  );
}

/**
 * Large card entries, used by Case Studies. The client marks are small logo
 * files, so they sit contained on a branded panel rather than being cropped
 * to fill like a photograph would be.
 */
function NavCards({ item, onDone }: { item: NavItem; onDone: () => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {item.cards?.map((card) => (
        <Link
          key={card.href}
          href={card.href}
          onClick={onDone}
          className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.06]"
        >
          <span
            className="flex h-24 items-center justify-center border-b border-white/10 px-6"
            style={{
              background:
                "radial-gradient(120% 140% at 30% 0%, rgba(99,102,241,0.22) 0%, rgba(168,85,247,0.10) 45%, rgba(12,9,25,0) 85%)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={card.image}
              alt={card.imageAlt}
              className="max-h-9 w-auto max-w-[140px] object-contain"
            />
          </span>

          <span className="flex flex-1 flex-col p-4">
            <span className="text-sm font-medium text-foreground">{card.label}</span>
            <span className="mt-1.5 text-xs leading-relaxed text-foreground/55">
              {card.description}
            </span>
            <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-indigo-200/80 transition-colors duration-200 group-hover:text-indigo-100">
              Explore
              <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
}

/**
 * Icon, name and one line of explanation, two to a row with a rule beneath
 * each. The whole tile is a single link, so nothing inside it is separately
 * focusable or clickable.
 */
function NavFeatures({ item, onDone }: { item: NavItem; onDone: () => void }) {
  return (
    <div className="grid gap-x-8 sm:grid-cols-2">
      {item.features?.map((feature) => (
        <Link
          key={feature.href}
          href={feature.href}
          onClick={onDone}
          className="group flex flex-col border-b border-white/10 px-2 py-4 transition-colors duration-200 last:border-b-0 hover:border-white/20 sm:[&:nth-last-child(-n+2)]:border-b-0"
        >
          <span className="flex items-center gap-2.5">
            <span className="text-indigo-200/80 transition-colors duration-200 group-hover:text-indigo-100">
              <NavIcon name={feature.icon} className="h-[17px] w-[17px]" />
            </span>
            <span className="text-sm font-semibold text-foreground">{feature.label}</span>
          </span>
          <span className="mt-2 text-xs leading-relaxed text-foreground/60 transition-colors duration-200 group-hover:text-foreground/80">
            {feature.description}
          </span>
        </Link>
      ))}
    </div>
  );
}

/** The panel body, shared by the desktop dropdown and the mobile accordion. */
function NavItemPanel({ item, onDone }: { item: NavItem; onDone: () => void }) {
  if (item.cards) return <NavCards item={item} onDone={onDone} />;
  if (item.features) return <NavFeatures item={item} onDone={onDone} />;

  if (item.groups) {
    return (
      <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
        {item.groups.map((group) => (
          <div key={group.label}>
            {/* Only the category is a destination. */}
            <Link
              href={group.href}
              onClick={onDone}
              className="group mb-2 flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors duration-200 hover:bg-white/[0.07]"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/12 bg-white/[0.05] text-foreground/65 transition-colors duration-200 group-hover:border-white/25 group-hover:text-foreground">
                <NavIcon name={group.icon} className="h-[13px] w-[13px]" />
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/55 transition-colors duration-200 group-hover:text-foreground">
                {group.label}
              </span>
            </Link>

            {/* Technologies are labels, not links — nothing here is clickable. */}
            <ul className="flex flex-col gap-0.5">
              {group.items.map((tech) => (
                <li
                  key={tech}
                  className="flex items-center gap-2.5 rounded-lg px-2 py-1 text-sm text-foreground/65"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-white/10 bg-white/[0.04] text-[9px] font-semibold tracking-tight text-foreground/50">
                    {monogram(tech)}
                  </span>
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {item.links?.map((link) => (
        <DropdownLink key={link.label} link={link} onDone={onDone} />
      ))}
    </div>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  // Which top-level entry is expanded. Shared by both layouts, since only one
  // of them is ever on screen.
  const [openItem, setOpenItem] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Escape closes whatever is open, and a click outside the header dismisses
  // the dropdowns — otherwise a menu opened by tap on a touch device has no
  // way to be dismissed.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpenItem(null);
      setMenuOpen(false);
    }
    function onPointerDown(event: PointerEvent) {
      if (navRef.current?.contains(event.target as Node)) return;
      setOpenItem(null);
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  const closeAll = () => {
    setOpenItem(null);
    setMenuOpen(false);
  };

  return (
    <header ref={navRef} className="fixed inset-x-0 top-0 z-50">
      <div className="flex items-center justify-between px-5 py-4 sm:px-8 sm:py-5">
        {/* The full lockup carries its own wordmark, so no text beside it. */}
        <Link href="/#home" className="flex items-center" onClick={closeAll}>
          <Logo variant="full" height={34} bulbOrigin />
        </Link>

        <nav className="hidden lg:block">
          <ul className="flex items-center gap-2">
            {NAV_ITEMS.map((item) => {
              const open = openItem === item.label;
              return (
                <li
                  key={item.label}
                  className="relative"
                  // Guarded on pointer type so a tap does not both hover-open
                  // and click-toggle, which would leave the menu shut.
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse") setOpenItem(item.label);
                  }}
                  onPointerLeave={(event) => {
                    if (event.pointerType === "mouse") setOpenItem(null);
                  }}
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-haspopup="true"
                    onClick={() => setOpenItem(open ? null : item.label)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-3 py-2 text-sm transition-colors duration-200",
                      open ? "text-foreground" : "text-foreground/90 hover:text-foreground",
                    )}
                  >
                    {item.label}
                    <Chevron open={open} />
                  </button>

                  {open ? (
                    // pt-3 rather than a margin keeps the pointer inside the
                    // item while it travels from the trigger to the panel.
                    <div
                      className={cn(
                        "absolute top-full left-1/2 -translate-x-1/2 pt-3",
                        item.groups && "w-[min(880px,calc(100vw-4rem))]",
                        item.cards && "w-[min(660px,calc(100vw-4rem))]",
                        item.features && "w-[min(600px,calc(100vw-4rem))]",
                        !item.groups &&
                          !item.cards &&
                          !item.features &&
                          "w-[min(320px,calc(100vw-4rem))]",
                      )}
                    >
                      <div
                        className="rounded-2xl border border-white/12 p-3 backdrop-blur-xl"
                        style={PANEL_SURFACE}
                      >
                        <NavItemPanel item={item} onDone={closeAll} />
                      </div>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </nav>

        <Link
          href={PRIMARY_CTA.href}
          onClick={closeAll}
          className="liquid-glass hidden rounded-full px-4 py-2 text-sm font-medium text-foreground transition-colors duration-200 hover:text-foreground lg:inline-flex"
        >
          {PRIMARY_CTA.label}
        </Link>

        <button
          type="button"
          onClick={() => {
            setMenuOpen((value) => !value);
            setOpenItem(null);
          }}
          className="-mr-2 flex h-11 w-11 flex-col items-center justify-center gap-1.5 lg:hidden"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <span
            className={cn(
              "h-px w-5 bg-foreground transition-transform duration-300",
              menuOpen && "translate-y-[3.5px] rotate-45",
            )}
          />
          <span
            className={cn(
              "h-px w-5 bg-foreground transition-transform duration-300",
              menuOpen && "-translate-y-[3.5px] -rotate-45",
            )}
          />
        </button>
      </div>

      <div className="mt-[3px] h-px w-full bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />

      {menuOpen ? (
        <div
          className="absolute inset-x-4 top-[64px] max-h-[calc(100dvh-80px)] overflow-y-auto overscroll-contain rounded-3xl border border-white/12 p-4 backdrop-blur-xl sm:top-[72px] lg:hidden"
          style={PANEL_SURFACE}
        >
          <nav className="flex flex-col">
            {NAV_ITEMS.map((item) => {
              const open = openItem === item.label;
              return (
                <div key={item.label} className="border-b border-white/5 last:border-b-0">
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenItem(open ? null : item.label)}
                    className="flex min-h-12 w-full items-center justify-between gap-2 text-left text-base text-foreground/85 transition-colors duration-200 hover:text-foreground"
                  >
                    {item.label}
                    <Chevron open={open} />
                  </button>

                  {open ? (
                    <div className="pb-3">
                      <NavItemPanel item={item} onDone={closeAll} />
                    </div>
                  ) : null}
                </div>
              );
            })}

            <Link
              href={PRIMARY_CTA.href}
              onClick={closeAll}
              className="liquid-glass mt-4 rounded-full px-5 py-3.5 text-center text-sm font-medium text-foreground"
            >
              {PRIMARY_CTA.label}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
