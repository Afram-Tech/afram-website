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
      <legend className="text-ink-600 mb-3 block text-[13.5px] font-medium sm:text-[14px]">
        I&apos;m a
      </legend>
      <div className="grid grid-cols-3 gap-2 min-[400px]:gap-3 sm:gap-4">
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
        "has-[:focus-visible]:ring-brand-400 flex min-w-0 cursor-pointer flex-col items-center gap-2.5 rounded-2xl px-1.5 py-4 ring-1 transition-all duration-200 has-[:focus-visible]:ring-2 min-[400px]:px-3 sm:gap-3 sm:py-5",
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
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-200 sm:h-12 sm:w-12",
          selected ? "bg-brand-600 text-white" : "bg-ink-50 text-ink-500",
        )}
      >
        <Icon className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
      </span>
      <span className="text-ink-900 max-w-full truncate text-[13px] font-semibold min-[400px]:text-[14px] sm:text-[15px]">
        {role}
      </span>
    </label>
  );
}
