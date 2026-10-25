package com.sosmedico.app.ui.screens

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
                    text = "Paciente de Emergencia",
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
                        label = { Text("Grupo: O+", fontWeight = FontWeight.Bold) },
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
                val dialIntent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:112"))
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
                Text("Emergencias Médicas: 112", fontSize = 12.sp, color = Color.White.copy(alpha = 0.9f))
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
                    putExtra(Intent.EXTRA_SUBJECT, "Ficha Médica SOS")
                    putExtra(Intent.EXTRA_TEXT, "Ficha Médica SOS - Grupo O+ - Emergencias: 112")
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
