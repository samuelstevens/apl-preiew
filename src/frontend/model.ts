import { Pool, View } from './logic'

interface UpdateFiles {
  kind: "updatefiles";
  files: string[];
}

type Msg = UpdateFiles

export default class Model {
  files: string[]
  json: object[]
  pool: Pool;

  constructor(pool: Pool) {
    this.files = [];
    this.json = []

    this.pool = pool;
  }

  update(msg: Msg) {
    switch(msg.kind) {
      case "updatefiles":
        this.files = msg.files;
    }

    console.log(this);
  }
}
