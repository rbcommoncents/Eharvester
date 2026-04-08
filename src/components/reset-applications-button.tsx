"use client";

import { useRef } from "react";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
};

export default function ResetApplicationsButton({ action }: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  function handleClick() {
    const confirmed = window.confirm(
      "This will permanently delete all saved applications from the tracker. Do you want to continue?"
    );

    if (!confirmed) return;

    formRef.current?.requestSubmit();
  }

  return (
    <form ref={formRef} action={action}>
      <button
        type="button"
        onClick={handleClick}
        className="rounded-lg border border-red-700 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-950"
      >
        Reset Applications
      </button>
    </form>
  );
}