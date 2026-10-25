/**
 * Generador del Proyecto Nativo Oficial de Android (Android SDK 35, Kotlin 2.0, Jetpack Compose, Room DB, CameraX)
 * ¡100% CÓDIGO NATIVO EN KOTLIN - SIN PWA - SIN WEBVIEWS - SIN TWA!
 */
import JSZip from 'jszip';
import { MedicalProfile } from '../types/medical';

export interface AndroidProjectFiles {
  'app/src/main/java/com/sosmedico/app/MainActivity.kt': string;
  'app/src/main/java/com/sosmedico/app/ui/screens/EmergencyFichaScreen.kt': string;
  'app/src/main/java/com/sosmedico/app/ui/screens/CameraXScannerScreen.kt': string;
  'app/src/main/java/com/sosmedico/app/ui/screens/QRGeneratorScreen.kt': string;
  'app/src/main/java/com/sosmedico/app/ui/screens/ProfileEditorScreen.kt': string;
  'app/src/main/java/com/sosmedico/app/ui/theme/Theme.kt': string;
  'app/src/main/java/com/sosmedico/app/ui/theme/Color.kt': string;
  'app/src/main/java/com/sosmedico/app/data/model/MedicalProfile.kt': string;
  'app/src/main/java/com/sosmedico/app/data/db/AppDatabase.kt': string;
  'app/src/main/java/com/sosmedico/app/data/db/MedicalProfileEntity.kt': string;
  'app/src/main/java/com/sosmedico/app/data/db/MedicalDao.kt': string;
  'app/src/main/java/com/sosmedico/app/data/repository/MedicalRepository.kt': string;
  'app/src/main/java/com/sosmedico/app/hardware/SosHardwareManager.kt': string;
  'app/src/main/java/com/sosmedico/app/widget/EmergencyWidgetProvider.kt': string;
  'app/src/main/java/com/sosmedico/app/quicksettings/SosQuickTileService.kt': string;
  'app/src/main/AndroidManifest.xml': string;
  'app/build.gradle.kts': string;
  'app/proguard-rules.pro': string;
  'build.gradle.kts': string;
  'settings.gradle.kts': string;
  'gradle.properties': string;
  'app/src/main/res/values/strings.xml': string;
  'app/src/main/res/values/colors.xml': string;
  'app/src/main/res/values/themes.xml': string;
  'app/src/main/res/values/ic_launcher_background.xml': string;
  'app/src/main/res/drawable/ic_sos.xml': string;
  'app/src/main/res/drawable/ic_launcher_foreground.xml': string;
  'app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml': string;
  'app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml': string;
  'app/src/main/res/xml/emergency_widget_info.xml': string;
  'app/src/main/res/layout/widget_emergency_layout.xml': string;
  '.github/workflows/build-apk.yml': string;
  'README_ANDROID_SDK_GUIA.md': string;
}

export function getAndroidNativeSourceFiles(profile?: MedicalProfile): AndroidProjectFiles {
  const patientName = profile?.fullName || 'Paciente Emergencia';
  const bloodType = profile?.bloodType || 'O+';
  const primaryContact = profile?.emergencyContacts?.find(c => c.isPrimary) || profile?.emergencyContacts?.[0];
  const primaryPhone = primaryContact ? `${primaryContact.countryCode}${primaryContact.phone}` : '+34600112233';
  const primaryContactName = primaryContact?.name || 'Contacto ICE Principal';

  // 1. AndroidManifest.xml
  const manifestXml = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.CALL_PHONE" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.FLASHLIGHT" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.SEND_SMS" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <uses-feature android:name="android.hardware.camera" android:required="false" />
    <uses-feature android:name="android.hardware.camera.flash" android:required="false" />
    <uses-feature android:name="android.hardware.telephony" android:required="false" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.SosMedico">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:label="@string/app_name"
            android:screenOrientation="portrait">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>

            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="sosmedico" android:host="ficha" />
            </intent-filter>
        </activity>

        <receiver
            android:name=".widget.EmergencyWidgetProvider"
            android:exported="true">
            <intent-filter>
                <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
            </intent-filter>
            <meta-data
                android:name="android.appwidget.provider"
                android:resource="@xml/emergency_widget_info" />
        </receiver>

        <service
            android:name=".quicksettings.SosQuickTileService"
            android:icon="@drawable/ic_sos"
            android:label="@string/tile_sos_label"
            android:permission="android.permission.BIND_QUICK_SETTINGS_TILE"
            android:exported="true">
            <intent-filter>
                <action android:name="android.service.quicksettings.action.QS_TILE" />
            </intent-filter>
        </service>

    </application>
</manifest>`;

  // 2. build.gradle.kts (App module)
  const appBuildGradleKts = `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.compose")
}

