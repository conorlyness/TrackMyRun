const { app, BrowserWindow } = require("electron");
const { session } = require("electron");
const path = require("path");

async function createWindow() {
  await session.defaultSession.clearStorageData();
  win = new BrowserWindow({
    show: false,
    icon: "./src/assets/track-my-run-high-resolution.ico",
    webPreferences: {
      webSecurity: false,
      preload: path.resolve(path.join(__dirname, "./preload.js")),
    },
  });
  win.removeMenu(true);
  win.maximize();
  win.loadFile("./dist/track-my-run/index.html");
}

app.whenReady().then(() => {
  createWindow();
});
