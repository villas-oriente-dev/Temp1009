import React, { useState, useEffect } from 'react';
import { Header, AppTab } from './components/Header';
import { EmergencyView } from './components/EmergencyView';
import { QRCardGenerator } from './components/QRCardGenerator';
import { ProfileEditor } from './components/ProfileEditor';
import { SecurityModal } from './components/SecurityModal';
import { StrobeModal } from './components/StrobeModal';
import { PinPromptModal } from './components/PinPromptModal';
import { AndroidInstallModal } from './components/AndroidInstallModal';
import { AndroidCodeExplorer } from './components/AndroidCodeExplorer';
import { CameraXScannerModal } from './components/CameraXScannerModal';
import { MedicalProfile, BloodType, EmergencyContact, AllergyItem, ConditionItem, MedicationItem } from './types/medical';
import { 
  loadProfileFromStorage, 
  saveProfileToStorage, 
  getStoredPinHash, 
  DEFAULT_PROFILE 
} from './utils/storage';
import { decodeCompactEmergencyPayload } from './utils/crypto';
import { decodeUltraFastURLPayload } from './utils/fastQREncoder';
import { 
  AlertTriangle, 
  CheckCircle, 
  Shield, 
  Wifi, 
  WifiOff, 
  Smartphone, 
  Camera, 
  FileCode,
  Download,
  Laptop
} from 'lucide-react';

interface CompactDecoded {
  fn?: string;
  bt?: BloodType;
  od?: boolean;
  doc?: string;
  bd?: string;
  ad?: string;
  ct?: string;
  c?: Array<{
    n: string;
    r: string;
    p: string;
    cc: string;
    pr?: boolean;
  }>;
  al?: Array<{
    n: string;
    s: 'Crítica / Anafilaxia' | 'Severa' | 'Moderada' | 'Leve';
    nt?: string;
  }>;
  cd?: Array<{
    n: string;
    ch?: boolean;
    nt?: string;
  }>;
  md?: Array<{
    n: string;
    d?: string;
    f?: string;
  }>;
  si?: string;
  hi?: string;
  pn?: string;
  ph?: string;
}