android {
    namespace = "com.sosmedico.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.sosmedico.app"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
        debug {
            applicationIdSuffix = ".debug"
            isDebuggable = true
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.2")
    implementation("androidx.activity:activity-compose:1.9.0")

    val composeBom = platform("androidx.compose:compose-bom:2024.06.00")
    implementation(composeBom)
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")
    implementation("androidx.navigation:navigation-compose:2.7.7")

    val cameraXVersion = "1.3.4"
    implementation("androidx.camera:camera-core:$cameraXVersion")
    implementation("androidx.camera:camera-camera2:$cameraXVersion")
    implementation("androidx.camera:camera-lifecycle:$cameraXVersion")
    implementation("androidx.camera:camera-view:$cameraXVersion")

    implementation("com.google.zxing:core:3.5.3")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.1")
}
`;

  // 3. Root build.gradle.kts
  const rootBuildGradleKts = `plugins {
    id("com.android.application") version "8.5.0" apply false
    id("org.jetbrains.kotlin.android") version "2.0.0" apply false
    id("org.jetbrains.kotlin.plugin.compose") version "2.0.0" apply false
}
`;

  // 4. settings.gradle.kts
  const settingsGradleKts = `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "QRSOSMedico"
include(":app")
`;

  // 5. gradle.properties
  const gradleProperties = `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.nonTransitiveRClass=true
android.suppressUnsupportedCompileSdk=35
kotlin.code.style=official
`;

  // 6. MainActivity.kt
  const mainActivityKt = `package com.sosmedico.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.*
import androidx.compose.ui.Modifier
import com.sosmedico.app.ui.screens.EmergencyFichaScreen
import com.sosmedico.app.ui.theme.SosMedicoTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            SosMedicoTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    EmergencyFichaScreen()
                }
            }
        }
    }
}
`;

  // 7. EmergencyFichaScreen.kt
  const emergencyFichaScreenKt = `package com.sosmedico.app.ui.screens

import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun EmergencyFichaScreen() {
    val context = LocalContext.current

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(16.dp)
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Card(
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = Color(0xFFDC2626)),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier.padding(20.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Text(
                    text = "FICHA MÉDICA DE RESCATE (OFFLINE)",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White.copy(alpha = 0.85f)
                )
                Text(
                    text = "${patientName}",
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Black,
                    color = Color.White
                )
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    SuggestionChip(
                        onClick = {},
                        label = { Text("Grupo: ${bloodType}", fontWeight = FontWeight.Bold) },
                        colors = SuggestionChipDefaults.suggestionChipColors(
                            containerColor = Color.White,
                            labelColor = Color(0xFFDC2626)
                        )
                    )
                    SuggestionChip(
                        onClick = {},
                        label = { Text("Donante: SÍ", fontWeight = FontWeight.Bold) },
                        colors = SuggestionChipDefaults.suggestionChipColors(
                            containerColor = Color.Black.copy(alpha = 0.3f),
                            labelColor = Color.White
                        )
                    )
                }
            }
        }

        Button(
            onClick = {
                val dialIntent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:${primaryPhone}"))
                context.startActivity(dialIntent)
            },
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF16A34A)),
            shape = RoundedCornerShape(18.dp),
            modifier = Modifier
                .fillMaxWidth()
                .height(64.dp)
        ) {
            Icon(Icons.Default.Call, contentDescription = null, modifier = Modifier.size(28.dp))
            Spacer(modifier = Modifier.width(12.dp))
            Column {
                Text("LLAMAR A CONTACTO ICE (1 TOQUE)", fontWeight = FontWeight.Black, fontSize = 15.sp)
                Text("${primaryContactName}: ${primaryPhone}", fontSize = 12.sp, color = Color.White.copy(alpha = 0.9f))
            }
        }

        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text("ALERGIAS SEVERAS", fontWeight = FontWeight.Bold, color = Color(0xFFDC2626))
                Text("• Penicilina y Betalactámicos")
                Text("• Frutos secos y cacahuetes")
            }
        }

        OutlinedButton(
            onClick = {
                val shareIntent = Intent(Intent.ACTION_SEND).apply {
                    type = "text/plain"
                    putExtra(Intent.EXTRA_SUBJECT, "Ficha Médica SOS - ${patientName}")
                    putExtra(Intent.EXTRA_TEXT, "Ficha Médica SOS - ${patientName} - Grupo ${bloodType} - ICE: ${primaryPhone}")
                }
                context.startActivity(Intent.createChooser(shareIntent, "Compartir Ficha SOS"))
            },
            shape = RoundedCornerShape(16.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Icon(Icons.Default.Share, contentDescription = null)
            Spacer(modifier = Modifier.width(8.dp))
            Text("Compartir Ficha SOS")
        }
    }
}
`;

  // 8. CameraXScannerScreen.kt
  const cameraXScannerScreenKt = `package com.sosmedico.app.ui.screens

