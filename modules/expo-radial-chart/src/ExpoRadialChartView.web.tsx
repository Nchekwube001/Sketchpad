import * as React from 'react';

import { ExpoRadialChartViewProps } from './ExpoRadialChart.types';

export default function ExpoRadialChartView(props: ExpoRadialChartViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
