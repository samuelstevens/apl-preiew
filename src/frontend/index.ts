/// <reference types="AplRenderer" />

import Api from './api';
import Model from './model';
import { Pool, View, VIEWPORTS } from './logic';
import dom from './dom';


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

function makeDiv(viewport: AplRenderer.Viewport): HTMLElement {
    const div = document.createElement("div");
    div.style.border = "1px solid #000";
    div.style.position = "relative";
    div.style.height = `${viewport.height}px`;
    div.style.width = `${viewport.width}px`;
    div.style.display = "inline-block";
    return div
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

function getFiles(event: Event): string[] {
  // @ts-ignore
  const filestr = event.target.value;

  return filestr.split(/\s/);
}

async function renderFiles(pool: Pool, docs: object[]) {
  docs.forEach(async (doc) => {
    const view = pool.next();
    await render(view, JSON.stringify(doc));
  });
}

async function render(view: View, apl: string) {
  const options = getOptions(apl, view);
  
  // @ts-ignore
  await AplRenderer.default.create(options).init()
}

/**
 * Given a list of files, get the updated version from the server and re-render them.
 */
async function update(model: Model) {
  // Get the updated version from the server
  const contents = await Api.update(model.files);

  const objects = contents.filter(i => !Api.isError(i));
  const errors = contents.filter(Api.isError);

  model.pool.clear();

  await renderFiles(model.pool, objects)
}

function main() {
  const viewport = VIEWPORTS.HUB_ROUND_SMALL;
  
  const root = dom.getElementOrThrow('#root');
  const makeViewElement = () => {
    const div = makeDiv(viewport);
    root.append(div);
    return div;
  }
  const model = new Model(new Pool(viewport, makeViewElement))

  const input = dom.getElementOrThrow('#input');
  input.addEventListener('change', async (event: Event) => { 
    model.update({kind: "updatefiles", files: getFiles(event)});
  });

  const clearButton = dom.getElementOrThrow('#clear');
  clearButton.addEventListener('click', () => model.pool.clear());

  const updateButton = dom.getElementOrThrow('#update');
  updateButton.addEventListener('click', () => update(model));
}

window.addEventListener('load', main);
