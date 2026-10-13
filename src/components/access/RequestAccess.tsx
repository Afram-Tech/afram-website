"use client";

import { Modal } from "@/components/ui/modal/Modal";

import { AccessForm } from "./AccessForm";
import { useAccessDialog } from "./useAccessDialog";

export function RequestAccess() {
  const { isOpen, role, setRole, formKey, close } = useAccessDialog();

  return (
    <Modal
      open={isOpen}
      onClose={close}
      labelledBy="access-title"
      className="sm:max-w-[640px]"
      bodyClassName="px-5 pt-5 pb-[calc(1.75rem+env(safe-area-inset-bottom))] min-[400px]:px-7 sm:px-12 sm:pt-12 sm:pb-11"
    >
      <AccessForm key={formKey} role={role} onRoleChange={setRole} onDone={close} />
    </Modal>
  );
}
