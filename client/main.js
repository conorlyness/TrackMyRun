const { app, BrowserWindow } = require("electron");
const { session, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

//have the dark theme as true on default
let darkThemeSetting = "true";
const directoryPath = __dirname; //directory path
const fileName = "/themeSettings.json";
const filePath = path.join(directoryPath, fileName);

fs.readFile(filePath, "utf8", (err, themeSettings) => {
  if (err) {
    console.log("Error reading file from disk:", err);
    return;
  }
  try {
    const settings = JSON.parse(themeSettings);
    darkThemeSetting = settings.darkTheme;
  } catch (err) {
    console.log("Error parsing JSON string:", err);
  }
});

ipcMain.on("getThemeSettings", (event) => {
  event.returnValue = darkThemeSetting;
});

ipcMain.on("setThemeSettings", (event, value) => {
  themeVal = value;
  console.log("going to set theme to: ", themeVal);
  fs.readFile(filePath, (err, settings) => {
    if (err) {
      console.log("Error reading file:", err);
      return;
    }
    try {
      const setting = JSON.parse(settings);
      darkThemeSetting = setting;
      darkThemeSetting.darkTheme = themeVal;
      fs.writeFile(
        filePath,
        JSON.stringify(darkThemeSetting, null, 2),
        (err) => {
          if (err) console.log("Error writing file:", err);
          event.returnValue = darkThemeSetting.darkTheme;
        }
      );
    } catch (err) {
      console.log("Error parsing JSON string:", err);
    }
  });
});

async function createWindow() {
  win = new BrowserWindow({
    show: false,
    icon: "./src/assets/TMR.ico",
    webPreferences: {
      webSecurity: false,
      preload: path.resolve(path.join(__dirname, "./preload.js")),
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });
  win.removeMenu(true);
  win.maximize();
  win.loadFile("./dist/track-my-run/index.html");
}

app.whenReady().then(() => {
  createWindow();
});
