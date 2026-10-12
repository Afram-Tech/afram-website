import { Building2, Home, Landmark, type LucideIcon } from "lucide-react";

import { ACCESS_ROLES, type AccessRole } from "@/features/access/roles";
import { cn } from "@/lib/utils";

const ROLE_ICONS: Record<AccessRole, LucideIcon> = {
  Member: Home,
  Vendor: Building2,
  Financier: Landmark,
};

interface RoleOptionsProps {
  value: AccessRole;
  onChange: (role: AccessRole) => void;
}

export function RoleOptions({ value, onChange }: RoleOptionsProps) {
  return (
    <fieldset>
      <legend className="text-ink-600 mb-2.5 block text-[13px] font-medium">I&apos;m a</legend>
      <div className="grid grid-cols-3 gap-3">
        {ACCESS_ROLES.map((role) => (
          <RoleOption
            key={role}
            role={role}
            selected={value === role}
            onSelect={() => onChange(role)}
          />
        ))}
      </div>
    </fieldset>
  );
}

interface RoleOptionProps {
  role: AccessRole;
  selected: boolean;
  onSelect: () => void;
}

function RoleOption({ role, selected, onSelect }: RoleOptionProps) {
  const Icon = ROLE_ICONS[role];

  return (
    <label
      className={cn(
        "has-[:focus-visible]:ring-brand-400 flex cursor-pointer flex-col items-center gap-2.5 rounded-2xl px-3 py-4 ring-1 transition-all duration-200 has-[:focus-visible]:ring-2",
        selected
          ? "bg-brand-50 ring-brand-400 scale-[1.02]"
          : "ring-ink-200 hover:ring-brand-200 bg-white",
      )}
    >
      <input
        type="radio"
        name="role"
        value={role}
        checked={selected}
        onChange={onSelect}
        className="sr-only"
      />
      <span
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-200",
          selected ? "bg-brand-600 text-white" : "bg-ink-50 text-ink-500",
        )}
      >
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <span className="text-ink-900 text-[14px] font-semibold">{role}</span>
    </label>
  );
}
