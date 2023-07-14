import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';

@Injectable({
  providedIn: 'root',
})
export class ElectronService {
  private _ipc: IpcRenderer | undefined;

  constructor() {
    if (window.require) {
      try {
        this._ipc = window.require('electron').ipcRenderer;
      } catch (e) {
        throw e;
      }
    } else {
      console.warn("Electron's IPC was not loaded");
    }
  }
  public on(channel: string, listener: any): void {
    if (!this._ipc) {
      return;
    }
    this._ipc.on(channel, listener);
  }

  public send(channel: string, ...args: any[]): void {
    if (!this._ipc) {
      return;
    }
    this._ipc.sendSync(channel, ...args);
  }

  public onOnce(channel: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this._ipc) {
        reject(new Error("Electron's IPC is not available."));
        return;
      }

      const onceListener = (...args: any[]) => {
        if (this._ipc) {
          this._ipc.off(channel, onceListener);
        }
        resolve.apply(null, [args]);
      };

      this._ipc.once(channel, onceListener);
    });
  }
}
