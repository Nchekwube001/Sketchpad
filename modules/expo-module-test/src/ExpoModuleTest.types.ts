export type ExpoModuleTestModuleEvents = {
  requestPermissions: () => Promise<void>;
  startSendingData: () => Promise<void>;
};
