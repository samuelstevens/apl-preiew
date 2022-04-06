/// <reference types="aplrenderer" />

const VIEWPORTS: Record<string, AplRenderer.Viewport> = {
  HUB_ROUND_SMALL: {
    isRound: true,
    height: 480,
    width: 480,
    dpi: 160,
  },

  HUB_LANDSCAPE_SMALL: {
    isRound: false,
    height: 480,
    width: 960,
    dpi: 160,
  },

  HUB_LANDSCAPE_MEDIUM: {
    isRound: false,
    height: 600,
    width: 1024,
    dpi: 160,
  },

  HUB_LANDSCAPE_LARGE: {
    isRound: false,
    height: 800,
    width: 1280,
    dpi: 160,
  },

  HUB_LANDSCAPE_XLARGE: {
    isRound: false,
    height: 1080,
    width: 1920,
    dpi: 160,
  },

  HUB_LANDSCAPE_PORTRAIT: {
    isRound: false,
    height: 1920,
    width: 1080,
    dpi: 160,
  },
}

export { VIEWPORTS };
