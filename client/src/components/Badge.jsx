import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { PRIORITY_LABELS, STATUS_LABELS } from "../features/issues/constants";

const TONES = {
  slate: "bg-slate-100 text-slate-700 ring-slate-500/20",
  blue: "bg-blue-50 text-blue-700 ring-blue-600/20",
  amber: "bg-amber-50 text-amber-800 ring-amber-600/25",
  orange: "bg-orange-50 text-orange-800 ring-orange-600/25",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  red: "bg-red-50 text-red-700 ring-red-600/20",
  indigo: "bg-indigo-50 text-indigo-700 ring-indigo-600/20"
};

const STATUS_TONES = { OPEN: "blue", IN_PROGRESS: "amber", CLOSED: "green" };
const STATUS_DOTS = { OPEN: "bg-blue-500", IN_PROGRESS: "bg-amber-500", CLOSED: "bg-emerald-500" };
const PRIORITY_TONES = { LOW: "slate", MEDIUM: "orange", HIGH: "red" };
const PRIORITY_ICONS = { LOW: ArrowDown, MEDIUM: Minus, HIGH: ArrowUp };
const ROLE_LABELS = { ADMIN: "Admin", USER: "User" };

export function Badge({ tone = "slate", className = "", children }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${TONES[tone]} ${className}`}>
      
      {children}
    </span>);

}

export function StatusBadge({ status }) {
  return (
    <Badge tone={STATUS_TONES[status] ?? "slate"}>
      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOTS[status] ?? "bg-slate-400"}`} aria-hidden="true" />
      {STATUS_LABELS[status] ?? status}
    </Badge>);

}

export function PriorityBadge({ priority }) {
  const Icon = PRIORITY_ICONS[priority] ?? Minus;
  return (
    <Badge tone={PRIORITY_TONES[priority] ?? "slate"}>
      <Icon className="h-3 w-3" aria-hidden="true" />
      {PRIORITY_LABELS[priority] ?? priority}
    </Badge>);

}

export function RoleBadge({ role }) {
  return <Badge tone={role === "ADMIN" ? "indigo" : "slate"}>{ROLE_LABELS[role] ?? role}</Badge>;
}