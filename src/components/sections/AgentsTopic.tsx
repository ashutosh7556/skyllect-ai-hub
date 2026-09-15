"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { AgentScenes } from "@/components/animation/AgentScenes";
import { AgentViewport } from "@/components/sections/AgentViewport";
import { AGENTS } from "@/data/agents";

/**
 * The agents, read as modules of the machine.
 *
 * Deliberately not a carousel, a vortex or a pinned scene: the hero owns the
 * motion on this page, and what follows it should behave like a spec sheet
 * for what is inside. Each module is a fixed panel on a bus rail, revealed
 * once as it enters, and never moved again.
 *
 * Each module's clip is the subject of its panel: it runs whenever the panel
 * is on screen, framed by a HUD that reads as the machine inspecting it. See
 * AgentViewport for that read-out, and for the off-screen pausing that keeps
 * seven clips affordable.
 */
export function AgentsTopic() {
  const sectionRef = useRef<HTMLDivElement>(null);
  // Which module the pointer is over. Held here rather than per card so a
  // module's frame and its viewport read-out always agree on the state.
  const [hovered, setHovered] = useState<number | null>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;

      gsap.from("[data-module]", {
        autoAlpha: 0,
        y: 26,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.06,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
          once: true,
        },
      });

      gsap.from("[data-rail]", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          once: true,
        },
      });
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  return (
    <div id="ai-agents" ref={sectionRef} className="relative px-5 py-24 sm:px-8 sm:py-32">
      {/* One WebGL canvas, scissor-drawn into each module's viewport: every
          card runs its own small machine over its clip. */}
      <AgentScenes containerRef={sectionRef} focus={hovered} />

      <div className="mx-auto max-w-[1200px]">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] tracking-[0.4em] text-muted uppercase">01 / Modules</p>
          <h2 className="font-display mt-3 text-[clamp(1.9rem,4.5vw,3.25rem)] leading-[1.1] font-normal tracking-tight text-foreground">
            AI Agents
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-hero-sub sm:text-base">
            Each agent is a working part of the same system — assembled around
            your actual business processes, not a chat window bolted onto them.
          </p>
        </div>

        {/* The bus every module hangs off. */}
        <div
          data-rail
          aria-hidden="true"
          className="mt-12 h-px w-full bg-gradient-to-r from-accent/40 via-edge to-transparent"
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AGENTS.map((agent, i) => (
            <article
              key={agent.name}
              data-module
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") setHovered(i);
              }}
              onPointerLeave={(event) => {
                if (event.pointerType === "mouse") setHovered(null);
              }}
              className="liquid-glass machine-module flex flex-col rounded-2xl p-5 sm:p-6"
            >
              <AgentViewport
                src={agent.video}
                variant={agent.hud}
                active={hovered === i}
                index={i}
              />

              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-[10px] tracking-[0.28em] text-muted uppercase">
                  Agent {String(i + 1).padStart(2, "0")}
                </p>
                <span
                  aria-hidden="true"
                  className="h-1 w-1 rounded-full bg-accent shadow-[0_0_8px_1px_rgba(92,200,232,0.5)]"
                />
              </div>

              <h3 className="font-display mt-2.5 text-lg leading-tight font-normal tracking-tight text-foreground">
                {agent.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{agent.description}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
