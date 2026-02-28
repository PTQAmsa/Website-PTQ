export default function PSBBanner() {
  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <a 
          href="https://docs.google.com/forms/d/e/1FAIpQLScJMfCAipPLibI5bb8VKpoikXMDcR16VjzouwRDzMWkM2CqNQ/viewform"
          target="_blank"
          rel="noopener noreferrer"
          className="block relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.02] group"
        >
          <img 
            src="/psb-banner.jpg" 
            alt="Penerimaan Santri Baru PTQ Amsa001"
            className="w-full h-auto object-cover"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/10 transition-all duration-300"></div>
          
          {/* Optional: CTA Button Overlay */}
          <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-full font-bold shadow-lg">
              Daftar Sekarang →
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}
