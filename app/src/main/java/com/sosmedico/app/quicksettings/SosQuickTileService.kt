package com.sosmedico.app.quicksettings

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
