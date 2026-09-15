/** The long-form account of the workflow, used as the reduced-motion fallback. */
export const WORKFLOW_STEPS = [
  "Incoming email",
  "AI understands the request",
  "Extracting information",
  "Checking business systems",
  "Preparing a recommendation",
  "Requesting approval",
  "Updating CRM & ERP",
  "Sending the response",
  "Creating a follow-up",
];

/**
 * The four beats the pipeline is read in. Scroll progress is divided between
 * them, and both the 3D scene and the flow along the bottom of the section
 * take their cues from the same division — so the scene and the caption can
 * never disagree about what is happening.
 */
export const WORKFLOW_STAGES = [
  "Request Received",
  "AI Understands",
  "Systems Connected",
  "Action Completed",
] as const;

export interface WorkflowSystem {
  label: string;
  /** Position relative to the AI core, in scene units. */
  x: number;
  y: number;
  /**
   * Which way the connection bows. Two systems on the same side would
   * otherwise overlap into a single thick line.
   */
  bow: number;
}

/**
 * Email sits opposite the rest: it is where the request arrives from, not a
 * system being written to, and the layout should say so before any label
 * does.
 */
export const WORKFLOW_SOURCE: WorkflowSystem = {
  label: "Email",
  x: -6.7,
  y: 0.2,
  bow: 1.5,
};

/** Written to in this order, one after another. */
export const WORKFLOW_SYSTEMS: WorkflowSystem[] = [
  { label: "CRM", x: 4.7, y: 2.9, bow: 1.2 },
  { label: "ERP", x: 5.9, y: -0.5, bow: -0.9 },
  { label: "Inventory", x: 4.1, y: -3.3, bow: -1.3 },
  { label: "Documents", x: 0.4, y: 4.1, bow: 1.4 },
  { label: "WhatsApp", x: -1.1, y: -4.2, bow: -1.4 },
];
