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
      className="sm:max-w-[560px]"
      bodyClassName="px-6 pt-8 pb-[calc(1.75rem+env(safe-area-inset-bottom))] sm:px-10 sm:pt-10 sm:pb-9"
    >
      <AccessForm key={formKey} role={role} onRoleChange={setRole} onDone={close} />
    </Modal>
  );
}
