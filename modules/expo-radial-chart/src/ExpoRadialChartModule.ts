import { NativeModule, requireNativeModule } from 'expo';

import { ExpoRadialChartModuleEvents } from './ExpoRadialChart.types';

declare class ExpoRadialChartModule extends NativeModule<ExpoRadialChartModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoRadialChartModule>('ExpoRadialChart');
