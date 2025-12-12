'use client';

import { useEffect } from 'react';

export default function AdBanner({ dataAdSlot }) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.log('AdSense error', err);
    }
  }, []);

  return (
    <div className="my-8 text-center overflow-hidden">
      <p className="text-xs text-gray-400 mb-2">Advertisement</p>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-YOUR_ACTUAL_ID_HERE"
        data-ad-slot={dataAdSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}