const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

function createWindow() {
  // Main graph window
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    resizable: true,
    transparent: true,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      overflow: true,
    },
  });
  mainWindow.loadFile("graph_tracer.html");

  // Side panel window
  const sidePanelWindow = new BrowserWindow({
    width: 340,
    height: 800,
    resizable: true,
    transparent: false,
    frame: true,
    parent: mainWindow,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      overflow: true,
    },
  });
  sidePanelWindow.loadFile("side_panel.html");
  sidePanelWindow.setMenuBarVisibility(false);
  sidePanelWindow.setAlwaysOnTop(true);

  // IPC relay: sidePanel <-> mainWindow
  ipcMain.on("sidepanel-to-main", (event, data) => {
    mainWindow.webContents.send("sidepanel-to-main", data);
  });
  ipcMain.on("main-to-sidepanel", (event, data) => {
    sidePanelWindow.webContents.send("main-to-sidepanel", data);
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
