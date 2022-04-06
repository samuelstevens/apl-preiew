/// <reference types="aplrenderer" />

class View {
  element: Element;
  viewport: AplRenderer.Viewport;

  constructor(element: Element, viewport: AplRenderer.Viewport) {
    this.viewport = viewport;
    this.element = element;
  }

  clear() {
    while (this.element.firstChild) {
      // @ts-ignore
      this.element.removeChild(this.element.lastChild);
    }
  }
}

type MakeViewElement = () => Element;

class Pool {
  viewport: AplRenderer.Viewport;
  makeViewElement: MakeViewElement;

  nextFree: number;
  views: View[]

  constructor(viewport: AplRenderer.Viewport, makeViewElement: MakeViewElement) {
    this.viewport = viewport;
    this.makeViewElement = makeViewElement;

    this.views = [];
    this.nextFree = 0;
  }
  
  next(): View {
    let view: View;
    if (this.nextFree >= this.views.length) {
      // No views have been allocated.
      view = new View(this.makeViewElement(), this.viewport);
      this.views.push(view);
    } else {
      view = this.views[this.nextFree];
    }
    this.nextFree++;
    return view;
  }

  clear() {
    this.views.forEach(view => view.clear());
    this.nextFree = 0;
  }
}

const VIEWPORTS = {
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
}

export { Pool, View, VIEWPORTS };
