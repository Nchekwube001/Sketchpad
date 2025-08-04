import { NativeModule, requireNativeModule } from "expo";

import { ExpoModuleTestModuleEvents } from "./ExpoModuleTest.types";

declare class ExpoModuleTestModule extends NativeModule<ExpoModuleTestModuleEvents> {}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoModuleTestModule>("ExpoModuleTest");
