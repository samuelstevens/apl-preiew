# APL Previewer

## Set Up

Install node, npm and python.
I use node `17.5.0`, npm `8.4.1` and python `3.10.7`.
I tried with node `18.6.0` and ran into [this bug](https://github.com/parcel-bundler/parcel/issues/8005).

Run `npm ci` to install the *exact* dependencies in `package-lock.json`.
Run `npm run build` to build the app.
If there are errors, you might need to run `rm -rf dist/ .parcel-cache/`
Then run `python src/backend/server.py --directory dist/` to start the server.
Open up `localhost:8888` to see the interface.

You should put your example APL documents in `dist/`, then reference them in the text input.
So I put `example.json` (included in `examples/`) in `dist/`, then type "example.json" into the text input, then click "Update".
Then I see the APL document show up in the first preview (the circle).
You can enter multiple documents in the text field, separated by whitespace, to see them in the different views.

## Workflow

1. Edit some APL documents (typically I would hand-edit the JSON files).
2. Switch to the APL Preview tab.
3. Click "Update".
4. See the new APL document preview.
5. Repeat.

## To Do

- Add option to change viewport from webview.
- Improve the stupid textfield update.
- Improve error handling instead of just crashing.
