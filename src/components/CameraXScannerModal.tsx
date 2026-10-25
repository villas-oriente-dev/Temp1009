import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  X, 
  Zap, 
  Image as ImageIcon, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw,
  Flashlight
} from 'lucide-react';
import jsQR from 'jsqr';

interface CameraXScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (qrContent: string) => void;
}

export const CameraXScannerModal: React.FC<CameraXScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [hasTorch, setHasTorch] = useState<boolean>(false);
  const [torchActive, setTorchActive] = useState<boolean>(false);
  const [scanning, setScanning] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      setScanning(true);

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();

        // Check torch capability
        const track = mediaStream.getVideoTracks()[0];
        const capabilities = track.getCapabilities?.() as { torch?: boolean } | undefined;
        if (capabilities && capabilities.torch) {
          setHasTorch(true);
        }

        // Start scanning loop
        scanFrame();
      }
    } catch (err: unknown) {
      console.warn('Error accediendo a la cámara:', err);
      const errMsg = err instanceof Error ? err.message : 'No se pudo acceder a la cámara trasera';
      setCameraError(`Permiso o cámara no disponible: ${errMsg}`);
    }
  };

  const stopCamera = () => {
    if (animFrameId.current) {
      cancelAnimationFrame(animFrameId.current);
      animFrameId.current = null;
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setTorchActive(false);
  };

  const toggleTorch = async () => {
    if (!stream) return;
    const track = stream.getVideoTracks()[0];
    try {
      const newTorchState = !torchActive;
      await (track as any).applyConstraints({
        advanced: [{ torch: newTorchState }],
      });
      setTorchActive(newTorchState);
    } catch {
      // Ignorar si el hardware no responde
    }
  };

  const playBeep = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // AudioContext unavailable
    }
  };

  const scanFrame = () => {
    if (!videoRef.current || !canvasRef.current || !scanning) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code && code.data) {
        setScanning(false);
        playBeep();
        stopCamera();
        onScanSuccess(code.data);
        onClose();
        return;
      }
    }

    animFrameId.current = requestAnimationFrame(scanFrame);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code && code.data) {
        playBeep();
        stopCamera();
        onScanSuccess(code.data);
        onClose();
      } else {
        alert('No se detectó un código QR válido en la imagen seleccionada.');
      }
    };
    img.src = URL.createObjectURL(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col text-white animate-scale-up">
        
        {/* Top Header */}
        <div className="p-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-600/30 border border-red-500/50 flex items-center justify-center text-red-400">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm text-white flex items-center gap-1.5">
                <span>Escáner CameraX Nativo</span>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">
                  Android SDK
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Apunta al código QR del casco, moto o tarjeta de emergencia
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Area */}
        <div className="relative aspect-square sm:aspect-video bg-black flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />

          {/* Android Camera Reticle */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8">
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 border-2 border-red-500/80 rounded-3xl shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]">
              {/* Corner markers */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-red-500 rounded-tl-xl"></div>
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-red-500 rounded-tr-xl"></div>
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-red-500 rounded-bl-xl"></div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-red-500 rounded-br-xl"></div>

              {/* Laser line animation */}
              <div className="absolute inset-x-2 top-0 h-0.5 bg-red-400 shadow-[0_0_12px_#ef4444] animate-bounce"></div>
            </div>
          </div>

          {/* Camera Error Message */}
          {cameraError && (
            <div className="absolute inset-4 bg-slate-900/95 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3 border border-slate-700">
              <AlertTriangle className="w-10 h-10 text-amber-400" />
              <div className="text-xs text-slate-300">
                <strong className="text-white block text-sm">Cámara no disponible</strong>
                {cameraError}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Cargar Imagen con QR desde Galería</span>
              </button>
            </div>
          )}

          {/* Torch button overlay */}
          {hasTorch && (
            <button
              onClick={toggleTorch}
              className={`absolute top-4 right-4 p-3 rounded-2xl backdrop-blur-md border cursor-pointer transition-all ${
                torchActive
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg shadow-amber-500/30'
                  : 'bg-black/50 text-white border-white/20 hover:bg-black/80'
              }`}
            >
              <Flashlight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 bg-slate-850 border-t border-slate-800 flex items-center justify-between text-xs">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <ImageIcon className="w-4 h-4 text-emerald-400" />
            <span>Escanear desde Imagen / Galería</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold cursor-pointer transition-colors"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
