import { Component } from '@angular/core';
import { ElectronService } from 'src/app/services/electron.service';

@Component({
  selector: 'app-more-info',
  templateUrl: './more-info.component.html',
  styleUrls: ['./more-info.component.scss'],
})
export class MoreInfoComponent {
  constructor(private electronService: ElectronService) {}

  closeWindow() {
    this.electronService.send('closeMoreInfoWindow');
  }
}
