"use client";

import {
  useState,
  type ReactNode,
  type LabelHTMLAttributes,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  DuplicateSignupError,
  submitSignup,
  type SignupPayload,
} from "@/lib/appwrite";

const eventOptions = [
  "Corporate Summits",
  "Luxury Weddings",
  "Music & Culture Festivals",
  "Launch Parties",
  "Workshops & Retreats",
];

const phoneRegex =
  /^(\+?\d{1,4}[\s-]?)?(\(?\d{2,4}\)?[\s-]?)?[\d\s-]{5,14}$/;

const signupSchema = z.object({
  fullName: z
    .string()
    .min(1, "Please add your full name.")
    .max(80, "Name looks too long."),
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),
  phone: z
    .string()
    .optional()
    .transform((value) => value?.trim() || undefined)
    .refine(
      (value) => !value || phoneRegex.test(value),
      "Use a valid phone number."
    ),
  eventInterests: z
    .array(z.string())
    .min(1, "Pick at least one event type."),
  notes: z
    .string()
    .max(400, "Keep notes under 400 characters.")
    .optional()
    .transform((value) => value?.trim() || undefined),
  marketingConsent: z.literal<boolean>(true, {
    errorMap: () => ({
      message: "Please confirm we can contact you.",
    }),
  }),
});

type FormValues = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      notes: "",
      eventInterests: [],
      marketingConsent: false,
    },
  });

  const selectedInterests = watch("eventInterests");

  const onSubmit = async (values: FormValues) => {
    setStatus("idle");
    setServerError(null);

    try {
      const payload: SignupPayload = {
        fullName: values.fullName.trim(),
        email: values.email.toLowerCase(),
        phone: values.phone,
        eventInterests: values.eventInterests,
        notes: values.notes,
        marketingConsent: values.marketingConsent,
      };

      await submitSignup(payload);
      setStatus("success");
      reset({
        fullName: "",
        email: "",
        phone: "",
        notes: "",
        eventInterests: [],
        marketingConsent: false,
      });
    } catch (error) {
      if (error instanceof DuplicateSignupError) {
        setStatus("error");
        setServerError(
          "Looks like you're already on our list. We'll be in touch with the latest happenings."
        );
        return;
      }

      setStatus("error");
      setServerError(
        error instanceof Error
          ? error.message
          : "We ran into a problem saving your details. Please try again."
      );
    }
  };

  const toggleInterest = (interest: string, checked: boolean) => {
    const nextValues = checked
      ? [...selectedInterests, interest]
      : selectedInterests.filter((value) => value !== interest);

    setValue("eventInterests", nextValues, {
      shouldValidate: true,
    });
  };

  return (
    <section
      id="signup"
      className="relative isolate px-6 pb-24 pt-16 sm:px-8 lg:px-12"
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-neutral-950 via-neutral-950 to-neutral-900" />
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/[0.05] p-[1px] shadow-[0_40px_120px_-40px_rgba(236,72,153,0.35)]">
        <div className="rounded-[calc(1.5rem-1px)] border border-white/5 bg-neutral-950/80 px-6 py-10 sm:px-10 sm:py-14">
          <div className="mx-auto flex max-w-2xl flex-col gap-4 text-center">
            <span className="self-center text-xs uppercase tracking-[0.4em] text-pink-200/70">
              Sign up
            </span>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              Start your journey with JAM
            </h2>
            <p className="text-sm text-neutral-300 sm:text-base">
              Share your details and preferences to unlock curated events,
              priority invites, and planning advice tailored to your next
              celebration.
            </p>
          </div>

          <form
            className="mx-auto mt-10 grid max-w-3xl gap-6 text-left"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <Field>
                <Label htmlFor="fullName">Full name *</Label>
                <Input
                  id="fullName"
                  autoComplete="name"
                  placeholder="Jordan Avery Morgan"
                  {...register("fullName")}
                />
                <ErrorMessage message={errors.fullName?.message} />
              </Field>

              <Field>
                <Label htmlFor="email">Email address *</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@jamevents.com"
                  {...register("email")}
                />
                <ErrorMessage message={errors.email?.message} />
              </Field>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field>
                <Label htmlFor="phone">Phone number</Label>
                <Input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+34 600 000 000"
                  {...register("phone")}
                />
                <ErrorMessage message={errors.phone?.message} />
              </Field>

              <Field>
                <Label>Event interests *</Label>
                <div className="flex flex-wrap gap-2">
                  {eventOptions.map((option) => {
                    const checked = selectedInterests.includes(option);
                    return (
                      <button
                        type="button"
                        key={option}
                        onClick={() => toggleInterest(option, !checked)}
                        className={`rounded-full border px-4 py-2 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400 ${
                          checked
                            ? "border-transparent bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 text-white"
                            : "border-white/20 bg-white/[0.04] text-neutral-200 hover:border-white/40 hover:text-white"
                        }`}
                        aria-pressed={checked}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                <ErrorMessage message={errors.eventInterests?.message} />
              </Field>
            </div>

            <Field>
              <Label htmlFor="notes">Additional notes</Label>
              <Textarea
                id="notes"
                rows={4}
                placeholder="Tell us about the experience you imagine, guest count, timing, or anything else you'd like us to know."
                {...register("notes")}
              />
              <ErrorMessage message={errors.notes?.message} />
            </Field>

            <Field>
              <label className="flex items-start gap-3 text-sm text-neutral-200">
                <input
                  type="checkbox"
                  className="mt-1 h-5 w-5 rounded border border-white/30 bg-white/10 text-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400"
                  {...register("marketingConsent")}
                />
                <span>
                  I consent to receiving event invitations, insider updates, and
                  curated inspiration from JAM Events via email.
                </span>
              </label>
              <ErrorMessage message={errors.marketingConsent?.message} />
            </Field>

            {serverError && (
              <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                {serverError}
              </div>
            )}

            {status === "success" && (
              <div className="rounded-xl border border-emerald-300/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                Thank you! Our concierge team will reach out shortly with
                tailored experiences and upcoming highlights.
              </div>
            )}

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/30 transition hover:scale-[1.01] hover:shadow-pink-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2 inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Sending…
                </>
              ) : (
                "Submit details"
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

function Label(props: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className="text-sm font-medium text-neutral-200"
      {...props}
    >
      {props.children}
    </label>
  );
}

const baseInputStyles =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-neutral-400 transition hover:border-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400";

function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={baseInputStyles} {...props} />;
}

function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={baseInputStyles} {...props} />;
}

function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-xs font-medium text-rose-200/90" role="alert">
      {message}
    </p>
  );
}
