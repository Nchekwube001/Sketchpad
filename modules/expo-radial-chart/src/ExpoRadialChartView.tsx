import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoRadialChartViewProps } from './ExpoRadialChart.types';

const NativeView: React.ComponentType<ExpoRadialChartViewProps> =
  requireNativeView('ExpoRadialChart');

export default function ExpoRadialChartView(props: ExpoRadialChartViewProps) {
  return <NativeView {...props} />;
}
