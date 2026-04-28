'use client';

import { useKYCStore } from './useKYCStore';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, CheckCircle2, RefreshCw } from 'lucide-react';

export default function StepFaceMatch() {
  const { setCurrentKycStep, updateKycProgress } = useKYCStore();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isStreamActive, setIsStreamActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setIsStreamActive(false);
  }, []);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsStreamActive(true);
      }
    } catch {
      setCameraError('Camera access denied or unavailable. Please allow camera permissions and try again.');
    }
  }, []);

  useEffect(() => {
    if (!capturedImage) startCamera();
    return () => stopCamera();
  }, [capturedImage, startCamera, stopCamera]);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current || !isStreamActive) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);
    stopCamera();
  };

  const handleRetake = () => setCapturedImage(null);

  const handleNext = () => {
    updateKycProgress(4);
    setCurrentKycStep(5);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Verify with a selfie</h2>
      </div>

      <div className="relative w-full h-[260px] bg-gray-900 rounded-xl overflow-hidden flex items-center justify-center border-4 border-gray-100">
        {capturedImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={capturedImage} alt="Selfie preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <CheckCircle2 className="w-16 h-16 text-green-400 drop-shadow-lg" />
            </div>
            <button
              onClick={handleRetake}
              className="absolute bottom-4 right-4 bg-gray-800/80 hover:bg-gray-700 rounded-full p-2 transition-colors"
            >
              <RefreshCw className="w-5 h-5 text-white" />
            </button>
          </>
        ) : cameraError ? (
          <div className="text-center px-6 space-y-3">
            <p className="text-sm text-gray-300">{cameraError}</p>
            <button
              onClick={startCamera}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-cover scale-x-[-1]"
              autoPlay
              playsInline
              muted
            />
            <button
              onClick={handleCapture}
              disabled={!isStreamActive}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-red-500 hover:bg-red-600 disabled:opacity-40 rounded-full flex items-center justify-center shadow-lg border-4 border-white transition-colors"
            >
              <Camera className="w-5 h-5 text-white stroke-2" />
            </button>
          </>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="bg-[#FFF8E7] border border-[#FBE3A4] rounded-xl p-5 space-y-3">
        <p className="text-sm font-bold text-[#8A5100]">Note:</p>
        <ul className="space-y-2">
          <li className="flex gap-2 text-sm text-[#8A5100]">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            Ensure camera/phone is ready and working
          </li>
          <li className="flex gap-2 text-sm text-[#8A5100]">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            Ensure good lighting is available
          </li>
          <li className="flex gap-2 text-sm text-[#8A5100]">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            Ensure the picture is clear because if it isn&apos;t, it can affect your verification
          </li>
        </ul>
      </div>

      <div className="pt-2 flex justify-end gap-3">
        {capturedImage && (
          <button
            onClick={handleRetake}
            className="border border-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Retake
          </button>
        )}
        <button
          onClick={capturedImage ? handleNext : handleCapture}
          disabled={!capturedImage && !isStreamActive}
          className="bg-blue-600 text-white font-medium py-3 px-8 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {capturedImage ? 'Proceed' : 'Capture'}
        </button>
      </div>
    </div>
  );
}
