const { app, BrowserWindow, ipcMain, Tray, Menu } = require("electron");
const path = require("path");
const fs = require("fs");
const url = require("url");
let darkThemeSetting = "true";
let scheduleMonthViewSetting = "";
const directoryPath = __dirname;
const fileName = "/configSettings.json";
const filePath = path.join(directoryPath, fileName);
const log = require("electron-log");
//Set the log level (suggested: error, warn, info, verbose, debug, silly)
log.transports.file.level = "debug";

//Customize the log format
log.transports.file.format = "{h}:{i}:{s} [{level}]: {text}";
log.transports.file.maxSize = 5 * 1024 * 1024; // Max file size in bytes
log.transports.file.maxDays = 7; // Max number of days to keep log files

let splashWindow;
let mainWindow;

function readConfigSettings() {
  log.info("Getting config settings");
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, configSettings) => {
      if (err) {
        log.error("Error reading file from disk:", err);
        reject(err);
      } else {
        try {
          const settings = JSON.parse(configSettings);
          darkThemeSetting = settings.darkTheme || "true";
          scheduleMonthViewSetting = settings.scheduleMonthView || "true";
          if (darkThemeSetting === "") {
            darkThemeSetting = "true";
          }
          if (scheduleMonthViewSetting === "") {
            scheduleMonthViewSetting = "true";
          }
          resolve();
        } catch (err) {
          log.error("Error parsing JSON string:", err);
          reject(err);
        }
      }
    });
  });
}

async function createWindow() {
  await readConfigSettings();

  mainWindow = new BrowserWindow({
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

  mainWindow.loadFile("./dist/track-my-run/index.html");

  mainWindow.once("ready-to-show", () => {
    log.info("Main window ready");
    setTimeout(() => {
      splashWindow.close();
      mainWindow.show();
      // uncomment if you want to have dev tools open
      // mainWindow.webContents.openDevTools();
      mainWindow.removeMenu(true);
      mainWindow.maximize();
    }, 1000);
  });

  mainWindow.webContents.on("render-process-gone", (event, details) => {
    log.error("render process gone", details.reason);
  });

  mainWindow.webContents.on("destroyed", () => {
    log.error("Web contents destroyed");
  });
}

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 400,
    height: 200,
    frame: false,
    transparent: false,
    backgroundColor: "#101820ff",
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  const loadingUrl = url.format({
    pathname: path.join(
      __dirname,
      "angular-electron",
      "dist",
      "angular-electron",
      "index.html"
    ),
    protocol: "file:",
    slashes: true,
  });

  splashWindow.loadURL(loadingUrl);

  // Wait for the window to finish loading
  splashWindow.webContents.on("did-finish-load", () => {
    // Send a message to the renderer process with the desired route
    splashWindow.webContents.send("route", "/loading");
    setTimeout(() => {
      splashWindow.show();
    }, 1000);
  });
}

let tray = null;
app.whenReady().then(() => {
  tray = new Tray(path.join(__dirname, "./src/assets/TMR.ico"));
  const contextMenu = Menu.buildFromTemplate([
    // leave out the show more tray menu option until component is completed
    // { label: "More Info", click: () => showMoreInfoWindow() },
    { label: "Quit", click: () => app.quit() },
  ]);
  tray.setContextMenu(contextMenu);
  createSplashWindow();
  createWindow();
});

let moreInfoWindow;
function showMoreInfoWindow() {
  moreInfoWindow = new BrowserWindow({
    width: 700,
    height: 600,
    icon: path.join(__dirname, "./src/assets/TMR.ico"),
    frame: false,
    transparent: false,
    alwaysOnTop: true,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      preload: path.resolve(path.join(__dirname, "./preload.js")),
      enableRemoteModule: true,
    },
  });

  const moreUrl = url.format({
    pathname: path.join(
      __dirname,
      "angular-electron/dist/angular-electron/index.html"
    ),
    protocol: "file:",
    slashes: true,
    hash: "more",
  });

  moreInfoWindow.loadURL(moreUrl);

  // Wait for the window to finish loading
  moreInfoWindow.webContents.on("did-finish-load", () => {
    // Send a message to the renderer process with the desired route
    moreInfoWindow.webContents.send("route", "/more");
    setTimeout(() => {
      moreInfoWindow.show();
    }, 1000);
  });
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// IPC handlers and other code...
ipcMain.on("getThemeSettings", (event) => {
  event.sender.send("getThemeSettings", darkThemeSetting);
});

ipcMain.on("setThemeSettings", (event, value) => {
  themeVal = value;
  log.info("going to set theme to: ", themeVal);
  fs.readFile(filePath, (err, settings) => {
    if (err) {
      log.error("Error reading file:", err);
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
          if (err) log.error("Error writing file:", err);
          event.returnValue = darkThemeSetting.darkTheme;
        }
      );
    } catch (err) {
      log.error("Error parsing JSON string:", err);
    }
  });
});

ipcMain.on("getScheduleSettings", (event) => {
  event.sender.send("getScheduleSettings", scheduleMonthViewSetting);
});

ipcMain.on("setScheduleMonthView", (event, value) => {
  scheduleVal = value;
  log.info("going to set month view to: ", scheduleVal);
  fs.readFile(filePath, (err, settings) => {
    if (err) {
      log.error("Error reading file:", err);
      return;
    }
    try {
      const setting = JSON.parse(settings);
      monthViewSetting = setting;
      monthViewSetting.scheduleMonthView = scheduleVal;
      fs.writeFile(
        filePath,
        JSON.stringify(monthViewSetting, null, 2),
        (err) => {
          if (err) log.error("Error writing file:", err);
          event.returnValue = monthViewSetting.scheduleMonthView;
        }
      );
    } catch (err) {
      log.error("Error parsing JSON string:", err);
    }
  });
});

ipcMain.on("closeMoreInfoWindow", () => {
  if (moreInfoWindow) {
    moreInfoWindow.close();
  }
});
