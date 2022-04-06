/// <reference types="AplRenderer" />

function makeDiv(viewport: AplRenderer.Viewport): HTMLElement {
    const div = document.createElement("div");
    div.style.border = "1px solid #000";
    div.style.position = "relative";
    div.style.height = `${viewport.height}px`;
    div.style.width = `${viewport.width}px`;
    div.style.display = "inline-block";
    return div
}

class View {
  element: Element;
  root: Element;
  viewport: AplRenderer.Viewport;

  constructor(root: Element, viewport: AplRenderer.Viewport) {
    this.root = root;
    this.viewport = viewport;
    this.element = makeDiv(this.viewport);
    this.root.appendChild(this.element);
  }

  clear() {
    while (this.element.firstChild) {
      // @ts-ignore
      this.element.removeChild(this.element.lastChild);
    }
  }
}

class Pool {
  viewport: AplRenderer.Viewport;
  root: Element;

  nextFree: number;
  views: View[]

  constructor(root: Element, viewport: AplRenderer.Viewport) {
    this.viewport = viewport;
    this.root = root;

    this.views = [];
    this.nextFree = 0;
  }
  
  next(): View {
    let view: View;
    if (this.nextFree >= this.views.length) {
      // No views have been allocated.
      view = new View(this.root, this.viewport);
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

const isRejected = (input: PromiseSettledResult<unknown>): input is PromiseRejectedResult => 
  input.status === 'rejected'

const isFulfilled = <T>(input: PromiseSettledResult<T>): input is PromiseFulfilledResult<T> => 
  input.status === 'fulfilled'


function createContent(apl: string): AplRenderer.Content {
  const doc = apl;
  const content = AplRenderer.Content.create(apl);
  const jsonDoc = JSON.parse(doc);
  if (
    jsonDoc.mainTemplate &&
    jsonDoc.mainTemplate.parameters &&
    Array.isArray(jsonDoc.mainTemplate.parameters) &&
    jsonDoc.mainTemplate.parameters.length > 0
  ) {
    const parsedData = {};
    jsonDoc.mainTemplate.parameters.forEach((name: object) => {
      if (typeof name === "string") {
        content.addData(name, "{}");
      }
    });
  }
  return content;
}



function getOptions(apl: string, view: View): AplRenderer.Options {
  const environment: AplRenderer.Environment = {
    agentName: "APL Sandbox",
    agentVersion: "1.0",
    allowOpenUrl: true,
    disallowVideo: false,
  };
  const content = createContent(apl);
  const onSendEvent = console.log

  return {
    content,
    environment,
    onSendEvent,
    view: view.element,
    viewport: view.viewport,
    theme: "dark",
    developerToolOptions: {
      mappingKey: "auth-id",
      writeKeys: ["auth-banana", "auth-id"],
    },
    utcTime: Date.now(),
    localTimeAdjustment: -new Date().getTimezoneOffset() * 60 * 1000,
  };
}



function getFiles(event: Event): File[] {
  // @ts-ignore
  const filelist = event.target.files;  
  if (!filelist) {
    return [];
  }
  
  const files = [];
  for (let i = 0; i < filelist.length; i++) {
    files.push(filelist[i]);
  }
  
  return files;
}

function handleFiles(files: FileList) {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filereader = new FileReader();
    filereader.onload = function(e) {
      if (
        e.target 
        && e.target.result 
        && typeof e.target.result == 'string'
      ) {
        console.log(JSON.parse(e.target.result));
      }
    }

    console.log(filereader.readAsText(file));
  }
}

function readFile(file: File): Promise<object> {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = function(event) {
      if (
        event.target 
        && event.target.result 
        && typeof event.target.result == 'string'
      ) {
        resolve(JSON.parse(event.target.result));
      } else {
        reject(reader.error);
      }
    }
    reader.readAsText(file);
  });
}

async function renderFiles(pool: Pool, files: File[]) {
  const objects = (await Promise.allSettled(files.map(readFile))).filter(isFulfilled).map(({value}) => value);

  objects.forEach(async (obj) => {
    const view = pool.next();
    await render(view, JSON.stringify(obj));
  });
}

async function render(view: View, apl: string) {
  const options = getOptions(apl, view);
  
  // @ts-ignore
  await AplRenderer.default.create(options).init()
}

window.addEventListener(('load'), () => {
  const viewport: AplRenderer.Viewport = {
    isRound: false,
    height: 600,
    width: 1024,
    dpi: 160,
  };

  const root = document.querySelector('#root');
  if (!root) {
    console.error("Couldn't find element #root")
    return;
  }
  const pool = new Pool(root, viewport);

  const input = document.querySelector('#input');
  if (!input) {
    console.error("Couldn't find element #input")
    return;
  }

  input.addEventListener(
    'change', 
    (event) => { renderFiles(pool, getFiles(event)); }
  );

  const clearButton = document.querySelector('#clear');
  if (!clearButton) {
    console.error("Couldn't find element #clear")
    return;
  }
  clearButton.addEventListener('click', () => pool.clear());
});
