declare namespace AplRenderer {
  interface Renderer {
    init (): void;
  }

  type Content = {
    addData (name: string, data: string): void;
  }

  type Viewport = {
    height: number
    width: number
    isRound: boolean
    dpi: number
  }

  type Environment = {
    agentName: string
    agentVersion: string
    allowOpenUrl: boolean
    disallowVideo: boolean
  }

  type DeveloperToolOptions = {
    mappingKey: string
    writeKeys: string[]
  }

  type Options = {
    content: Content
    developerToolOptions: DeveloperToolOptions
    environment: Environment
    localTimeAdjustment: number
    onSendEvent: (event: object) => void
    theme: string
    utcTime: number
    view: Element
    viewport: Viewport
  }

  const Content: { 
    create (apl: string): Content;
  };

  function create(options: Options): Renderer;
}
