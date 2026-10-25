package com.sosmedico.app.ui.theme

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
