"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { flushSync } from "react-dom";

import { INQUIRY_PANEL_TITLE_ID } from "@/components/forms/inquiry-panel-ids";
import { INQUIRY_META_FIELDS } from "@/lib/inquiry";
import type { FieldErrors, InquirySubmissionResult } from "@/types/inquiry";

/*
 * Submission handling shared by the quote and contact forms: validate in the
 * browser, send the fields to the server action, then show what happened.
 * The server checks everything again and is the authority.
 */

export type InquirySubmissionState =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "sent"; reference: string }
  /** Not delivered. The visitor is offered the send-it-yourself fallback. */
  | { status: "failed" }
  | { status: "rate-limited" };

/** Identifies one submission so a retry is not delivered twice. */
function createSubmissionId() {
  const random = globalThis.crypto;
  if (random?.randomUUID) return random.randomUUID();
  const bytes = new Uint8Array(16);
  if (random?.getRandomValues) random.getRandomValues(bytes);
  else for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function useInquirySubmission<T>({
  validate,
  send,
  fieldOrder,
  fieldId,
  onSent,
}: {
  validate: (values: T) => FieldErrors<T>;
  send: (formData: FormData) => Promise<InquirySubmissionResult<T>>;
  fieldOrder: readonly (keyof T)[];
  fieldId: (field: keyof T) => string;
  /** Called once a submission is delivered, so the form can clear itself. */
  onSent: () => void;
}) {
  const [state, setState] = useState<InquirySubmissionState>({ status: "idle" });
  const [errors, setErrors] = useState<FieldErrors<T>>({});
  const [attempted, setAttempted] = useState(false);
  // The form last submitted, so a retry can send exactly the same fields.
  const formRef = useRef<HTMLFormElement | null>(null);

  // When this form became usable, and the id of the attempt in progress. Both
  // travel with the submission: the first as a hint that a person filled the
  // form in, the second so a retry replaces the first attempt instead of
  // arriving as a second inquiry.
  const openedAt = useRef<number | null>(null);
  const submissionId = useRef<string | null>(null);
  useEffect(() => {
    openedAt.current = Date.now();
  }, []);

  /** Clears the result panel; the next send counts as a new submission. */
  const reset = useCallback(() => {
    submissionId.current = null;
    setState((current) => (current.status === "idle" ? current : { status: "idle" }));
  }, []);

  /**
   * Sends the same submission again after a failure. It keeps the submission
   * id, so if the first attempt did reach the provider, the inquiry is not
   * delivered a second time.
   */
  const retry = useCallback(() => formRef.current?.requestSubmit(), []);

  /**
   * Call whenever a field changes: the last result no longer describes what
   * is in the form, and the errors shown are checked again.
   */
  const handleChange = (values: T) => {
    reset();
    if (attempted) setErrors(validate(values));
  };

  const showErrors = (nextErrors: FieldErrors<T>) => {
    setErrors(nextErrors);
    setAttempted(true);
    const firstInvalid = fieldOrder.find((field) => nextErrors[field]);
    if (firstInvalid) document.getElementById(fieldId(firstInvalid))?.focus();
  };

  /** Moves focus to the panel that has just appeared under the form. */
  const focusPanel = (id: string) => document.getElementById(id)?.focus();

  const submit = async (event: FormEvent<HTMLFormElement>, values: T) => {
    event.preventDefault();
    const form = event.currentTarget;
    formRef.current = form;
    // A second click while the first send is in flight is ignored.
    if (state.status === "sending") return;

    const nextErrors = validate(values);
    if (Object.keys(nextErrors).length > 0) {
      setState({ status: "idle" });
      showErrors(nextErrors);
      return;
    }
    setErrors({});
    setAttempted(true);

    const formData = new FormData(form);
    formData.set(
      INQUIRY_META_FIELDS.elapsed,
      String(Date.now() - (openedAt.current ?? Date.now())),
    );
    if (submissionId.current === null) submissionId.current = createSubmissionId();
    formData.set(INQUIRY_META_FIELDS.submission, submissionId.current);

    setState({ status: "sending" });
    let result: InquirySubmissionResult<T>;
    try {
      result = await send(formData);
    } catch {
      // A dropped connection or an error on the server: offer the fallback.
      result = { status: "failed" };
    }

    if (result.status === "invalid") {
      setState({ status: "idle" });
      flushSync(() => showErrors(result.errors));
      return;
    }
    if (result.status === "sent") {
      submissionId.current = null;
      flushSync(() => {
        setState(result);
        setAttempted(false);
        onSent();
      });
      focusPanel(INQUIRY_PANEL_TITLE_ID.sent);
      return;
    }
    flushSync(() => setState(result));
    focusPanel(INQUIRY_PANEL_TITLE_ID.fallback);
  };

  return {
    state,
    errors,
    attempted,
    submit,
    reset,
    retry,
    handleChange,
    sending: state.status === "sending",
  };
}
