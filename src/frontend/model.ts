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

interface UpdateFiles {
  kind: "updatefiles";
  files: string[];
}

interface ClearViews {
  kind: "clearviews";
}

type Msg = UpdateFiles | ClearViews;

class Model {
  files: string[]
  views: View[]

  constructor(views: View[]) {
    this.files = [];
    this.views = views;
  }

  update(msg: Msg) {
    switch(msg.kind) {
      case "updatefiles":
        this.files = msg.files;
      case "clearviews":
        this.views.forEach(view => view.clear());
    }

    console.log(this);
  }
}

export { Model, View };
