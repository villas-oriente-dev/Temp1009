import React from 'react';
import { 
  Shield, 
  QrCode, 
  FileText, 
  Lock, 
  Volume2, 
  VolumeX, 
  AlertTriangle, 
  Smartphone, 
  Download, 
  Camera, 
  FileCode,
  Laptop
} from 'lucide-react';
import { isAlarmRunning, startSOSAlarm, stopSOSAlarm } from '../utils/audioAlert';

export type AppTab = 'emergency' | 'qr' | 'editor' | 'security' | 'androidSdk';

interface HeaderProps {
  currentTab: AppTab;
  setCurrentTab: (tab: AppTab) => void;
  hasPin: boolean;
  isEncrypted: boolean;
  onOpenStrobe: () => void;
  onOpenAndroidInstall: () => void;
  onOpenScanner: () => void;
  isDeviceFrame: boolean;
  setIsDeviceFrame: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  hasPin,
  isEncrypted,
  onOpenStrobe,
  onOpenAndroidInstall,
  onOpenScanner,
  isDeviceFrame,
  setIsDeviceFrame,
}) => {
  const [alarmActive, setAlarmActive] = React.useState(isAlarmRunning());

  const toggleAlarm = () => {
    if (alarmActive) {
      stopSOSAlarm((active) => setAlarmActive(active));
    } else {
      startSOSAlarm((active) => setAlarmActive(active));
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-lg">
      {/* Top emergency status banner */}
      <div className="bg-red-700 text-white px-4 py-1.5 text-xs font-semibold flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <span className="truncate">SISTEMA ANDROID NATIVO • KOTLIN SDK 35 • 100% OFFLINE</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => setIsDeviceFrame(!isDeviceFrame)}
            title="Alternar vista de marco Android / Pantalla completa"
            className="hidden md:flex items-center gap-1 font-bold text-slate-200 hover:text-white bg-black/25 hover:bg-black/40 px-2 py-0.5 rounded cursor-pointer transition-colors text-[11px]"
          >
            {isDeviceFrame ? <Laptop className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
            <span>{isDeviceFrame ? 'Vista Expandida' : 'Marco Celular'}</span>
          </button>

          <button
            onClick={onOpenAndroidInstall}
            className="flex items-center gap-1 font-black text-emerald-200 bg-emerald-950/80 hover:bg-emerald-900 px-2 py-0.5 rounded cursor-pointer transition-colors border border-emerald-500/40"
          >
            <Download className="w-3.5 h-3.5 text-emerald-300" />
            <span>Código Android Studio</span>
          </button>
          
          <button
            onClick={onOpenStrobe}
            title="Linterna estroboscópica de auxilio"
            className="hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span className="hidden sm:inline">Luz Flash</span> 🚨
          </button>

          <button
            onClick={toggleAlarm}
            className={`flex items-center gap-1 px-2 py-0.5 rounded font-bold transition-colors cursor-pointer ${
              alarmActive ? 'bg-amber-400 text-slate-900 animate-bounce' : 'bg-red-800 hover:bg-red-900 text-white'
            }`}
          >
            {alarmActive ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{alarmActive ? 'SILENCIAR' : 'SIRENA SOS'}</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div
            onClick={() => setCurrentTab('emergency')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center shadow-md shadow-red-900/50 group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-red-400 transition-colors">
                  QR SOS Médico
                </span>
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <Smartphone className="w-3 h-3 text-emerald-400" />
                  ANDROID SDK
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Edición Oficial Android Nativo • Jetpack Compose & CameraX
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setCurrentTab('emergency')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                currentTab === 'emergency'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-amber-300" />
              <span>Ficha SOS</span>
            </button>

            <button
              onClick={onOpenScanner}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer transition-all"
            >
              <Camera className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Escanear</span> QR
            </button>

            <button
              onClick={() => setCurrentTab('qr')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                currentTab === 'qr'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Generar QR</span>
            </button>

            <button
              onClick={() => setCurrentTab('editor')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                currentTab === 'editor'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="hidden md:inline">Editar</span> Perfil
            </button>

            <button
              onClick={() => setCurrentTab('security')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                currentTab === 'security'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Lock className={`w-4 h-4 ${hasPin || isEncrypted ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className="hidden lg:inline">Seguridad</span>
            </button>

            <button
              onClick={() => setCurrentTab('androidSdk')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                currentTab === 'androidSdk'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                  : 'bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60 border border-emerald-500/40'
              }`}
            >
              <FileCode className="w-4 h-4 text-emerald-400" />
              <span>Código Kotlin SDK</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
