import React, { useEffect, useRef, useState } from "react";

interface QrScannerProps {
  /** Called once per distinct code read; scanning pauses until `resume`. */
  onScan: (value: string) => void;
  paused?: boolean;
}

const ELEMENT_ID = "academy-qr-reader";

/**
 * Camera QR reader. Prefers the rear camera (phones). The library is loaded
 * on the client only because it touches `window` at import time.
 */
const QrScanner = ({ onScan, paused }: QrScannerProps) => {
  const scannerRef = useRef<import("html5-qrcode").Html5Qrcode | null>(null);
  const onScanRef = useRef(onScan);
  const pausedRef = useRef(paused);
  const [error, setError] = useState<string | null>(null);

  onScanRef.current = onScan;
  pausedRef.current = paused;

  useEffect(() => {
    let cancelled = false;
    let lastValue = "";
    let lastAt = 0;

    (async () => {
      const { Html5Qrcode } = await import("html5-qrcode");
      if (cancelled) return;
      const scanner = new Html5Qrcode(ELEMENT_ID, { verbose: false });
      scannerRef.current = scanner;
      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 240, height: 240 } },
          (text) => {
            if (pausedRef.current) return;
            const now = Date.now();
            // Ignore the same code being read repeatedly while still in view.
            if (text === lastValue && now - lastAt < 4000) return;
            lastValue = text;
            lastAt = now;
            onScanRef.current(text);
          },
          () => undefined
        );
      } catch {
        if (!cancelled) {
          setError(
            "No se pudo acceder a la cámara. Revisa los permisos del navegador o ingresa el código manualmente."
          );
        }
      }
    })();

    return () => {
      cancelled = true;
      const scanner = scannerRef.current;
      if (scanner?.isScanning) {
        scanner
          .stop()
          .then(() => scanner.clear())
          .catch(() => undefined);
      }
    };
  }, []);

  return (
    <div className="w-full">
      <div
        id={ELEMENT_ID}
        className="w-full max-w-md mx-auto rounded-xl overflow-hidden bg-black min-h-[240px]"
      />
      {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}
    </div>
  );
};

export default QrScanner;
