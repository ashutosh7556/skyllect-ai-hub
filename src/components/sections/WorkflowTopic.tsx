"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { usePinnedTimeline } from "@/hooks/usePinnedTimeline";
import { NodeNetwork } from "@/components/animation/NodeNetwork";
import { WORKFLOW_STEPS } from "@/data/workflow";
import { cn } from "@/lib/utils";

const TOTAL_UNITS = 6;

// Coordinate space shared by the SVG viewBox and the percentage-positioned
// node chips, so a point plotted in one lines up exactly in the other.
const VIEWBOX = { w: 1000, h: 560 };
const NODES = {
  email: { x: 120, y: 280, label: "Email" },
  ai: { x: 500, y: 280, label: "AI" },
  crm: { x: 860, y: 170, label: "CRM" },
  erp: { x: 860, y: 390, label: "ERP" },
};

const pct = (value: number, axis: "w" | "h") => `${(value / VIEWBOX[axis]) * 100}%`;

const PATH_EMAIL_AI = `M${NODES.email.x},${NODES.email.y} Q310,200 ${NODES.ai.x},${NODES.ai.y}`;
const PATH_AI_CRM = `M${NODES.ai.x},${NODES.ai.y} Q680,200 ${NODES.crm.x},${NODES.crm.y}`;
const PATH_AI_ERP = `M${NODES.ai.x},${NODES.ai.y} Q680,360 ${NODES.erp.x},${NODES.erp.y}`;

