import React, { useEffect, useRef } from 'react';

const NativeAdBanner: React.FC = () => {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const banner = bannerRef.current;
    if (!banner) return;

    // Check if ad is already loaded
    if (banner.hasChildNodes()) return;

    const iframe = document.createElement('iframe');
    // Native ads usually require more height or responsive layout
    iframe.width = "100%";
    iframe.height = "100%"; 
    iframe.frameBorder = "0";
    iframe.scrolling = "no";
    
    // Styling to ensure it looks correct
    Object.assign(iframe.style, {
        border: 'none',
        overflow: 'hidden',
        display: 'block',
        margin: '0 auto',
        maxWidth: '100%',
        height: '100%'
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
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <base target="_blank" />
              <style>
                  body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background-color: transparent; font-family: sans-serif; height: 100%; overflow: hidden; }
                  #container-e68745a091e95cfe69be2dfef851c4fc { width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; }
                  img { max-width: 100%; height: auto; display: block; }
              </style>
          </head>
          <body>
            <div id="container-e68745a091e95cfe69be2dfef851c4fc"></div>
            <script async="async" data-cfasync="false" src="https://pl28504123.effectivegatecpm.com/e68745a091e95cfe69be2dfef851c4fc/invoke.js"></script>
          </body>
        </html>
      `);
      doc.close();
    }
  }, []);

  return (
    <div className="w-full py-4 bg-transparent flex justify-center items-center my-2 px-4 sm:px-6 lg:px-8">
        <div 
            ref={bannerRef} 
            className="w-full max-w-7xl h-[160px] md:h-[200px] bg-white rounded-xl overflow-hidden flex items-center justify-center relative z-10 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300"
            aria-label="Sponsored Content"
        >
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10 text-slate-300">
                <span className="text-[10px] font-bold uppercase tracking-widest">Sponsored</span>
             </div>
        </div>
    </div>
  );
};

export default NativeAdBanner;