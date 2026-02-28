'use client';

import { useEffect, useRef, useState } from 'react';

export default function VideoSection() {
  const videoRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  return (
    <>
        <section ref={videoRef} className="relative w-full h-screen bg-black">
        <div className="absolute inset-0">
          <iframe
            src={`https://www.youtube.com/embed/TX95SRptQBo?autoplay=${isVisible ? '1' : '0'}&mute=1&loop=1&playlist=TX95SRptQBo&controls=0&showinfo=0&rel=0&modestbranding=1`}
            title="Pesantren Tadabbur Al-Qur'an Amsa001"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
            style={{
              border: 'none',
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '100vw',
              height: '100vh',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none'
            }}
          />
        </div>
      </section>
    </>
  );
}
