"use client";

import type { ChangeEvent, ReactNode } from "react";
import type { Opsi } from "@/lib/psb/pilihan";

const INPUT_CLASS =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500";

function Label({ label, optional }: { label: string; optional?: boolean }) {
  return (
    <span className="mb-1.5 block text-sm font-medium text-gray-700">
      {label}
      {optional ? (
        <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs font-normal text-gray-500">Opsional</span>
      ) : (
        <span className="ml-0.5 text-red-500">*</span>
      )}
    </span>
  );
}

function Hint({ children }: { children?: ReactNode }) {
  return children ? <span className="mt-1 block text-xs text-gray-400">{children}</span> : null;
}

type InputProps = {
  label: string;
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  hint?: ReactNode;
  optional?: boolean;
  inputMode?: "text" | "numeric" | "tel" | "email";
  maxLength?: number;
  min?: string;
  max?: string;
  className?: string;
};

export function Input({ label, hint, optional, className = "", ...props }: InputProps) {
  return (
    <label className={`block ${className}`}>
      <Label label={label} optional={optional} />
      <input required={!optional} {...props} className={INPUT_CLASS} />
      <Hint>{hint}</Hint>
    </label>
  );
}

type SelectProps = {
  label: string;
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  options: Opsi[];
  placeholder: string;
  hint?: ReactNode;
  className?: string;
};

export function Select({ label, options, placeholder, hint, className = "", ...props }: SelectProps) {
  return (
    <label className={`block ${className}`}>
      <Label label={label} />
      <select required {...props} className={INPUT_CLASS}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Hint>{hint}</Hint>
    </label>
  );
}

/** Pilihan sedikit (2 opsi) → tombol radio besar, lebih mudah disentuh di HP. */
export function RadioCards({
  label,
  name,
  value,
  onChange,
  options,
  className = "",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  options: Opsi[];
  className?: string;
}) {
  return (
    <fieldset className={`block ${className}`}>
      <legend className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
        <span className="ml-0.5 text-red-500">*</span>
      </legend>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex cursor-pointer items-center justify-center rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
              value === option.value
                ? "border-blue-600 bg-blue-50 text-blue-800"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              required
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function TextArea({
  label,
  name,
  value,
  onChange,
  placeholder,
  className = "",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <Label label={label} />
      <textarea required name={name} value={value} onChange={onChange} placeholder={placeholder} rows={3} className={INPUT_CLASS} />
    </label>
  );
}

/** Data dari tahap sebelumnya: tampil saja, tidak bisa diubah. */
export function ReadOnlyField({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-gray-500">{label}</span>
      <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-100 px-3 py-2.5 text-gray-500">
        <span aria-hidden className="text-xs">🔒</span>
        <span className="truncate">{value || "-"}</span>
      </div>
    </div>
  );
}

/**
 * Dua isian berdampingan di layar lebar, dipisah garis tipis supaya tidak
 * terlihat menyatu. Di HP tetap bertumpuk tanpa garis.
 */
export function Row({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-0 md:divide-x md:divide-gray-200 md:[&>*:first-child]:pr-6 md:[&>*:last-child]:pl-6">
      {children}
    </div>
  );
}

export function SectionTitle({ children, note }: { children: ReactNode; note?: ReactNode }) {
  return (
    <div className="md:col-span-2 mt-2 border-b border-gray-200 pb-2">
      <h3 className="text-base font-semibold text-blue-900">{children}</h3>
      {note ? <p className="mt-0.5 text-xs text-gray-500">{note}</p> : null}
    </div>
  );
}