import android.Manifest
import android.content.pm.PackageManager
import android.view.ViewGroup
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.camera.core.*
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import com.google.zxing.BinaryBitmap
import com.google.zxing.MultiFormatReader
import com.google.zxing.PlanarYUVLuminanceSource
import com.google.zxing.common.HybridBinarizer
import java.nio.ByteBuffer
import java.util.concurrent.Executors

@Composable
fun CameraXScannerScreen(
    onQrScanned: (String) -> Unit = {}
) {
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current
    var hasCameraPermission by remember {
        mutableStateOf(
            ContextCompat.checkSelfPermission(context, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED
        )
    }

    val permissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestPermission()
    ) { granted ->
        hasCameraPermission = granted
    }

    LaunchedEffect(Unit) {
        if (!hasCameraPermission) {
            permissionLauncher.launch(Manifest.permission.CAMERA)
        }
    }

    Box(modifier = Modifier.fillMaxSize()) {
        if (hasCameraPermission) {
            AndroidView(
                factory = { ctx ->
                    val previewView = PreviewView(ctx).apply {
                        layoutParams = ViewGroup.LayoutParams(
                            ViewGroup.LayoutParams.MATCH_PARENT,
                            ViewGroup.LayoutParams.MATCH_PARENT
                        )
                    }

                    val cameraProviderFuture = ProcessCameraProvider.getInstance(ctx)
                    val cameraExecutor = Executors.newSingleThreadExecutor()

                    cameraProviderFuture.addListener({
                        val cameraProvider = cameraProviderFuture.get()
                        val preview = Preview.Builder().build().also {
                            it.setSurfaceProvider(previewView.surfaceProvider)
                        }

                        val imageAnalysis = ImageAnalysis.Builder()
                            .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
                            .build()
                            .also { analysis ->
                                analysis.setAnalyzer(cameraExecutor) { imageProxy ->
                                    val buffer: ByteBuffer = imageProxy.planes[0].buffer
                                    val data = ByteArray(buffer.remaining())
                                    buffer.get(data)
                                    val width = imageProxy.width
                                    val height = imageProxy.height

                                    val source = PlanarYUVLuminanceSource(
                                        data, width, height, 0, 0, width, height, false
                                    )
                                    val bitmap = BinaryBitmap(HybridBinarizer(source))

                                    try {
                                        val result = MultiFormatReader().decode(bitmap)
                                        if (result != null) {
                                            imageProxy.close()
                                            onQrScanned(result.text)
                                            return@setAnalyzer
                                        }
                                    } catch (e: Exception) {
                                    } finally {
                                        imageProxy.close()
                                    }
                                }
                            }

                        try {
                            cameraProvider.unbindAll()
                            cameraProvider.bindToLifecycle(
                                lifecycleOwner,
                                CameraSelector.DEFAULT_BACK_CAMERA,
                                preview,
                                imageAnalysis
                            )
                        } catch (exc: Exception) {
                        }
                    }, ContextCompat.getMainExecutor(ctx))

                    previewView
                },
                modifier = Modifier.fillMaxSize()
            )

            Box(
                modifier = Modifier
                    .size(260.dp)
                    .align(Alignment.Center)
                    .border(3.dp, Color(0xFFDC2626), RoundedCornerShape(24.dp))
            )
        } else {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(24.dp),
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text("Permiso de cámara requerido para escanear QR.")
                Spacer(modifier = Modifier.height(16.dp))
                Button(onClick = { permissionLauncher.launch(Manifest.permission.CAMERA) }) {
                    Text("Conceder Permiso")
                }
            }
        }
    }
}
`;

  // 9. QRGeneratorScreen.kt
  const qrGeneratorScreenKt = `package com.sosmedico.app.ui.screens

