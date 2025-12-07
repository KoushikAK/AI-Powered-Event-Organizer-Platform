/* eslint-disable react-hooks/purity */
"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, UploadCloud, X } from "lucide-react";

/**
 * Props:
 *  - open: boolean
 *  - onOpenChange(boolean)
 *  - onDetected(payload)  // called when QR decoded (you will plug decoder)
 */
export default function QRScannerModal({ open = false, onOpenChange, onDetected }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      // cleanup when modal closed
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
        setStream(null);
      }
      return;
    }

    async function startCamera() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
        setScanning(true);
        setError("");
      } catch (e) {
        setError("Camera access denied or not available.");
        setScanning(false);
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
      setScanning(false);
    };
  }, [open]);

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const v = videoRef.current;
    const c = canvasRef.current;
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    const ctx = c.getContext("2d");
    ctx.drawImage(v, 0, 0, c.width, c.height);
    // Expose image data for decoder
    const imageData = ctx.getImageData(0, 0, c.width, c.height);
    return imageData;
  };

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      // you can pass reader.result (dataURL) to your decoder
      onDetected?.(reader.result);
      onOpenChange?.(false);
    };
    reader.readAsDataURL(file);
  };

  const handleManualScan = async () => {
    // Grab a frame and call the decoder (not included here).
    const img = captureFrame();
    // TODO: feed `img` to your chosen QR decoder library and call onDetected(decodedValue)
    // Example: const decoded = await decodeFromImageData(img);
    // onDetected(decoded);
    // For now, show a toast or console
    console.log("Captured frame for decoding (plug in decoder)", img);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Scan QR Code</DialogTitle>
            <div className="text-xs text-slate-400">Scan using your camera or upload an image</div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="relative rounded-xl overflow-hidden bg-black/70 flex items-center justify-center" style={{ minHeight: 300 }}>
            {error ? (
              <div className="p-6 text-center text-slate-300">{error}</div>
            ) : (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                {/* scanning guide */}
                <div className="absolute border-2 border-white/20 rounded-lg w-3/4 h-3/4 pointer-events-none" />
                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                  <button onClick={handleManualScan} className="px-3 py-2 rounded-md bg-white/6 text-white backdrop-blur-sm">
                    <Camera className="w-4 h-4 inline mr-2" /> Capture
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white/4 border border-white/6 backdrop-blur-sm">
              <h4 className="text-sm font-semibold text-white">Upload image</h4>
              <p className="text-xs text-slate-300 mt-1">Upload an image of a QR code if camera isn't available.</p>
              <label className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white cursor-pointer">
                <UploadCloud className="w-4 h-4" /> <span className="text-sm">Upload QR</span>
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              </label>
            </div>

            <div className="p-4 rounded-xl bg-white/3 border border-white/6 backdrop-blur-sm text-xs text-slate-300">
              <p><strong>Tips</strong></p>
              <ul className="list-disc pl-4 mt-2">
                <li>Ensure the QR is clear and well-lit.</li>
                <li>Use the upload option for screenshots or printed tickets.</li>
                <li>For automatic decoding, plug a QR library (e.g. @zxing/library) and feed the canvas image data.</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => onOpenChange?.(false)} variant="ghost">Cancel</Button>
              <Button onClick={() => { /* you might want to start a continuous scan loop here */ }} className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">Start Scan</Button>
            </div>
          </div>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
}
