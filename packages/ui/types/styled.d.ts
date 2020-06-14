import 'styled-components';
import { ITheme } from '@botvy/framework/dist/theming/ITheme';

declare module 'styled-components' {
    export interface DefaultTheme extends ITheme {
    }
}