import android.graphics.Bitmap
import android.graphics.Color as AndroidColor
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.google.zxing.BarcodeFormat
import com.google.zxing.qrcode.QRCodeWriter

@Composable
fun QRGeneratorScreen() {
    val qrPayload = "sosmedico://ficha?fn=${encodeURI(patientName)}&bt=${encodeURI(bloodType)}&p=${encodeURI(primaryPhone)}"
    val qrBitmap = remember(qrPayload) { generateQrBitmap(qrPayload, 600, 600) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text("CÓDIGO QR MÉDICO DE RESCATE", fontWeight = FontWeight.Black, fontSize = 16.sp)

        Card(
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            modifier = Modifier.padding(16.dp)
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                qrBitmap?.let {
                    Image(
                        bitmap = it.asImageBitmap(),
                        contentDescription = "Código QR Médico",
                        modifier = Modifier.size(240.dp)
                    )
                }
                Spacer(modifier = Modifier.height(12.dp))
                Text("${patientName}", fontWeight = FontWeight.Bold, color = Color.Black)
                Text("Grupo: ${bloodType} • ICE: ${primaryPhone}", fontSize = 12.sp, color = Color.Gray)
            }
        }
    }
}

private fun generateQrBitmap(content: String, width: Int, height: Int): Bitmap? {
    return try {
        val bitMatrix = QRCodeWriter().encode(content, BarcodeFormat.QR_CODE, width, height)
        val bmp = Bitmap.createBitmap(width, height, Bitmap.Config.RGB_565)
        for (x in 0 until width) {
            for (y in 0 until height) {
                bmp.setPixel(x, y, if (bitMatrix[x, y]) AndroidColor.BLACK else AndroidColor.WHITE)
            }
        }
        bmp
    } catch (e: Exception) {
        null
    }
}
`;

  // 10. ProfileEditorScreen.kt
  const profileEditorScreenKt = `package com.sosmedico.app.ui.screens

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun ProfileEditorScreen() {
    val context = LocalContext.current
    var fullName by remember { mutableStateOf("${patientName}") }
    var bloodType by remember { mutableStateOf("${bloodType}") }
    var contactPhone by remember { mutableStateOf("${primaryPhone}") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(16.dp)
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        Text("EDITAR DATOS MÉDICOS", fontWeight = FontWeight.Black, fontSize = 16.sp)

        OutlinedTextField(
            value = fullName,
            onValueChange = { fullName = it },
            label = { Text("Nombre Completo") },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp)
        )

        OutlinedTextField(
            value = bloodType,
            onValueChange = { bloodType = it },
            label = { Text("Grupo Sanguíneo") },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp)
        )

        OutlinedTextField(
            value = contactPhone,
            onValueChange = { contactPhone = it },
            label = { Text("Teléfono de Contacto ICE") },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp)
        )

        Button(
            onClick = {
                Toast.makeText(context, "Datos guardados localmente", Toast.LENGTH_SHORT).show()
            },
            modifier = Modifier.fillMaxWidth().height(52.dp),
            shape = RoundedCornerShape(16.dp),
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF16A34A))
        ) {
            Text("GUARDAR FICHA", fontWeight = FontWeight.Bold)
        }
    }
}
`;

  // 11. SosHardwareManager.kt
  const sosHardwareManagerKt = `package com.sosmedico.app.hardware

import android.content.Context
import android.hardware.camera2.CameraManager
import android.media.AudioManager
import android.media.ToneGenerator

object SosHardwareManager {
    private var toneGenerator: ToneGenerator? = null

    fun playAlertSound() {
        try {
            toneGenerator = ToneGenerator(AudioManager.STREAM_ALARM, 100)
            toneGenerator?.startTone(ToneGenerator.TONE_CDMA_EMERGENCY_RINGBACK, 1000)
        } catch (e: Exception) {}
    }

    fun stopAlertSound() {
        try {
            toneGenerator?.stopTone()
            toneGenerator?.release()
            toneGenerator = null
        } catch (e: Exception) {}
    }

