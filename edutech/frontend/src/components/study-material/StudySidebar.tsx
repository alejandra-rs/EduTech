import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import QuizStats from "./Stats";
import type { QuizStatsData } from "./Stats";

export interface SidebarAction {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  className: string;
}

export interface SidebarNavItem {
  id: string | number;
  label: string;
  status?: boolean;
  onClick: () => void;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface StudySidebarProps {
  show: boolean;
  onToggle: () => void;
  title?: string;
  stats: QuizStatsData;
  actions?: SidebarAction[];
  navTitle?: string;
  navItems?: SidebarNavItem[];
  activeId?: string | number;
}

const StudySidebar = ({ show, onToggle, stats, actions = [], navTitle, navItems = [], activeId }: StudySidebarProps) => (
  <aside className={`fixed right-0 top-0 h-full bg-gray-50 border-l border-gray-200 transition-all duration-300 z-50 shadow-2xl ${show ? "w-72" : "w-0"}`}>
    <button
      onClick={onToggle}
      className="absolute top-10 -left-10 bg-white border border-gray-200 p-2 rounded-l-xl shadow-sm"
    >
      <ChevronLeftIcon className={`w-5 h-5 text-gray-500 transition-transform ${show ? "rotate-180" : ""}`} />
    </button>

    <div className={`flex flex-col h-full p-5 mt-3 overflow-hidden transition-opacity ${show ? "opacity-100" : "opacity-0"}`}>
      <QuizStats stats={stats} />
      <hr className="border-gray-200 mt-6" />

      {actions.length > 0 && (
        <div className="mt-6 space-y-2">
          {actions.map(({ label, icon: Icon, onClick, className }) => (
            <button key={label} onClick={onClick} className={className}>
              {Icon && <Icon className="w-3.5 h-3.5" />}
              {label}
            </button>
          ))}
        </div>
      )}

      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-10 mb-4">{navTitle}</h2>
      <nav className="flex-1 overflow-y-auto space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={item.onClick}
            className={`flex items-center gap-3 w-full p-2.5 rounded-lg transition-all ${
              item.id === activeId
                ? "bg-indigo-50 border border-indigo-100"
                : "hover:bg-white border border-transparent"
            }`}
          >
            {item.icon
              ? <item.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${item.status === undefined ? "text-gray-300" : item.status ? "text-green-500" : "text-red-500"}`} />
              : <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.status === undefined ? "bg-gray-200" : item.status ? "bg-green-500" : "bg-red-500"}`} />
            }
            <span className="text-[12px] text-gray-600 truncate font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  </aside>
);

export default StudySidebar;
