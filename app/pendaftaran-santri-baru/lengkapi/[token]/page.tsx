import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { cariPendaftarDariToken } from '@/lib/psb/lengkapi';
import { linkWhatsApp } from '@/lib/psb/pilihan';
import LengkapiForm, { type DataAwal } from './LengkapiForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Lengkapi Data Pendaftaran | PTQ Amsa001',
  robots: { index: false, follow: false },
  referrer: 'no-referrer', // token di URL tidak ikut terkirim ke situs lain
};

const WA_ADMIN = '6285692253516';

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function LengkapiPage({ params }: PageProps) {
  const { token } = await params;
  const pendaftar = await cariPendaftarDariToken(token);

  let isi: ReactNode;
  if (!pendaftar) {
    isi = (
      <Pesan
        judul="Link tidak berlaku"
        teks="Link ini salah, sudah diganti, atau sudah tidak aktif. Silakan minta link terbaru kepada admin melalui WhatsApp."
      />
    );
  } else if (pendaftar.data_lengkap_at) {
    isi = (
      <Pesan
        judul="Data sudah lengkap"
        teks={`Jazakumullahu khairan. Data dan dokumen ${pendaftar.nama_lengkap} sudah kami terima. Admin akan menghubungi Anda untuk jadwal tes masuk. Bila ada data yang perlu diperbaiki, hubungi admin melalui WhatsApp.`}
        sukses
      />
    );
  } else {
    // URL dokumen tidak dikirim ke browser — cukup tanda sudah/belum diunggah
    const { url_kk, url_akta, url_ijazah, url_ktp_ortu, url_pas_foto, url_surat_sehat, data_lengkap_at, ...data } =
      pendaftar;
    void data_lengkap_at;
    const dataAwal: DataAwal = {
      ...data,
      dokumenAda: {
        kk: Boolean(url_kk),
        akta: Boolean(url_akta),
        ijazah: Boolean(url_ijazah),
        ktpOrtu: Boolean(url_ktp_ortu),
        pasFoto: Boolean(url_pas_foto),
        suratSehat: Boolean(url_surat_sehat),
      },
    };
    isi = <LengkapiForm token={token} data={dataAwal} />;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <section className="bg-gradient-to-br from-blue-800 via-blue-900 to-blue-950 pb-10 pt-24 text-center md:pt-32">
        <h1 className="px-4 text-3xl font-bold text-white md:text-5xl">Lengkapi Data Pendaftaran</h1>
        <p className="mt-3 px-4 text-blue-100">Penerimaan Santri Baru PTQ Amsa001 Tahun Ajaran 2027/2028</p>
      </section>
      <section className="px-4 py-10">{isi}</section>
      <Footer />
    </main>
  );
}

function Pesan({ judul, teks, sukses = false }: { judul: string; teks: string; sukses?: boolean }) {
  return (
    <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow-md">
      <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-2xl ${sukses ? 'bg-emerald-100' : 'bg-amber-100'}`}>
        {sukses ? '✓' : '!'}
      </div>
      <h2 className="mb-3 text-2xl font-bold text-blue-900">{judul}</h2>
      <p className="mb-6 text-gray-600">{teks}</p>
      <a
        href={linkWhatsApp(WA_ADMIN)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
      >
        Hubungi Admin via WhatsApp
      </a>
    </div>
  );
}