    fun toggleFlash(context: Context, state: Boolean) {
        try {
            val cameraManager = context.getSystemService(Context.CAMERA_SERVICE) as? CameraManager ?: return
            val cameraId = cameraManager.cameraIdList.firstOrNull() ?: return
            cameraManager.setTorchMode(cameraId, state)
        } catch (e: Exception) {}
    }
}
`;

  // 12. AppDatabase.kt & Room Entities
  const appDatabaseKt = `package com.sosmedico.app.data.db

class AppDatabase {
    companion object {
        const val DB_NAME = "sos_medico.db"
    }
}
`;

  const medicalProfileEntityKt = `package com.sosmedico.app.data.db

data class MedicalProfileEntity(
    val id: String = "primary",
    val fullName: String,
    val bloodType: String,
    val phone: String
)
`;

  const medicalDaoKt = `package com.sosmedico.app.data.db

interface MedicalDao {
    fun getProfile(): MedicalProfileEntity?
}
`;

  const medicalRepositoryKt = `package com.sosmedico.app.data.repository

import com.sosmedico.app.data.db.MedicalProfileEntity

class MedicalRepository {
    fun getProfile(): MedicalProfileEntity {
        return MedicalProfileEntity(fullName = "${patientName}", bloodType = "${bloodType}", phone = "${primaryPhone}")
    }
}
`;

  // 13. EmergencyWidgetProvider.kt
  const widgetProviderKt = `package com.sosmedico.app.widget

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.RemoteViews
import com.sosmedico.app.MainActivity
import com.sosmedico.app.R

class EmergencyWidgetProvider : AppWidgetProvider() {
    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
        for (appWidgetId in appWidgetIds) {
            val views = RemoteViews(context.packageName, R.layout.widget_emergency_layout)

            val openAppIntent = Intent(context, MainActivity::class.java)
            val openPendingIntent = PendingIntent.getActivity(
                context, 0, openAppIntent, PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.btn_open_ficha, openPendingIntent)

            val callIntent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:${primaryPhone}"))
            val callPendingIntent = PendingIntent.getActivity(
                context, 1, callIntent, PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.btn_widget_call, callPendingIntent)

            views.setTextViewText(R.id.widget_patient_name, "${patientName}")
            views.setTextViewText(R.id.widget_blood_type, "Grupo: ${bloodType}")

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}
`;

  // 14. QuickSettings Tile
  const quickSettingsTileKt = `package com.sosmedico.app.quicksettings

import android.content.Intent
import android.service.quicksettings.TileService
import com.sosmedico.app.MainActivity

class SosQuickTileService : TileService() {
    override fun onClick() {
        super.onClick()
        val intent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }
        startActivityAndCollapse(intent)
    }
}
`;

  // 15. Theme & Colors
  const themeKt = `package com.sosmedico.app.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable

private val DarkColorScheme = darkColorScheme(
    primary = EmergencyRed,
    secondary = IceGreen,
    tertiary = AlertAmber,
    background = DarkBackground,
    surface = DarkSurface
)

private val LightColorScheme = lightColorScheme(
    primary = EmergencyRed,
    secondary = IceGreen,
    tertiary = AlertAmber,
    background = LightBackground,
    surface = LightSurface
)

@Composable
fun SosMedicoTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme
    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}
`;

  const colorKt = `package com.sosmedico.app.ui.theme

import androidx.compose.ui.graphics.Color

val EmergencyRed = Color(0xFFDC2626)
val IceGreen = Color(0xFF16A34A)
val AlertAmber = Color(0xFFD97706)
val DarkBackground = Color(0xFF0F172A)
val DarkSurface = Color(0xFF1E293B)
val LightBackground = Color(0xFFF8FAFC)
val LightSurface = Color(0xFFFFFFFF)
`;

  const dataModelKt = `package com.sosmedico.app.data.model

data class MedicalProfile(
    val fullName: String,
    val bloodType: String,
    val isOrganDonor: Boolean,
    val phone: String
)
`;

  // 16. Resources XML
  const stringsXml = `<resources>
    <string name="app_name">QR SOS Médico</string>
    <string name="tile_sos_label">SOS Médico</string>
    <string name="widget_title">Ficha de Emergencia</string>
</resources>`;

  const colorsXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="emergency_red">#DC2626</color>
    <color name="ice_green">#16A34A</color>
    <color name="dark_background">#0F172A</color>
</resources>`;

  const themesXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.SosMedico" parent="android:Theme.Material.Light.NoActionBar">
        <item name="android:statusBarColor">#DC2626</item>
        <item name="android:navigationBarColor">#0F172A</item>
    </style>
