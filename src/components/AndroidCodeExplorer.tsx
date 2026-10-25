import React, { useState } from 'react';
import { 
  FileCode, 
  Folder, 
  Download, 
  Copy, 
  Check, 
  CheckCircle, 
  Terminal, 
  Cpu, 
  Layers, 
  ShieldAlert, 
  Smartphone,
  ExternalLink,
  Sparkles,
  Info,
  Loader2
} from 'lucide-react';
import { MedicalProfile } from '../types/medical';
import { getAndroidNativeSourceFiles, generateNativeAndroidStudioZip, AndroidProjectFiles } from '../utils/androidProjectZip';

interface AndroidCodeExplorerProps {
  profile: MedicalProfile;
}

export const AndroidCodeExplorer: React.FC<AndroidCodeExplorerProps> = ({ profile }) => {
  const files: AndroidProjectFiles = getAndroidNativeSourceFiles(profile);
  const fileKeys = Object.keys(files) as Array<keyof AndroidProjectFiles>;
  
  const [selectedFile, setSelectedFile] = useState<keyof AndroidProjectFiles>(
    'app/src/main/java/com/sosmedico/app/ui/screens/EmergencyFichaScreen.kt'
  );
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'guide' | 'architecture'>('code');

  const handleCopyCode = () => {
    navigator.clipboard.writeText(files[selectedFile]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsDownloading(true);
      const zipBlob = await generateNativeAndroidStudioZip(profile);
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Proyecto_Nativo_Android_Studio_SOSMedico_${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (err) {
      console.error('Error generando zip de Android:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Banner Superior Android SDK */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-2 border-emerald-500/50 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black uppercase tracking-wider">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              SDK OFICIAL DE ANDROID • 100% KOTLIN NATIVO
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Código Fuente Nativo Android Studio
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Esta versión está programada exclusivamente con las APIs oficiales del <strong>Android SDK 35</strong>: 
              <strong> Jetpack Compose</strong>, <strong>Material 3</strong>, <strong>Room SQLite</strong>, <strong>CameraX</strong>, 
              <strong> ToneGenerator Siren</strong> y <strong>CameraManager Torch</strong>. Cero PWA, cero WebViews.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={handleDownloadZip}
              disabled={isDownloading}
              className="px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-950/60 cursor-pointer transition-all active:scale-98 disabled:opacity-50"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>EMPAQUETANDO PROYECTO .ZIP...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <CheckCircle className="w-5 h-5 text-slate-950" />
                  <span>¡PROYECTO DESCARGADO!</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 text-slate-950" />
                  <span>DESCARGAR PROYECTO ANDROID STUDIO (.ZIP)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Feature Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800 text-xs font-bold text-slate-300">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Jetpack Compose & Material 3</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Base de Datos Room (Offline)</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>CameraX Scanner & ZXing</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Llamada Directa Intent.ACTION_CALL</span>
          </div>
        </div>
      </div>

      {/* Selector de Vistas: Código / Guía de Compilación / Arquitectura */}
      <div className="flex items-center gap-2 border-b border-slate-700 pb-2">
        <button
          onClick={() => setActiveTab('code')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'code'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>Explorador de Archivos Kotlin & Gradle</span>
        </button>

        <button
          onClick={() => setActiveTab('guide')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'guide'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Guía de Compilación (Android Studio / APK)</span>
        </button>

        <button
          onClick={() => setActiveTab('architecture')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'architecture'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Arquitectura Android SDK</span>
        </button>
      </div>

      {/* TAB 1: EXPLORADOR DE CÓDIGO */}
      {activeTab === 'code' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* File Tree Sidebar */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-1.5 max-h-[650px] overflow-y-auto">
            <div className="text-xs font-black text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
              <span>Archivos del Proyecto</span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-emerald-400 font-mono">
                {fileKeys.length} archivos
              </span>
            </div>

            <div className="space-y-1 text-xs">
              {fileKeys.map((filePath) => {
                const isSelected = selectedFile === filePath;
                const fileName = filePath.split('/').pop() || filePath;
                const isKotlin = filePath.endsWith('.kt');
                const isGradle = filePath.endsWith('.kts') || filePath.endsWith('.properties');
                const isXml = filePath.endsWith('.xml');

                return (
                  <button
                    key={filePath}
                    onClick={() => setSelectedFile(filePath)}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600/30 text-emerald-300 font-bold border border-emerald-500/40'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    {isKotlin ? (
                      <span className="w-5 h-5 rounded bg-purple-900/60 text-purple-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                        Kt
                      </span>
                    ) : isGradle ? (
                      <span className="w-5 h-5 rounded bg-blue-900/60 text-blue-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                        Gr
                      </span>
                    ) : isXml ? (
                      <span className="w-5 h-5 rounded bg-amber-900/60 text-amber-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                        Xml
                      </span>
                    ) : (
                      <FileCode className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span className="truncate flex-1 font-mono text-[11px]">{fileName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Code Viewer Panel */}
          <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
            {/* Toolbar */}
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs gap-3">
              <div className="flex items-center gap-2 truncate">
                <Folder className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-mono text-emerald-300 font-bold truncate">
                  {selectedFile}
                </span>
              </div>

              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '¡Copiado!' : 'Copiar Archivo'}</span>
              </button>
            </div>

            {/* Code Body */}
            <div className="p-4 overflow-x-auto max-h-[600px] font-mono text-xs text-slate-300 bg-slate-950 leading-relaxed selection:bg-emerald-600 selection:text-white">
              <pre className="whitespace-pre">
                <code>{files[selectedFile]}</code>
              </pre>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: GUÍA DE COMPILACIÓN */}
      {activeTab === 'guide' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">
                Cómo Compilar y Generar el Archivo .APK
              </h2>
              <p className="text-xs text-slate-400">
                Instrucciones para generar el APK nativo en tu computadora o en la nube de GitHub Actions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="bg-slate-850 p-5 rounded-2xl border border-slate-700/80 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-sm">
                1
              </div>
              <h3 className="font-bold text-sm text-white">Opción Android Studio</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Descarga el <strong>.ZIP</strong> y ábrelo en Android Studio. El IDE detectará automáticamente el archivo <code>build.gradle.kts</code> y sincronizará las dependencias de Jetpack Compose y CameraX.
              </p>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-400">
                Menu &gt; Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)
              </div>
            </div>

            <div className="bg-slate-850 p-5 rounded-2xl border border-slate-700/80 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-teal-600 text-white font-black flex items-center justify-center text-sm">
                2
              </div>
              <h3 className="font-bold text-sm text-white">Opción Gradle CLI (Terminal)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Si tienes JDK 17 instalado en tu computadora, puedes compilar el APK directamente en la consola sin abrir ningún entorno gráfico pesado.
              </p>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-[11px] font-mono text-cyan-400">
                ./gradlew assembleDebug
              </div>
              <p className="text-[10px] text-slate-400">
                Genera el archivo en <code>app/build/outputs/apk/debug/app-debug.apk</code>.
              </p>
            </div>

            <div className="bg-slate-850 p-5 rounded-2xl border border-slate-700/80 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-600 text-white font-black flex items-center justify-center text-sm">
                3
              </div>
              <h3 className="font-bold text-sm text-white">Compilación en la Nube</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                El proyecto incluye el archivo <code>.github/workflows/build-apk.yml</code>. Si subes este código a un repositorio privado o público en GitHub, la pestaña <strong>Actions</strong> compilará el .APK gratis.
              </p>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-[11px] font-mono text-amber-300">
                GitHub Actions &gt; Run workflow
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: ARQUITECTURA ANDROID SDK */}
      {activeTab === 'architecture' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">
                Arquitectura y Tecnologías del Android SDK Oficial
              </h2>
              <p className="text-xs text-slate-400">
                Componentes nativos del sistema operativo implementados en este proyecto.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-2">
              <h4 className="font-bold text-sm text-emerald-400 flex items-center gap-2">
                <span>1. Jetpack Compose & Material You (M3)</span>
              </h4>
              <p className="text-slate-300 leading-relaxed">
                Interfaz declarativa moderna basada en componentes Composable. Soporta tema dinámico extraído del fondo de pantalla del teléfono en Android 12, 13, 14 y 15.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-2">
              <h4 className="font-bold text-sm text-cyan-400 flex items-center gap-2">
                <span>2. Room Database (SQLite 100% Offline)</span>
              </h4>
              <p className="text-slate-300 leading-relaxed">
                Base de datos local segura con DAO y Flow reactivo. No requiere conexión a internet para consultar grupos sanguíneos, alergias o números ICE.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-2">
              <h4 className="font-bold text-sm text-purple-400 flex items-center gap-2">
                <span>3. CameraX & ZXing Engine</span>
              </h4>
              <p className="text-slate-300 leading-relaxed">
                Acceso nativo al hardware de la cámara trasera con análisis de imagen en tiempo real a 60 FPS para decodificar códigos QR médicos en cascos y carteras.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-2">
              <h4 className="font-bold text-sm text-red-400 flex items-center gap-2">
                <span>4. Intents de Telecomunicación & Hardware SOS</span>
              </h4>
              <p className="text-slate-300 leading-relaxed">
                Ejecución directa de <code>Intent.ACTION_CALL</code>, sirena sonora con <code>ToneGenerator(STREAM_ALARM)</code> y estroboscopio con <code>CameraManager.setTorchMode()</code>.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