export default function App() {
  const [currentTab, setCurrentTab] = useState<AppTab>('emergency');
  const [profile, setProfile] = useState<MedicalProfile>(DEFAULT_PROFILE);
  const [scannedProfile, setScannedProfile] = useState<MedicalProfile | null>(null);
  const [isScannedMode, setIsScannedMode] = useState<boolean>(false);
  const [isStrobeOpen, setIsStrobeOpen] = useState<boolean>(false);
  const [isPinPromptOpen, setIsPinPromptOpen] = useState<boolean>(false);
  const [isAndroidInstallOpen, setIsAndroidInstallOpen] = useState<boolean>(false);
  const [isCameraScannerOpen, setIsCameraScannerOpen] = useState<boolean>(false);
  const [isDeviceFrame, setIsDeviceFrame] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [hasPin, setHasPin] = useState<boolean>(Boolean(getStoredPinHash()));
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('12:00');

  // Clock for Android status bar
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Monitor online / offline network state
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Parse QR content string into MedicalProfile
  const handleProcessScannedQR = (rawContent: string) => {
    try {
      let targetPayload = rawContent.trim();
      
      // If URL contains hash #sos=
      if (targetPayload.includes('#sos=')) {
        targetPayload = targetPayload.split('#sos=')[1];
      } else if (targetPayload.startsWith('sosmedico://ficha')) {
        // Deep link format: sosmedico://ficha?fn=...&bt=...
        const urlObj = new URL(targetPayload);
        const fn = urlObj.searchParams.get('fn') || 'Paciente Escaneado';
        const bt = (urlObj.searchParams.get('bt') || 'Desconocido') as BloodType;
        const phone = urlObj.searchParams.get('p') || '+34600112233';

        const reconstructed: MedicalProfile = {
          ...DEFAULT_PROFILE,
          id: `scanned_${Date.now()}`,
          fullName: fn,
          bloodType: bt,
          emergencyContacts: [
            {
              id: 'sc_0',
              name: 'Contacto ICE',
              relationship: 'Familiar Directo',
              phone: phone.replace(/^\+\d{1,4}/, ''),
              countryCode: phone.startsWith('+') ? phone.slice(0, 3) : '+34',
              isPrimary: true,
              notifyViaWhatsApp: true,
            }
          ],
        };
        setScannedProfile(reconstructed);
        setIsScannedMode(true);
        setCurrentTab('emergency');
        setToastMessage(`✓ Ficha médica escaneada: ${fn}`);
        setTimeout(() => setToastMessage(null), 3500);
        return;
      }

      // Try Ultra-Fast payload decoder first
      const fastDecoded = decodeUltraFastURLPayload(targetPayload);
      if (fastDecoded && fastDecoded.fullName) {
        setScannedProfile(fastDecoded);
        setIsScannedMode(true);
        setCurrentTab('emergency');
        setToastMessage(`✓ Ficha médica escaneada: ${fastDecoded.fullName}`);
        setTimeout(() => setToastMessage(null), 3500);
        return;
      }

      // Fallback to classic JSON base64 decoder
      const decoded = decodeCompactEmergencyPayload<CompactDecoded>(targetPayload);
      if (decoded && decoded.fn) {
        const reconstructed: MedicalProfile = {
          id: `scanned_${Date.now()}`,
          updatedAt: new Date().toISOString(),
          fullName: decoded.fn,
          bloodType: decoded.bt || 'Desconocido',
          isOrganDonor: Boolean(decoded.od),
          documentId: decoded.doc || '',
          birthDate: decoded.bd || '',
          address: decoded.ad || '',
          city: decoded.ct || '',
          emergencyContacts: (decoded.c || []).map((c, i) => ({
            id: `sc_${i}`,
            name: c.n,
            relationship: c.r,
            phone: c.p,
            countryCode: c.cc || '+34',
            isPrimary: Boolean(c.pr),
            notifyViaWhatsApp: true,
          })),
          allergies: (decoded.al || []).map((a, i) => ({
            id: `sa_${i}`,
            name: a.n,
            severity: a.s,
            notes: a.nt,
          })),
          conditions: (decoded.cd || []).map((cd, i) => ({
            id: `scd_${i}`,
            name: cd.n,
            isChronic: Boolean(cd.ch),
            notes: cd.nt,
          })),
          medications: (decoded.md || []).map((m, i) => ({
            id: `sm_${i}`,
            name: m.n,
            dosage: m.d,
            frequency: m.f,
          })),
          specialInstructions: decoded.si || '',
          healthInsurance: decoded.hi || '',
          insurancePolicyNumber: decoded.pn || '',
          preferredHospital: decoded.ph || '',
          isEncrypted: false,
          hasPinProtection: false,
          allowPublicAddressInQR: true,
          allowCompactOfflineMode: true,
        };

        setScannedProfile(reconstructed);
        setIsScannedMode(true);
        setCurrentTab('emergency');
        setToastMessage(`✓ Ficha médica escaneada: ${reconstructed.fullName}`);
        setTimeout(() => setToastMessage(null), 3500);
        return;
      }

      setToastMessage('Código QR no contiene un formato médico reconocido');
      setTimeout(() => setToastMessage(null), 3000);
    } catch (e) {
      console.error('Error decodificando QR:', e);
    }
  };

  // Load profile from storage or parse from URL hash if opened via QR code scan
  useEffect(() => {
    const checkHashAndLoad = async () => {
      const hash = window.location.hash;
      if (hash.startsWith('#sos=')) {
        const encoded = hash.replace('#sos=', '');
        handleProcessScannedQR(encoded);
        return;
      }

      // Normal stored profile load
      try {
        const { profile: loaded } = await loadProfileFromStorage();
        setProfile(loaded);
      } catch (err) {
        console.error('Error loading stored profile:', err);
      }
    };

    checkHashAndLoad();
  }, []);

  const handleTabChange = (targetTab: AppTab) => {
    // If user tries to open editor and a PIN is set, verify PIN first
    if (targetTab === 'editor' && getStoredPinHash()) {
      setIsPinPromptOpen(true);
      return;
    }
    setCurrentTab(targetTab);
  };

  const handlePinSuccess = () => {
    setIsPinPromptOpen(false);
    setCurrentTab('editor');
  };

  const handleSaveProfile = async (updated: MedicalProfile) => {
    setProfile(updated);
    await saveProfileToStorage(updated);
    setToastMessage('Ficha médica guardada en la base de datos local');
    setTimeout(() => setToastMessage(null), 3000);
    setCurrentTab('emergency');
  };

  const activeDisplayProfile = isScannedMode && scannedProfile ? scannedProfile : profile;

  const exitScannedMode = () => {
    setIsScannedMode(false);
    setScannedProfile(null);
    window.location.hash = '';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-slide-up">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={handleTabChange}
        hasPin={hasPin}
        isEncrypted={profile.isEncrypted}
        onOpenStrobe={() => setIsStrobeOpen(true)}
        onOpenAndroidInstall={() => setIsAndroidInstallOpen(true)}
        onOpenScanner={() => setIsCameraScannerOpen(true)}
        isDeviceFrame={isDeviceFrame}
        setIsDeviceFrame={setIsDeviceFrame}
      />

      {/* Android SDK Native Callout Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border-b border-emerald-500/30 text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 shadow-inner">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-slate-300 font-medium">
            <strong className="text-emerald-300 font-bold">SDK Oficial de Android (Kotlin 2.0 & Jetpack Compose):</strong> Cero PWA. Código fuente nativo para compilar en Android Studio con CameraX y Room Database.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleTabChange('androidSdk')}
            className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/40 font-bold text-[11px] cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <FileCode className="w-3.5 h-3.5 text-emerald-300" />
            <span>Ver Archivos Kotlin</span>
          </button>
          <button
            onClick={() => setIsAndroidInstallOpen(true)}
            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] cursor-pointer shadow-sm transition-all active:scale-95 shrink-0 flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar Proyecto .ZIP</span>
          </button>
        </div>
      </div>

      {/* Scanned Badge Banner if user opened through QR code */}
      {isScannedMode && (
        <div className="bg-amber-400 text-slate-950 px-4 py-2.5 text-xs font-bold flex items-center justify-between border-b border-amber-500">
          <div className="flex items-center gap-2 max-w-3xl">
            <AlertTriangle className="w-4 h-4 shrink-0 text-slate-900" />
            <span>
              MODO RESCATISTA: Has abierto la ficha de emergencia escaneada para {activeDisplayProfile.fullName}.
            </span>
          </div>
          <button
            onClick={exitScannedMode}
            className="px-3 py-1 rounded-lg bg-black text-white hover:bg-slate-800 text-[11px] cursor-pointer shrink-0"
          >
            Ver Mi Ficha Personal
          </button>
        </div>
      )}

      {/* Device Frame Wrapper or Standard Fluid View */}
      {isDeviceFrame ? (
        <div className="flex-1 py-8 px-4 flex items-center justify-center bg-slate-950">
          {/* Realistic Android Phone Mockup (Google Pixel 8 Pro / Galaxy S24 frame) */}
          <div className="relative w-full max-w-[430px] rounded-[52px] bg-slate-850 p-3.5 shadow-[0_25px_70px_rgba(0,0,0,0.85)] border-[6px] border-slate-750 ring-1 ring-white/10">
            {/* Screen bezel */}
            <div className="relative rounded-[40px] bg-slate-900 overflow-hidden border border-slate-800 flex flex-col min-h-[820px] max-h-[88vh]">
              
              {/* Android Native Status Bar */}
              <div className="bg-slate-900 px-6 py-2.5 flex items-center justify-between text-[11px] font-bold text-slate-300 border-b border-slate-800/80 z-20 shrink-0">
                <span>{currentTime}</span>
                {/* Camera Punch Hole */}
                <div className="w-4 h-4 rounded-full bg-black border border-slate-800 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-900"></div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono">5G</span>
                  <Wifi className="w-3.5 h-3.5 text-slate-300" />
                  <div className="w-5 h-2.5 rounded-sm border border-slate-400 p-0.5 flex items-center">
                    <div className="h-full w-full bg-emerald-400 rounded-2xs"></div>
                  </div>
                </div>
              </div>

              {/* In-device scrollable app screen */}
              <div className="flex-1 overflow-y-auto bg-slate-100 text-slate-900">
                {currentTab === 'emergency' && (
                  <EmergencyView
                    profile={activeDisplayProfile}
                    isScannedView={isScannedMode}
                    onEditProfile={() => handleTabChange('editor')}
                    onOpenStrobe={() => setIsStrobeOpen(true)}
                    onOpenAndroidInstall={() => setIsAndroidInstallOpen(true)}
                  />
                )}
                {currentTab === 'qr' && (
                  <QRCardGenerator
                    profile={profile}
                    onPreviewEmergencyView={() => setCurrentTab('emergency')}
                  />
                )}
                {currentTab === 'editor' && (
                  <ProfileEditor
                    initialProfile={profile}
                    onSave={handleSaveProfile}
                    onCancel={() => setCurrentTab('emergency')}
                  />
                )}
                {currentTab === 'security' && (
                  <SecurityModal
                    profile={profile}
                    onUpdateProfile={(updated) => {
                      setProfile(updated);
                      saveProfileToStorage(updated);
                      setHasPin(Boolean(getStoredPinHash()));
                      setToastMessage('Configuración de seguridad actualizada');
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                    onClose={() => setCurrentTab('emergency')}
                  />
                )}
                {currentTab === 'androidSdk' && (
                  <AndroidCodeExplorer profile={profile} />
                )}
              </div>

              {/* Android Gesture Bar */}
              <div className="bg-slate-900 py-2 flex items-center justify-center border-t border-slate-800 shrink-0">
                <div className="w-32 h-1 bg-slate-500 rounded-full"></div>
              </div>

            </div>
          </div>
        </div>
      ) : (
        /* Expanded Fluid Layout */
        <main className="flex-1 pb-16 bg-slate-100 text-slate-900">
          {currentTab === 'emergency' && (
            <EmergencyView
              profile={activeDisplayProfile}
              isScannedView={isScannedMode}
              onEditProfile={() => handleTabChange('editor')}
              onOpenStrobe={() => setIsStrobeOpen(true)}
              onOpenAndroidInstall={() => setIsAndroidInstallOpen(true)}
            />
          )}

          {currentTab === 'qr' && (
            <QRCardGenerator
              profile={profile}
              onPreviewEmergencyView={() => setCurrentTab('emergency')}
            />
          )}

          {currentTab === 'editor' && (
            <ProfileEditor
              initialProfile={profile}
              onSave={handleSaveProfile}
              onCancel={() => setCurrentTab('emergency')}
            />
          )}

          {currentTab === 'security' && (
            <SecurityModal
              profile={profile}
              onUpdateProfile={(updated) => {
                setProfile(updated);
                saveProfileToStorage(updated);
                setHasPin(Boolean(getStoredPinHash()));
                setToastMessage('Configuración de seguridad actualizada');
                setTimeout(() => setToastMessage(null), 3000);
              }}
              onClose={() => setCurrentTab('emergency')}
            />
          )}

          {currentTab === 'androidSdk' && (
            <AndroidCodeExplorer profile={profile} />
          )}
        </main>
      )}

      {/* Android Install / SDK Code Modal */}
      <AndroidInstallModal
        isOpen={isAndroidInstallOpen}
        onClose={() => setIsAndroidInstallOpen(false)}
        profile={profile}
      />

      {/* Real CameraX QR Scanner Modal */}
      <CameraXScannerModal
        isOpen={isCameraScannerOpen}
        onClose={() => setIsCameraScannerOpen(false)}
        onScanSuccess={handleProcessScannedQR}
      />

      {/* Strobe Light Modal */}
      <StrobeModal
        isOpen={isStrobeOpen}
        onClose={() => setIsStrobeOpen(false)}
      />

      {/* PIN Prompt Modal */}
      <PinPromptModal
        isOpen={isPinPromptOpen}
        onSuccess={handlePinSuccess}
        onClose={() => setIsPinPromptOpen(false)}
      />

      {/* Offline Status & Android SDK Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-6 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300 font-semibold">
              QR SOS Médico • Versión Nativa Oficial Android SDK (Kotlin & Jetpack Compose)
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Conectado (Llamadas & Ficha lista)</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                  <span>100% Modo Offline Activo</span>
                </>
              )}
            </span>
            <span className="text-slate-500">|</span>
            <button
              onClick={() => handleTabChange('androidSdk')}
              className="hover:underline text-emerald-400 font-bold cursor-pointer"
            >
              Código Android Studio (.ZIP)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