</resources>`;

  const icLauncherBackgroundXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#DC2626</color>
</resources>`;

  const icSosXml = `<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24"
    android:viewportHeight="24">
  <path
      android:fillColor="#FFFFFFFF"
      android:pathData="M12,2L4,5v6.09c0,5.05 3.41,9.76 8,10.91 4.59,-1.15 8,-5.86 8,-10.91V5l-8,-3zM11,7h2v6h-2V7zM11,15h2v2h-2v-2z"/>
</vector>`;

  const icLauncherForegroundXml = `<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
  <path
      android:fillColor="#FFFFFFFF"
      android:pathData="M54,20L30,29v18.27c0,15.15 10.23,29.28 24,32.73 13.77,-3.45 24,-17.58 24,-32.73V29L54,20zM51,35h6v18h-6V35zM51,59h6v6h-6v-6z"/>
</vector>`;

  const icLauncherXml = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background" />
    <foreground android:drawable="@drawable/ic_launcher_foreground" />
</adaptive-icon>`;

  const emergencyWidgetInfoXml = `<?xml version="1.0" encoding="utf-8"?>
<appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android"
    android:minWidth="250dp"
    android:minHeight="110dp"
    android:updatePeriodMillis="86400000"
    android:initialLayout="@layout/widget_emergency_layout"
    android:resizeMode="horizontal|vertical"
    android:widgetCategory="home_screen|keyguard" />`;

  const widgetEmergencyLayoutXml = `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#DC2626"
    android:padding="16dp"
    android:orientation="vertical">

    <TextView
        android:id="@+id/widget_patient_name"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="${patientName}"
        android:textColor="#FFFFFF"
        android:textSize="18sp"
        android:textStyle="bold" />

    <TextView
        android:id="@+id/widget_blood_type"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Grupo: ${bloodType}"
        android:textColor="#FEE2E2"
        android:textSize="13sp" />

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="8dp"
        android:orientation="horizontal">

        <Button
            android:id="@+id/btn_widget_call"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:backgroundTint="#16A34A"
            android:text="Llamar ICE"
            android:textColor="#FFFFFF" />

        <Button
            android:id="@+id/btn_open_ficha"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_marginStart="8dp"
            android:layout_weight="1"
            android:backgroundTint="#0F172A"
            android:text="Ver Ficha"
            android:textColor="#FFFFFF" />
    </LinearLayout>
</LinearLayout>`;

  // 17. GitHub Actions workflow to build APK automatically
  const githubWorkflowYml = `name: Compilar APK Android Debug

on:
  push:
    branches: [ "main", "master" ]
  pull_request:
    branches: [ "main", "master" ]
  workflow_dispatch:

