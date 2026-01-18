import React, { useEffect, useRef } from 'react';

const AdBanner: React.FC = () => {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const banner = bannerRef.current;
    if (!banner) return;

    // Check if ad is already loaded
    if (banner.hasChildNodes()) return;

    const iframe = document.createElement('iframe');
    // Basic attributes
    iframe.width = "728";
    iframe.height = "90";
    iframe.frameBorder = "0";
    iframe.scrolling = "no";
    
    // Styling to ensure it looks correct
    Object.assign(iframe.style, {
        border: 'none',
        overflow: 'hidden',
        display: 'block',
        margin: '0 auto'
    });
    
    banner.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
              <meta charset="UTF-8">
              <base target="_blank" />
              <style>
                  body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background-color: transparent; }
              </style>
          </head>
          <body>
            <script type="text/javascript">
              atOptions = {
                'key' : '6616fc8083833828a773136e9f0fd832',
                'format' : 'iframe',
                'height' : 90,
                'width' : 728,
                'params' : {}
              };
            </script>
            <script type="text/javascript" src="https://www.highperformanceformat.com/6616fc8083833828a773136e9f0fd832/invoke.js"></script>
          </body>
        </html>
      `);
      doc.close();
    }
  }, []);

  return (
    <div className="hidden md:flex justify-center items-center w-full py-2 bg-slate-50/50 border-y border-slate-100 my-2">
        <div 
            ref={bannerRef} 
            className="w-[728px] h-[90px] bg-white shadow-sm rounded-lg overflow-hidden flex items-center justify-center relative z-10"
            aria-label="Advertisement"
        >
            {/* Placeholder / Loading State if needed, though script loads fast */}
        </div>
    </div>
  );
};

export default AdBanner;