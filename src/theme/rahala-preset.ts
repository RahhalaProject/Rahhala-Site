import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

/**
 * Aligns web Aura theme with mobile Material-style tokens:
 * primary / onPrimary / shadow / inverseSurface / inversePrimary / error
 */
export const RahhalaAuraPreset = definePreset(Aura, {
  primitive: {
    red: {
      400: '#d0021b',
      500: '#d0021b',
      600: '#b00218',
      700: '#900115',
    },
  },
  semantic: {
    focusRing: {
      width: '2px',
      style: 'solid',
      color: '{primary.color}',
      offset: '0',
      shadow: '0 0 0 3px color-mix(in srgb, #6cbcea, transparent 55%)',
    },
    primary: {
      50: '#e8eef4',
      100: '#b9c9d9',
      200: '#8ba4be',
      300: '#5d7fa3',
      400: '#2f5a88',
      500: '#003768',
      600: '#002e56',
      700: '#002545',
      800: '#001c34',
      900: '#001323',
      950: '#000a12',
    },
    colorScheme: {
      light: {
        primary: {
          color: '#003768',
          contrastColor: '#ffffff',
          hoverColor: '#002e56',
          activeColor: '#002545',
        },
        highlight: {
          background: 'color-mix(in srgb, #003768, transparent 92%)',
          focusBackground: 'color-mix(in srgb, #003768, transparent 88%)',
          color: '#003768',
          focusColor: '#002e56',
        },
        formField: {
          focusBorderColor: '#003768',
          invalidBorderColor: '#d0021b',
          invalidPlaceholderColor: '#d0021b',
          floatLabelInvalidColor: '#d0021b',
        },
      },
      dark: {
        primary: {
          color: '#5a9fd4',
          contrastColor: '#ffffff',
          hoverColor: '#7eb8e0',
          activeColor: '#003768',
        },
        formField: {
          focusBorderColor: '#5a9fd4',
          invalidBorderColor: '#ff6b7a',
          invalidPlaceholderColor: '#ff6b7a',
          floatLabelInvalidColor: '#ff6b7a',
        },
      },
    },
  },
});
