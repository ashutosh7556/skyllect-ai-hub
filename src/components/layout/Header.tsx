"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, PRIMARY_CTA } from "@/data/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/Logo";
import { NavIcon, monogram } from "@/components/layout/NavIcons";
import type { NavItem, NavLink } from "@/types";

/** White panel with a hairline edge, shared by the dropdowns and mobile sheet. */
const PANEL_CLASS = "rounded-2xl border border-line bg-surface shadow-[0_18px_40px_-18px_rgba(15,27,51,0.22)]";

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      className={cn("h-2.5 w-2.5", open && "rotate-180")}
      fill="currentColor"
    >
      <path d="M2 4h8L6 8.5z" />
    </svg>
  );
}

function DropdownLink({ link, onDone }: { link: NavLink; onDone: () => void }) {
  return (
    <Link
      href={link.href}
      onClick={onDone}
      className="group flex items-center gap-3 rounded-xl px-2.5 py-2.5 hover:bg-band"
    >
      {link.icon ? (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-brand-blue">
          <NavIcon name={link.icon} />
        </span>
      ) : null}
      <span className="text-sm text-heading group-hover:text-brand-orange">{link.label}</span>
    </Link>
  );
}

/**
 * Large card entries, used by Case Studies. The client marks are small logo
 * files, so they sit contained on a tinted panel rather than being cropped
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
          className="group flex flex-col overflow-hidden rounded-xl border border-line bg-surface"
        >
          <span className="flex h-24 items-center justify-center border-b border-line bg-band px-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={card.image}
              alt={card.imageAlt}
              className="max-h-9 w-auto max-w-[140px] object-contain"
            />
          </span>

          <span className="flex flex-1 flex-col p-4">
            <span className="text-sm font-bold text-heading">{card.label}</span>
            <span className="mt-1.5 text-xs leading-relaxed text-muted">{card.description}</span>
            <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-brand-orange group-hover:text-brand-blue">
              Explore <span aria-hidden="true">→</span>
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
          className="group flex flex-col border-b border-line px-2 py-4 last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0"
        >
          <span className="flex items-center gap-2.5">
            <span className="text-brand-orange">
              <NavIcon name={feature.icon} className="h-[17px] w-[17px]" />
            </span>
            <span className="text-sm font-bold text-heading group-hover:text-brand-orange">
              {feature.label}
            </span>
          </span>
          <span className="mt-2 text-xs leading-relaxed text-muted">{feature.description}</span>
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
              className="group mb-2 flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-band"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-line bg-surface text-brand-blue">
                <NavIcon name={group.icon} className="h-[13px] w-[13px]" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-heading group-hover:text-brand-orange">
                {group.label}
              </span>
            </Link>

            {/* Technologies are labels, not links — nothing here is clickable. */}
            <ul className="flex flex-col gap-0.5">
              {group.items.map((tech) => (
                <li
                  key={tech}
                  className="flex items-center gap-2.5 rounded-lg px-2 py-1 text-sm text-body"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-line bg-band text-[9px] font-bold tracking-tight text-brand-blue">
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
  const pathname = usePathname();

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
    <header
      ref={navRef}
      className="sticky top-0 z-50 border-b border-line/70 bg-background/80 backdrop-blur-md"
    >
      <div className="container-site flex items-center justify-between py-3 sm:py-4">
        {/* The full lockup carries its own wordmark, so no text beside it. */}
        <Link
          href="/"
          className="flex items-center"
          // On home the href is already the current URL, so Next treats the
          // click as a no-op — jump back to the top instead.
          onClick={(event) => {
            closeAll();
            if (pathname !== "/") return;
            event.preventDefault();
            window.scrollTo(0, 0);
          }}
        >
          <Logo height={44} />
        </Link>

        <div className="hidden items-center gap-4 lg:flex">
          <nav>
            <ul className="flex items-center gap-1">
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
                        "flex items-center gap-1.5 px-3 py-2 text-[15px]",
                        open ? "text-brand-orange" : "text-heading hover:text-brand-orange",
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
                        <div className={cn(PANEL_CLASS, "p-3")}>
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
            className="rounded-full bg-gradient-to-r from-brand-orange to-brand-orange-soft px-5 py-2.5 text-[15px] font-bold text-white hover:from-brand-blue hover:to-brand-blue"
          >
            {PRIMARY_CTA.label}
          </Link>
        </div>

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
            className={cn("h-0.5 w-6 bg-heading", menuOpen && "translate-y-[4px] rotate-45")}
          />
          <span
            className={cn("h-0.5 w-6 bg-heading", menuOpen && "-translate-y-[4px] -rotate-45")}
          />
        </button>
      </div>

      {menuOpen ? (
        <div
          className={cn(
            PANEL_CLASS,
            "absolute inset-x-4 top-full mt-2 max-h-[calc(100dvh-90px)] overflow-y-auto overscroll-contain p-4 lg:hidden",
          )}
        >
          <nav className="flex flex-col">
            {NAV_ITEMS.map((item) => {
              const open = openItem === item.label;
              return (
                <div key={item.label} className="border-b border-line last:border-b-0">
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenItem(open ? null : item.label)}
                    className={cn(
                      "flex min-h-12 w-full items-center justify-between gap-2 text-left text-base",
                      open ? "text-brand-orange" : "text-heading",
                    )}
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
              className="mt-4 rounded-full bg-gradient-to-r from-brand-orange to-brand-orange-soft px-5 py-3.5 text-center text-sm font-bold text-white"
            >
              {PRIMARY_CTA.label}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
