'use client';

import { useEffect, useRef, useState } from 'react';

const VIDEO_ID = 'TX95SRptQBo';
const YOUTUBE_ORIGIN = 'https://www.youtube.com';

export default function VideoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // iframe baru dimuat saat pertama kali terlihat, lalu tidak pernah dimuat ulang.
  // Mengganti src (autoplay=0/1) membuat video mulai dari awal tiap kali digulir.
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHasBeenVisible(true);
        // Putar/jeda lewat YouTube IFrame API (butuh enablejsapi=1)
        iframeRef.current?.contentWindow?.postMessage(
          JSON.stringify({
            event: 'command',
            func: entry.isIntersecting ? 'playVideo' : 'pauseVideo',
            args: [],
          }),
          YOUTUBE_ORIGIN
        );
      },
      { threshold: 0.5 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full h-screen bg-black overflow-hidden">
      {hasBeenVisible && (
        <iframe
          ref={iframeRef}
          src={`${YOUTUBE_ORIGIN}/embed/${VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${VIDEO_ID}&controls=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`}
          title="Pesantren Tadabbur Al-Qur'an Amsa001"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      )}
    </section>
  );
}
