import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Platform, IonItem, IonLabel, IonItemOptions, IonItemOption, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';
import { DataService, Employee } from '../shared/services/data.service';

import { lastValueFrom } from 'rxjs';
import { ToasterService } from '../shared/services/toaster.service';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IonItem, IonLabel, IonItemOptions, IonItemOption, IonIcon],
  standalone: true,
})
export class EmployeeDetailComponent implements OnInit {
  @Input({ required: true }) employee!: Employee;
  @Output() isDeleted = new EventEmitter<boolean>();
  isLargerScreen = false;
  private platform = inject(Platform);

  constructor(
    private dataService: DataService,
    private toasterService: ToasterService
  ) {
    addIcons({ trashOutline });
    this.checkDeviceSize();
  }

  ngOnInit(): void {
    window.addEventListener('resize', () => this.checkDeviceSize());
  }

  async deleteEmployee(id: number | undefined): Promise<void> {
    if (!id) {
      return;
    }

    try {
      await lastValueFrom(this.dataService.deleteEmployeeById(id));
      this.isDeleted.emit(true);
      await this.toasterService.presentToast('bottom', `Employee has been deleted successfully`);
    } catch (error) {
      await this.toasterService.presentToast('bottom', `Error adding employee`);
    }
  }

  checkDeviceSize(): void {
    this.isLargerScreen = this.platform.width() > 768;
  }
}