export function WorkflowTopic() {
  const chapterRef = useRef<HTMLDivElement>(null);
  const emailGlowRef = useRef<SVGCircleElement>(null);
  const aiGlowRef = useRef<SVGCircleElement>(null);
  const crmGlowRef = useRef<SVGCircleElement>(null);
  const erpGlowRef = useRef<SVGCircleElement>(null);
  const pathEmailAiRef = useRef<SVGPathElement>(null);
  const pathAiCrmRef = useRef<SVGPathElement>(null);
  const pathAiErpRef = useRef<SVGPathElement>(null);
  const packetMainRef = useRef<HTMLDivElement>(null);
  const packetCrmRef = useRef<HTMLDivElement>(null);
  const packetErpRef = useRef<HTMLDivElement>(null);
  const approvalRef = useRef<HTMLDivElement>(null);
  const followUpRef = useRef<HTMLDivElement>(null);
  const dataChipsRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<Array<HTMLParagraphElement | null>>([]);

  const { wrapperRef, pinRef, reduced, heightVh } = usePinnedTimeline(
    TOTAL_UNITS,
    (timeline) => {
      const paths = [pathEmailAiRef.current, pathAiCrmRef.current, pathAiErpRef.current];
      if (paths.some((path) => !path)) return;
      const [pathEmailAi, pathAiCrm, pathAiErp] = paths as [
        SVGPathElement,
        SVGPathElement,
        SVGPathElement,
      ];

      gsap.set(chapterRef.current, { autoAlpha: 0, y: -12 });
      gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set([emailGlowRef.current, aiGlowRef.current, crmGlowRef.current, erpGlowRef.current], {
        opacity: 0,
      });
      gsap.set([packetMainRef.current, packetCrmRef.current, packetErpRef.current], { opacity: 0 });
      gsap.set([approvalRef.current, followUpRef.current, dataChipsRef.current], {
        autoAlpha: 0,
        y: 10,
      });

      const labelWindow = TOTAL_UNITS / WORKFLOW_STEPS.length;
      const labels = labelRefs.current;
      gsap.set(labels, { autoAlpha: 0, y: 8 });
      labels.forEach((label, i) => {
        const start = i * labelWindow;
        timeline
          .to(label, { autoAlpha: 1, y: 0, duration: labelWindow * 0.3 }, start)
          .to(
            label,
            { autoAlpha: 0, y: -8, duration: labelWindow * 0.3 },
            start + labelWindow * 0.7,
          );
      });

      timeline.to(chapterRef.current, { autoAlpha: 1, y: 0, duration: 0.4 }, 0);

      // Beat A — email arrives, travels to AI.
      timeline
        .to(emailGlowRef.current, { opacity: 1, duration: 0.3 }, 0.1)
        .to(packetMainRef.current, { opacity: 1, duration: 0.15 }, 0.5)
        .to(
          packetMainRef.current,
          {
            motionPath: { path: pathEmailAi, align: pathEmailAi, alignOrigin: [0.5, 0.5] },
            duration: 0.7,
          },
          0.5,
        )
        .to(pathEmailAi, { strokeDashoffset: 0, duration: 0.7 }, 0.5)
        .to(packetMainRef.current, { opacity: 0, duration: 0.15 }, 1.15)
        .to(aiGlowRef.current, { opacity: 1, duration: 0.3 }, 1.1);

      // Beat B — AI processes, extracts structured data.
      timeline
        .to(aiGlowRef.current, { scale: 1.3, transformOrigin: "center", duration: 0.5 }, 1.4)
        .to(aiGlowRef.current, { scale: 1, duration: 0.5 }, 1.9)
        .to(dataChipsRef.current, { autoAlpha: 1, y: 0, duration: 0.4 }, 1.7)
        .to(dataChipsRef.current, { autoAlpha: 0, y: -10, duration: 0.3 }, 2.5);

      // Beat C — data travels to CRM and ERP together.
      timeline
        .to([packetCrmRef.current, packetErpRef.current], { opacity: 1, duration: 0.15 }, 2.4)
        .to(
          packetCrmRef.current,
          {
            motionPath: { path: pathAiCrm, align: pathAiCrm, alignOrigin: [0.5, 0.5] },
            duration: 0.8,
          },
          2.4,
        )
        .to(pathAiCrm, { strokeDashoffset: 0, duration: 0.8 }, 2.4)
        .to(
          packetErpRef.current,
          {
            motionPath: { path: pathAiErp, align: pathAiErp, alignOrigin: [0.5, 0.5] },
            duration: 0.8,
          },
          2.4,
        )
        .to(pathAiErp, { strokeDashoffset: 0, duration: 0.8 }, 2.4)
        .to([packetCrmRef.current, packetErpRef.current], { opacity: 0, duration: 0.15 }, 3.2)
        .to([crmGlowRef.current, erpGlowRef.current], { opacity: 1, duration: 0.3 }, 3.15);

      // Beat D — approval requested, then CRM/ERP confirm (accent shift to success tone).
      timeline
        .to(approvalRef.current, { autoAlpha: 1, y: 0, duration: 0.35 }, 3.7)
        .to(approvalRef.current, { autoAlpha: 0, y: -10, duration: 0.3 }, 4.4)
        .to(
          [crmGlowRef.current, erpGlowRef.current],
          { fill: "#34d399", duration: 0.4 },
          4.2,
        );

      // Beat E — response travels back to email, follow-up created, scene settles.
      timeline
        .to(packetMainRef.current, { opacity: 1, duration: 0.15 }, 4.8)
        .to(
          packetMainRef.current,
          {
            motionPath: {
              path: pathEmailAi,
              align: pathEmailAi,
              alignOrigin: [0.5, 0.5],
              start: 1,
              end: 0,
            },
            duration: 0.7,
          },
          4.8,
        )
        .to(packetMainRef.current, { opacity: 0, duration: 0.15 }, 5.5)
        .to(followUpRef.current, { autoAlpha: 1, y: 0, duration: 0.4 }, 5.6)
        .to(sceneRef.current, { opacity: 0.6, duration: 0.3 }, 5.75);
    },
    [],
  );

  return (
    <div
      id="automation"
      ref={wrapperRef}
      className="relative"
      style={reduced ? undefined : { height: `${heightVh}vh` }}
    >
      <div className="absolute inset-0 -z-10">
        <NodeNetwork className="h-full w-full" density={1 / 30000} lineColor="140, 200, 210" dotColor="190, 230, 235" />
      </div>

      <div
        ref={pinRef}
        className={cn(
          "relative z-10 flex flex-col items-center justify-center px-6",
          reduced ? "gap-10 py-24" : "h-screen overflow-hidden",
        )}
      >
        <div
          ref={chapterRef}
          className={cn(
            reduced
              ? "relative max-w-xl text-center"
              : "absolute top-20 left-1/2 w-full max-w-xl -translate-x-1/2 px-6 text-center",
          )}
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-foreground/40">02</p>
          <h2 className="font-display mt-2 text-xl font-medium tracking-tight text-foreground sm:text-3xl">
            AI Workflow Automation
          </h2>
          <p className="mt-2 text-xs text-hero-sub opacity-70 sm:text-sm">
            Replace repetitive manual processes with intelligent workflows.
          </p>
        </div>

        {reduced ? (
          <ol className="flex w-full max-w-xl flex-col gap-2">
            {WORKFLOW_STEPS.map((step, i) => (
              <li key={step} className="text-sm text-white/60">
                {i + 1}. {step}
              </li>
            ))}
          </ol>
        ) : (
          <div
            ref={sceneRef}
            className="relative mt-28 w-full max-w-4xl sm:mt-24"
            style={{ aspectRatio: `${VIEWBOX.w} / ${VIEWBOX.h}` }}
          >
            <svg
              viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
              className="absolute inset-0 h-full w-full overflow-visible"
              aria-hidden="true"
            >
              <path
                ref={pathEmailAiRef}
                d={PATH_EMAIL_AI}
                pathLength={1}
                fill="none"
                stroke="rgba(180, 210, 255, 0.5)"
                strokeWidth={2}
              />
              <path
                ref={pathAiCrmRef}
                d={PATH_AI_CRM}
                pathLength={1}
                fill="none"
                stroke="rgba(180, 210, 255, 0.5)"
                strokeWidth={2}
              />
              <path
                ref={pathAiErpRef}
                d={PATH_AI_ERP}
                pathLength={1}
                fill="none"
                stroke="rgba(180, 210, 255, 0.5)"
                strokeWidth={2}
              />

              <circle ref={emailGlowRef} cx={NODES.email.x} cy={NODES.email.y} r={70} fill="#6366f1" opacity={0} style={{ filter: "blur(30px)" }} />
              <circle ref={aiGlowRef} cx={NODES.ai.x} cy={NODES.ai.y} r={90} fill="#a855f7" opacity={0} style={{ filter: "blur(34px)" }} />
              <circle ref={crmGlowRef} cx={NODES.crm.x} cy={NODES.crm.y} r={70} fill="#6366f1" opacity={0} style={{ filter: "blur(30px)" }} />
              <circle ref={erpGlowRef} cx={NODES.erp.x} cy={NODES.erp.y} r={70} fill="#6366f1" opacity={0} style={{ filter: "blur(30px)" }} />
            </svg>

            {Object.entries(NODES).map(([key, node]) => (
              <div
                key={key}
                className="liquid-glass absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border border-white/10 text-[11px] font-medium text-foreground/80 sm:h-16 sm:w-16 sm:rounded-2xl sm:text-xs"
                style={{ left: pct(node.x, "w"), top: pct(node.y, "h") }}
              >
                {node.label}
              </div>
            ))}

            <div
              ref={packetMainRef}
              className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
              style={{ left: pct(NODES.email.x, "w"), top: pct(NODES.email.y, "h") }}
            />
            <div
              ref={packetCrmRef}
              className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
              style={{ left: pct(NODES.ai.x, "w"), top: pct(NODES.ai.y, "h") }}
            />
            <div
              ref={packetErpRef}
              className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
              style={{ left: pct(NODES.ai.x, "w"), top: pct(NODES.ai.y, "h") }}
            />

            <div
              ref={dataChipsRef}
              className="absolute flex -translate-x-1/2 -translate-y-[140%] gap-2"
              style={{ left: pct(NODES.ai.x, "w"), top: pct(NODES.ai.y, "h") }}
            >
              {["Customer", "SKU", "Amount"].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-white/15 bg-black/40 px-2 py-0.5 text-[11px] text-foreground/70 sm:px-3 sm:py-1 sm:text-[11px]"
                >
                  {chip}
                </span>
              ))}
            </div>

            <div
              ref={approvalRef}
              className="liquid-glass absolute flex -translate-x-1/2 -translate-y-[220%] items-center gap-2 whitespace-nowrap rounded-full border border-white/10 px-3 py-1.5 text-[11px] text-foreground/80 sm:px-4 sm:py-2 sm:text-xs"
              style={{ left: pct(NODES.ai.x, "w"), top: pct(NODES.ai.y, "h") }}
            >
              Approval requested
            </div>

            <div
              ref={followUpRef}
              className="liquid-glass absolute -translate-x-1/2 translate-y-[120%] whitespace-nowrap rounded-full border border-white/10 px-3 py-1.5 text-[11px] text-foreground/80 sm:px-4 sm:py-2 sm:text-xs"
              style={{ left: pct(NODES.email.x, "w"), top: pct(NODES.email.y, "h") }}
            >
              Follow-up created
            </div>
          </div>
        )}

        {!reduced && (
          <div className="relative mt-10 h-14 w-full max-w-md px-6 sm:mt-16 sm:h-8 sm:max-w-none sm:px-0">
            {WORKFLOW_STEPS.map((step, i) => (
              <p
                key={step}
                ref={(el) => {
                  labelRefs.current[i] = el;
                }}
                className="absolute inset-x-6 top-0 text-center text-sm font-medium text-foreground/80 sm:inset-x-0 sm:text-base"
              >
                {step}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
