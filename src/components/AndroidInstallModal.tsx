import React, { useState } from 'react';
import { 
  Smartphone, 
  X, 
  Download, 
  CheckCircle, 
  Zap, 
  Layers, 
  Copy, 
  Check, 
  Package, 
  FileCode, 
  Terminal,
  Cpu,
  Github,
  CheckCircle2,
  ExternalLink,
  Loader2,
  FileArchive,
  Play
} from 'lucide-react';
import { MedicalProfile } from '../types/medical';
import { generateNativeAndroidStudioZip, getAndroidNativeSourceFiles } from '../utils/androidProjectZip';

interface AndroidInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: MedicalProfile;
}

export const AndroidInstallModal: React.FC<AndroidInstallModalProps> = ({
  isOpen,
  onClose,
  profile,
}) => {
  const [activeTab, setActiveTab] = useState<'download' | 'github' | 'terminal'>('github');
  const [isGeneratingZip, setIsGeneratingZip] = useState(false);
  const [zipSuccess, setZipSuccess] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!isOpen) return null;

  const files = getAndroidNativeSourceFiles(profile);
  const workflowYml = files['.github/workflows/build-apk.yml'];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2500);
  };

  const handleDownloadWorkflowYml = () => {
    const blob = new Blob([workflowYml], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'build-apk.yml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadZip = async () => {
    try {
      setIsGeneratingZip(true);
      const zipBlob = await generateNativeAndroidStudioZip(profile);

      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Proyecto_Nativo_Android_Studio_SOSMedico_${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setZipSuccess(true);
      setTimeout(() => setZipSuccess(false), 3500);
    } catch (err) {
      console.error('Error generando paquete nativo Android:', err);
    } finally {
      setIsGeneratingZip(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-5 sm:p-6 text-white shadow-2xl space-y-4 animate-scale-up max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-600 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-900/40 shrink-0">
              <Github className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-black text-white">
                  Compilación de APK Debug (Android SDK)
                </h2>
                <span className="text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Workflow GitHub Actions
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Compila automáticamente el archivo <code className="text-purple-300 font-mono">app-debug.apk</code> en la nube o en Android Studio.
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

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 p-1 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs font-bold gap-1">
          <button
            onClick={() => setActiveTab('github')}
            className={`py-2 px-2 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer text-center ${
              activeTab === 'github'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Github className="w-4 h-4 text-purple-300 shrink-0" />
            <span className="text-[11px] font-bold">1. Workflow APK Debug</span>
          </button>

          <button
            onClick={() => setActiveTab('download')}
            className={`py-2 px-2 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer text-center ${
              activeTab === 'download'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileArchive className="w-4 h-4 text-emerald-300 shrink-0" />
            <span className="text-[11px] font-bold">2. Descargar .ZIP</span>
          </button>

          <button
            onClick={() => setActiveTab('terminal')}
            className={`py-2 px-2 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer text-center ${
              activeTab === 'terminal'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-4 h-4 text-cyan-300 shrink-0" />
            <span className="text-[11px] font-bold">3. Android Studio / CLI</span>
          </button>
        </div>

        {/* TAB 1: WORKFLOW APK DEBUG GITHUB ACTIONS */}
        {activeTab === 'github' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-purple-950/60 border border-purple-500/40 text-purple-200 text-xs flex items-start gap-2.5">
              <Zap className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-bold">
                  Workflow Listo: .github/workflows/build-apk.yml
                </strong>
                <p className="text-[11px] text-purple-300/90 mt-0.5 leading-relaxed">
                  Este flujo de trabajo compila tu aplicación Android con <strong>Java 17</strong> y <strong>Gradle 8.7</strong> (<code className="text-amber-300 font-mono">./gradlew assembleDebug</code>) y genera el archivo descargable <code className="text-emerald-300 font-mono">app-debug.apk</code> en la pestaña <strong>Actions</strong> de GitHub.
                </p>
              </div>
            </div>

            {/* Quick Actions for Workflow */}
            <div className="flex items-center justify-between gap-2 bg-slate-850 p-2.5 rounded-xl border border-slate-700 text-xs">
              <span className="font-mono text-purple-300 font-bold text-[11px] truncate">
                .github/workflows/build-apk.yml
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleCopy(workflowYml, 'workflow')}
                  className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copiedCmd === 'workflow' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCmd === 'workflow' ? 'Copiado!' : 'Copiar YAML'}</span>
                </button>
                <button
                  onClick={handleDownloadWorkflowYml}
                  className="px-2.5 py-1 bg-slate-750 hover:bg-slate-700 text-slate-200 rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors border border-slate-650"
                >
                  <Download className="w-3.5 h-3.5 text-purple-300" />
                  <span>Descargar .yml</span>
                </button>
              </div>
            </div>

            {/* Workflow Code Snippet */}
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-[11px] font-mono text-slate-300 max-h-48 overflow-y-auto leading-relaxed">
              <pre className="whitespace-pre"><code>{workflowYml}</code></pre>
            </div>

            {/* Instructions */}
            <ol className="text-xs text-slate-300 space-y-2 pl-2 list-decimal list-inside bg-slate-850/80 p-3.5 rounded-2xl border border-slate-700/80">
              <li>
                Sube este proyecto a tu repositorio de GitHub (el archivo <code className="text-purple-300">.github/workflows/build-apk.yml</code> ya está en el proyecto).
              </li>
              <li>
                En GitHub, abre la pestaña <strong>Actions</strong> en la parte superior.
              </li>
              <li>
                El workflow <strong>"Compilar APK Android Debug"</strong> compilará automáticamente el proyecto.
              </li>
              <li>
                Al finalizar, haz clic en el artefacto <strong>SOSMedico-app-debug</strong> para descargar el archivo <code className="text-emerald-300 font-bold">.apk</code> a tu teléfono.
              </li>
            </ol>
          </div>
        )}

        {/* TAB 2: DESCARGAR PROYECTO .ZIP */}
        {activeTab === 'download' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-bold">
                  Proyecto Nativo Android Studio Completo
                </strong>
                <p className="text-[11px] text-emerald-300/90 mt-0.5 leading-relaxed">
                  Contiene todos los módulos Gradle, scripts wrapper, ficheros Kotlin 2.0, base de datos SQLite Room, CameraX scanner y permisos del sistema.
                </p>
              </div>
            </div>

            {/* List of included native modules */}
            <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-slate-300 block text-[11px] uppercase tracking-wider">
                Módulos nativos incluidos en el archivo .ZIP:
              </span>
              <ul className="text-[11px] text-slate-300 space-y-1.5 pl-2 list-disc list-inside">
                <li><code className="text-purple-300 font-mono">.github/workflows/build-apk.yml</code> (CI/CD para compilar APK Debug)</li>
                <li><code className="text-indigo-300 font-mono">MainActivity.kt</code> (Jetpack Compose Scaffold & NavHost)</li>
                <li><code className="text-indigo-300 font-mono">EmergencyFichaScreen.kt</code> (Llamada directa con <code className="text-amber-300">Intent.ACTION_CALL</code>)</li>
                <li><code className="text-indigo-300 font-mono">CameraXScannerScreen.kt</code> (Cámara nativa con ZXing Barcode)</li>
                <li><code className="text-indigo-300 font-mono">SosHardwareManager.kt</code> (Sirena ToneGenerator y Flash estroboscópico)</li>
                <li><code className="text-indigo-300 font-mono">AppDatabase.kt</code> (Base de datos Room SQLite 100% offline)</li>
                <li><code className="text-cyan-300 font-mono">AndroidManifest.xml</code> y <code className="text-cyan-300 font-mono">build.gradle.kts</code> (SDK 35)</li>
                <li><code className="text-emerald-300 font-mono">gradlew</code> y <code className="text-emerald-300 font-mono">gradlew.bat</code> (Gradle 8.7 Wrapper)</li>
              </ul>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownloadZip}
              disabled={isGeneratingZip}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-950/60 cursor-pointer active:scale-98 transition-transform disabled:opacity-50"
            >
              {isGeneratingZip ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>EMPAQUETANDO ARCHIVOS KOTLIN NATIVOS...</span>
                </>
              ) : zipSuccess ? (
                <>
                  <Check className="w-5 h-5 text-emerald-300" />
                  <span>¡PAQUETE .ZIP NATIVO DESCARGADO CON ÉXITO!</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>DESCARGAR PROYECTO ANDROID STUDIO (.ZIP)</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* TAB 3: ANDROID STUDIO / TERMINAL GRADLE */}
        {activeTab === 'terminal' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-200 text-xs flex items-start gap-2.5">
              <Terminal className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-bold">
                  Compilar localmente con Gradle o Android Studio
                </strong>
                <p className="text-[11px] text-cyan-300/90 mt-0.5 leading-relaxed">
                  Para desarrolladores con Android Studio o Java 17 instalado en Windows, Linux o macOS.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400">Comando para Linux / macOS:</span>
                <div className="flex items-center justify-between text-xs font-mono text-emerald-400">
                  <span>./gradlew assembleDebug</span>
                  <button
                    onClick={() => handleCopy('./gradlew assembleDebug', 'linux')}
                    className="p-1 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {copiedCmd === 'linux' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400">Comando para Windows (CMD/PowerShell):</span>
                <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                  <span>gradlew.bat assembleDebug</span>
                  <button
                    onClick={() => handleCopy('gradlew.bat assembleDebug', 'win')}
                    className="p-1 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {copiedCmd === 'win' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                El archivo .APK quedará generado en: <code className="text-slate-300 font-mono">app/build/outputs/apk/debug/app-debug.apk</code>
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-purple-400 font-bold">
            <Github className="w-3.5 h-3.5" />
            <span>Workflow: .github/workflows/build-apk.yml</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold cursor-pointer transition-colors"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
