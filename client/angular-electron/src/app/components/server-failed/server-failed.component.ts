import { Component } from '@angular/core';
import { ElectronService } from 'src/app/services/electron.service';

@Component({
  selector: 'app-server-failed',
  templateUrl: './server-failed.component.html',
  styleUrls: ['./server-failed.component.scss'],
})
export class ServerFailedComponent {
  constructor(private electronService: ElectronService) {}
  closeWindow() {
    this.electronService.send('closeServerFailedWindow');
  }
}
