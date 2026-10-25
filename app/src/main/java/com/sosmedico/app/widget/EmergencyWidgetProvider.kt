package com.sosmedico.app.widget

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

            val callIntent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:112"))
            val callPendingIntent = PendingIntent.getActivity(
                context, 1, callIntent, PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.btn_widget_call, callPendingIntent)

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}
