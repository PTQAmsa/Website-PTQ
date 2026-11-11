"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Pemberitahuan privasi pendaftaran (UU No. 27/2022 tentang Pelindungan Data
 * Pribadi). Tampil sebagai tautan tebal yang membuka jendela detail. Jendela
 * dipasang langsung di <body> karena tautan ini berada di dalam paragraf.
 */
export function PrivasiLink({ label = "Pemberitahuan Privasi" }: { label?: string }) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && dialog && !dialog.open) dialog.showModal();
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="font-bold text-blue-700 underline hover:text-blue-900">
        {label}
      </button>
      {open &&
        createPortal(
          <dialog
            ref={dialogRef}
            onClose={() => setOpen(false)}
            onClick={(e) => e.target === dialogRef.current && setOpen(false)} // klik di luar kotak = tutup
            className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl p-0 shadow-xl backdrop:bg-black/50"
          >
            <div className="p-6 text-left text-sm leading-relaxed text-gray-700">
              <h2 className="text-lg font-bold text-blue-900">Pemberitahuan Privasi</h2>
              <p className="mt-1 text-xs text-gray-500">Pesantren Tadabbur Al-Qur&apos;an Amsa001 Gadog</p>
              <ul className="mt-4 list-disc space-y-2 pl-5">
                <li>
                  Data ananda dan orang tua/wali yang diisi di formulir ini dipakai untuk proses penerimaan santri baru dan,
                  bila ananda diterima, untuk administrasi selama menjadi santri.
                </li>
                <li>
                  Data hanya dapat diakses oleh panitia pendaftaran dan pengurus pesantren yang berwenang.
                </li>
                <li>
                  Data dapat diserahkan kepada pihak lain hanya bila diperlukan untuk keperluan pendidikan ananda, misalnya
                  sekolah tujuan saat pindah atau pendataan santri yang diwajibkan pemerintah (Kementerian Agama), atau bila
                  diwajibkan oleh hukum. Data tidak pernah dijual atau dipakai untuk promosi pihak lain.
                </li>
              </ul>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-6 w-full rounded-lg bg-blue-700 px-4 py-2.5 font-semibold text-white hover:bg-blue-800"
              >
                Tutup
              </button>
            </div>
          </dialog>,
          document.body,
        )}
    </>
  );
}
