import 'styled-components';
import { Theme as MyCustomTheme } from './types'; // Projenizdeki Theme türünü import edin

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends MyCustomTheme {}
}
