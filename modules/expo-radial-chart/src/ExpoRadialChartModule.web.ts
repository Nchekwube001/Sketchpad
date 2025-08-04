import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './ExpoRadialChart.types';

type ExpoRadialChartModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class ExpoRadialChartModule extends NativeModule<ExpoRadialChartModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(ExpoRadialChartModule, 'ExpoRadialChartModule');
