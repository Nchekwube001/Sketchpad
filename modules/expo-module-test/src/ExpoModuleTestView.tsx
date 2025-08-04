import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoModuleTestViewProps } from './ExpoModuleTest.types';

const NativeView: React.ComponentType<ExpoModuleTestViewProps> =
  requireNativeView('ExpoModuleTest');

export default function ExpoModuleTestView(props: ExpoModuleTestViewProps) {
  return <NativeView {...props} />;
}
