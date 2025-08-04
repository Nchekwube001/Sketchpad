package expo.modules.moduletest

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import androidx.core.content.ContextCompat
import java.net.URL


class ExpoModuleTestModule : Module() {

  override fun definition() = ModuleDefinition {
    Name("ExpoModuleTest")

    Function("requestPermissions") {
    val activity = appContext.activityProvider?.currentActivity
      val applicationContext = activity?.applicationContext

      if(applicationContext != null){
        val permissionCheck = ContextCompat.checkSelfPermission(
          applicationContext,
          Manifest.permission.ACTIVITY_RECOGNITION
        )
      }
    }

  }
}
