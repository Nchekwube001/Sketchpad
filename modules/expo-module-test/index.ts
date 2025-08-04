// Reexport the native module. On web, it will be resolved to ExpoModuleTestModule.web.ts
// and on native platforms to ExpoModuleTestModule.ts
// export { default } from './src/ExpoModuleTestModule';
// export { default as ExpoModuleTestView } from './src/ExpoModuleTestView';
// export * from  './src/ExpoModuleTest.types';
import { EventEmitter, EventSubscription } from "expo-modules-core";
import ExpoModuleTestModule from "./src/ExpoModuleTestModule";

const emitter = new EventEmitter(ExpoModuleTestModule);

export type stepChangeEvent = {
  step: number;
};

export function requestPermissions() {
  return ExpoModuleTestModule.requestPermissions();
}
export function startSendingData() {
  return ExpoModuleTestModule.startSendingData();
}
export function addStepListener(
  listener: (event: stepChangeEvent) => void
): EventSubscription {
  //   return emitter.addListener("onStepCounted", listener);
  return emitter.addListener<stepChangeEvent>("onStepCounted", listener);
}
