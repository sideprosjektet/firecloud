import {BrowserView, BrowserWindow, ipcMain, protocol, ProtocolResponse, screen, shell} from 'electron';
import {rendererAppName, rendererAppPort} from './constants';
import {environment} from '../environments/environment';
import {join} from 'path';
import {format} from 'url';
import {logger} from "@nrwl/tao/src/shared/logger";
import {loadSofApp} from "./utils/launch-url";
import authAuthorize from "./route/authAuthorize";
import fhirMetadata from "./route/fhirMetadata";
import fhirProxy from "./route/fhirProxy";
import authToken from "./route/authToken";
import otherProxy from "./route/otherProxy";
import {fork} from "child_process"
import axios from "axios";
import * as fs from "fs";


export default class App {
    // Keep a global reference of the window object, if you don't, the window will
    // be closed automatically when the JavaScript object is garbage collected.
    static mainWindow: Electron.BrowserWindow;
    static application: Electron.App;
    static BrowserWindow;

    public static isDevelopmentMode() {
        const isEnvironmentSet: boolean = 'ELECTRON_IS_DEV' in process.env;
        const getFromEnvironment: boolean =
            parseInt(process.env.ELECTRON_IS_DEV, 10) === 1;

        return isEnvironmentSet ? getFromEnvironment : !environment.production;
    }

    private static onWindowAllClosed() {
        if (process.platform !== 'darwin') {
            App.application.quit();
        }
    }

    private static onClose() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        App.mainWindow = null;
    }

    private static onRedirect(event: any, url: string) {
        console.log("redirect")
        if (url !== App.mainWindow.webContents.getURL()) {
            // this is a normal external redirect, open it in a new browser window
            event.preventDefault();
            shell.openExternal(url);
        }
    }

    private static onReady() {
        // This method will be called when Electron has finished
        // initialization and is ready to create browser windows.
        // Some APIs can only be used after this event occurs.
        App.initMainWindow();
        App.loadMainWindow();
        App.loadSubWindow();
        //App.registerExtraProtocol();
        App.mainWindow.webContents.openDevTools();
    }

    /**
     * Mulighet til å pipe kallene igjennom egen protokoll inne i appen. Noe som gjør at smart on fhir
     * appene ikke ser hvilken server de treffer. Dette gjør det også mulig å holde relativt mye av
     * de dataene som legen trenger i arbeidsminnet til electron. Feks kan appen i backend holde hele
     * eller deler av de pasientene som feks skal på besøk denne dagen. Systemet vil være lynraskt.
     * Oauth implementasjonen vil da kjøre inne her og kan kraftig forenkles.
     *
     * @private
     */
    private static registerExtraProtocol() {
        protocol.registerHttpProtocol("http", (request, callback) => {
            console.log("Fhir-request:", request);
            const requestUrl = new URL(request.url);
            const response: ProtocolResponse = {
                headers: {
                    "content-type": "application/json"
                }
            }
            if (requestUrl.pathname.startsWith("/fhir/metadata")) {
                callback(fhirMetadata(request, response));
            } else if (requestUrl.pathname.startsWith("/auth/authorize")) {
                authAuthorize(request, response).then(callback)
            } else if (requestUrl.pathname.startsWith("/auth/token")) {
                authToken(request, response).then(callback);
            } else if (requestUrl.pathname.startsWith("/fhir")) {
                fhirProxy(request, response).then(callback)
            } else {
                otherProxy(request, response).then(callback)
            }
        })
    }

    private static onActivate() {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (App.mainWindow === null) {
            App.onReady();
        }
    }

    private static initMainWindow() {
        const workAreaSize = screen.getPrimaryDisplay().workAreaSize;
        const width = Math.min(1280, workAreaSize.width || 1280);
        const height = Math.min(720, workAreaSize.height || 720);

        // Create the browser window.
        App.mainWindow = new BrowserWindow({
            width: width,
            height: height,
            show: false,
            webPreferences: {
                contextIsolation: false,
                backgroundThrottling: false,
                nodeIntegration: true,
                preload: join(__dirname, 'preload.js'),
            },
        });

        App.mainWindow.setMenu(null);
        App.mainWindow.center();

        // if main window is ready to show, close the splash window and show the main window
        App.mainWindow.once('ready-to-show', () => {
            App.mainWindow.show();
            axios.get("http://localhost:21342/api").then(res => {
                console.log(res.data)
            })

        });

        // handle all external redirects in a new browser window
        // App.mainWindow.webContents.on('will-navigate', App.onRedirect);
        // App.mainWindow.webContents.on('new-window', (event, url, frameName, disposition, options) => {
        //     App.onRedirect(event, url);
        // });

        // Emitted when the window is closed.
        App.mainWindow.on('closed', () => {
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            App.mainWindow = null;
        });

    }

    private static loadSubWindow() {
        const browserView = new BrowserView();
        App.mainWindow.setBrowserView(browserView);
        const y = 200;
        const x = 300;
        const {width, height} = App.mainWindow.getBounds();
        browserView.setBounds({x, y, width: width - x - 50, height: height - y - 50});
        browserView.webContents.loadURL("https://example.com/").then(r => {
            console.log("https://example.com/ loaded")
        })
        App.mainWindow.on('resize', () => {
            const {width, height} = App.mainWindow.getBounds();
            browserView.setBounds({x, y, width: width - x - 50, height: height - y - 50});
        });
        ipcMain.on('change-url', async (event, arg) => {
            const sampleApp = 'https://launch.smarthealthit.org/sample-app/launch.html';
            await loadSofApp(browserView, sampleApp)
            event.reply('asynchronous-reply', 'pong')
        })

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        browserView.webContents.on('will-navigate', function (event, oldUrl, newUrl) {
            console.log({oldUrl, newUrl});
        });
    }

    private static loadMainWindow() {
        // load the index.html of the app.
        const applicationUrl = App.application.isPackaged ?
            format({
                pathname: join(__dirname, '..', rendererAppName, 'index.html'),
                protocol: 'file:',
                slashes: true,
            }) : `http://localhost:${rendererAppPort}`;

        App.mainWindow.loadURL(applicationUrl).then(() => {
            logger.info(applicationUrl + " loaded")
        })
    }

    private static startInternalProxy() {
        const modulePath = join(__dirname, "..", "firecloud-internal-proxy", "main.js");
        const data = fs.readFileSync(modulePath, "utf-8")
        const sub = fork(modulePath, [], {stdio: "inherit"})

    }

    static main(app: Electron.App, browserWindow: typeof BrowserWindow) {
        // we pass the Electron.App object and the
        // Electron.BrowserWindow into this function
        // so this class has no dependencies. This
        // makes the code easier to write tests for
        App.startInternalProxy()
        App.BrowserWindow = browserWindow;
        App.application = app;

        App.application.on('window-all-closed', App.onWindowAllClosed); // Quit when all windows are closed.
        App.application.on('ready', App.onReady); // App is ready to load data
        App.application.on('activate', App.onActivate); // App is activated


    }
}
