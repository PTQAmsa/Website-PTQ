'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { kolomEdit, validasiKolom } from '@/lib/psb/edit-admin';
import type { RegistrationRecord } from '@/lib/types/registration';

const INPUT_CLASS =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500';

/** Form edit data pendaftar oleh admin (mis. wali minta ganti data). */
export default function EditDataForm({ reg, onClose }: { reg: RegistrationRecord; onClose: () => void }) {
  const router = useRouter();
  const kolom = kolomEdit(reg);
  const record = reg as unknown as Record<string, unknown>;
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(kolom.map((k) => [k.column, record[k.column] == null ? '' : String(record[k.column])]))
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const grup = [...new Set(kolom.map((k) => k.grup))];

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    for (const k of kolom) {
      const result = validasiKolom(k, values[k.column]);
      if ('error' in result) return setError(result.error);
    }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/edit-pendaftaran', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationId: reg.id, data: values }),
      });
      if (res.status === 401) {
        window.location.reload(); // sesi habis → tampilkan form login
        return;
      }
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) throw new Error(json.error ?? 'Gagal menyimpan perubahan');
      router.refresh();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {grup.map((g) => (
        <fieldset key={g}>
          <legend className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">{g}</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            {kolom
              .filter((k) => k.grup === g)
              .map((k) => {
                const common = {
                  name: k.column,
                  value: values[k.column],
                  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
                    setValues((prev) => ({ ...prev, [k.column]: e.target.value })),
                  className: INPUT_CLASS,
                };
                return (
                  <label key={k.column} className={`block ${k.kind === 'textarea' ? 'sm:col-span-2' : ''}`}>
                    <span className="mb-1 block text-xs font-medium text-gray-500">
                      {k.label}
                      {k.wajib ? <span className="ml-0.5 text-red-500">*</span> : null}
                    </span>
                    {k.kind === 'select' ? (
                      <select {...common}>
                        <option value="">-</option>
                        {(k.options ?? []).map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    ) : k.kind === 'textarea' ? (
                      <textarea {...common} rows={3} maxLength={k.max} />
                    ) : (
                      <input
                        {...common}
                        type={k.kind === 'date' ? 'date' : k.kind === 'number' ? 'number' : 'text'}
                        min={k.kind === 'number' ? 1 : undefined}
                        maxLength={k.max}
                      />
                    )}
                  </label>
                );
              })}
          </div>
        </fieldset>
      ))}

      <p className="text-xs text-gray-400">
        Dokumen tidak diubah di sini. Bila wali perlu mengganti dokumen, gunakan &ldquo;Buka kembali untuk perbaikan&rdquo;
        di kartu Proses Pendaftaran.
      </p>

      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={saving}
          className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