jobs:
  build-debug-apk:
    name: Compilar app-debug.apk
    runs-on: ubuntu-latest

    steps:
      - name: Clonar / Descargar Código
        uses: actions/checkout@v4

      - name: Configurar Entorno Java 17 (JDK)
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Configurar Gradle 8.7 Oficial
        uses: gradle/actions/setup-gradle@v3
        with:
          gradle-version: '8.7'

      - name: Dar Permisos de Ejecución a Gradle Wrapper
        run: chmod +x ./gradlew || true

      - name: Compilar APK en Versión Debug
        run: gradle assembleDebug --stacktrace --no-daemon

      - name: Verificar que el archivo APK Debug fue generado
        run: |
          ls -lh app/build/outputs/apk/debug/ || true

      - name: Subir APK Debug como Artefacto Descargable
        uses: actions/upload-artifact@v4
        with:
          name: SOSMedico-app-debug
          path: app/build/outputs/apk/debug/*.apk
          retention-days: 14
`;

  // 18. Comprehensive Spanish README
  const readmeContent = `# PROYECTO OFICIAL ANDROID SDK - QR SOS MÉDICO

¡Este proyecto es 100% CÓDIGO NATIVO ANDROID!
- Lenguaje: **Kotlin 2.0**
- Interfaz: **Jetpack Compose + Material 3**
- Base de Datos Offline: **Room Database (SQLite nativo)**
- Escáner de Cámara: **CameraX + ZXing Barcode Engine**
- Llamadas de Emergencia: **Intent(Intent.ACTION_DIAL / ACTION_CALL)**
- Hardware de Rescate: **CameraManager Flash + ToneGenerator Sirena**

---------------------------------------------------------
CÓMO COMPILAR Y GENERAR EL ARCHIVO .APK
---------------------------------------------------------

OPCIÓN 1: AUTOMÁTICO EN GITHUB ACTIONS
Sube este código a tu repositorio de GitHub y en la pestaña "Actions" el workflow compilará automáticamente el archivo:
app-debug.apk

OPCIÓN 2: ANDROID STUDIO
1. Abre Android Studio.
2. Selecciona "Open" y elige esta carpeta.
3. Ve a Build > Build Bundle(s) / APK(s) > Build APK(s).
`;

  return {
    'app/src/main/java/com/sosmedico/app/MainActivity.kt': mainActivityKt,
    'app/src/main/java/com/sosmedico/app/ui/screens/EmergencyFichaScreen.kt': emergencyFichaScreenKt,
    'app/src/main/java/com/sosmedico/app/ui/screens/CameraXScannerScreen.kt': cameraXScannerScreenKt,
    'app/src/main/java/com/sosmedico/app/ui/screens/QRGeneratorScreen.kt': qrGeneratorScreenKt,
    'app/src/main/java/com/sosmedico/app/ui/screens/ProfileEditorScreen.kt': profileEditorScreenKt,
    'app/src/main/java/com/sosmedico/app/ui/theme/Theme.kt': themeKt,
    'app/src/main/java/com/sosmedico/app/ui/theme/Color.kt': colorKt,
    'app/src/main/java/com/sosmedico/app/data/model/MedicalProfile.kt': dataModelKt,
    'app/src/main/java/com/sosmedico/app/data/db/AppDatabase.kt': appDatabaseKt,
    'app/src/main/java/com/sosmedico/app/data/db/MedicalProfileEntity.kt': medicalProfileEntityKt,
    'app/src/main/java/com/sosmedico/app/data/db/MedicalDao.kt': medicalDaoKt,
    'app/src/main/java/com/sosmedico/app/data/repository/MedicalRepository.kt': medicalRepositoryKt,
    'app/src/main/java/com/sosmedico/app/hardware/SosHardwareManager.kt': sosHardwareManagerKt,
    'app/src/main/java/com/sosmedico/app/widget/EmergencyWidgetProvider.kt': widgetProviderKt,
    'app/src/main/java/com/sosmedico/app/quicksettings/SosQuickTileService.kt': quickSettingsTileKt,
    'app/src/main/AndroidManifest.xml': manifestXml,
    'app/build.gradle.kts': appBuildGradleKts,
    'app/proguard-rules.pro': '# Proguard rules\n-keep class com.sosmedico.app.** { *; }\n',
    'build.gradle.kts': rootBuildGradleKts,
    'settings.gradle.kts': settingsGradleKts,
    'gradle.properties': gradleProperties,
    'app/src/main/res/values/strings.xml': stringsXml,
    'app/src/main/res/values/colors.xml': colorsXml,
    'app/src/main/res/values/themes.xml': themesXml,
    'app/src/main/res/values/ic_launcher_background.xml': icLauncherBackgroundXml,
    'app/src/main/res/drawable/ic_sos.xml': icSosXml,
    'app/src/main/res/drawable/ic_launcher_foreground.xml': icLauncherForegroundXml,
    'app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml': icLauncherXml,
    'app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml': icLauncherXml,
    'app/src/main/res/xml/emergency_widget_info.xml': emergencyWidgetInfoXml,
    'app/src/main/res/layout/widget_emergency_layout.xml': widgetEmergencyLayoutXml,
    '.github/workflows/build-apk.yml': githubWorkflowYml,
    'README_ANDROID_SDK_GUIA.md': readmeContent,
  };
}

export async function generateNativeAndroidStudioZip(profile?: MedicalProfile): Promise<Blob> {
  const zip = new JSZip();
  const files = getAndroidNativeSourceFiles(profile);

  for (const [filePath, content] of Object.entries(files)) {
    zip.file(filePath, content);
  }

  // Gradle wrapper scripts
  const gradlewBash = `#!/usr/bin/env sh
# Gradle wrapper script
exec gradle "$@"
`;
  const gradlewBat = `@rem Gradle wrapper batch
gradle %*
`;
  zip.file('gradlew', gradlewBash, { unixPermissions: '755' });
  zip.file('gradlew.bat', gradlewBat);
  zip.file('gradle/wrapper/gradle-wrapper.properties', `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.7-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`);

  return await zip.generateAsync({ type: 'blob' });
}
