export default function Admission() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-yellow-400 to-yellow-500">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-white rounded-3xl shadow-2xl p-10 md:p-16">
          <div className="mb-6">
            <span className="text-6xl mb-4 block">🎓</span>
            <h2 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4">
              Penerimaan Santri Baru
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          </div>
          
          <div className="bg-blue-50 rounded-2xl p-8 mb-8">
            <div className="text-blue-800 mb-4">
              <div className="text-2xl font-bold mb-2">SMP - SMA Sederajat</div>
              <div className="text-xl font-semibold text-blue-600">Putra & Putri</div>
            </div>
            <div className="border-t-2 border-blue-200 my-6"></div>
            <div className="text-blue-800">
              <div className="text-lg font-semibold mb-2">Tahun Ajaran</div>
              <div className="text-3xl font-bold text-blue-700">2026-2027 M</div>
              <div className="text-xl font-semibold text-blue-600">1447-1448 H</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-xl">
              <div className="text-3xl mb-2">📚</div>
              <div className="font-bold text-lg">Program Tahfidz</div>
              <div className="text-sm opacity-90">Menghafal dan Tadabbur</div>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-xl">
              <div className="text-3xl mb-2">🎯</div>
              <div className="font-bold text-lg">Sistem Project</div>
              <div className="text-sm opacity-90">Pembelajaran Menyenangkan</div>
            </div>
          </div>

          <a 
            href="https://docs.google.com/forms/d/e/1FAIpQLScJMfCAipPLibI5bb8VKpoikXMDcR16VjzouwRDzMWkM2CqNQ/viewform" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-10 py-4 rounded-full font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            📝 Daftar Online Sekarang
          </a>
        </div>
      </div>
    </section>
  );
}
