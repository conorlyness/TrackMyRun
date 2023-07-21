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
    console.log('Setting up IPC listener for channel:', channel);
    if (!this._ipc) {
      console.warn("Electron's IPC was not loaded");
      return;
    }

    this._ipc.on(channel, (event, ...args) => {
      console.log(`Received IPC message on channel ${channel}:`, ...args);
      listener(event, ...args);
    });
  }

  public send(channel: string, ...args: any[]): void {
    console.log('Sending IPC message on channel:', channel);
    if (!this._ipc) {
      return;
    }
    this._ipc.send(channel, ...args);
  }

  public onOnce(channel: string): Promise<any> {
    console.log('Setting up one-time IPC listener for channel:', channel);
    return new Promise((resolve, reject) => {
      if (!this._ipc) {
        reject(new Error("Electron's IPC is not available."));
        return;
      }

      const onceListener = (...args: any[]) => {
        if (this._ipc) {
          this._ipc.off(channel, onceListener);
        }
        console.log(
          'Received IPC message on channel:',
          channel,
          'with args:',
          args
        );
        resolve(args);
      };

      this._ipc.once(channel, onceListener);
    });
  }
}
