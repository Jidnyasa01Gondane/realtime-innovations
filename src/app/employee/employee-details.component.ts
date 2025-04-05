import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  Platform,
  IonItem,
  IonLabel,
  IonItemOptions,
  IonItemOption,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';
import { DataService, Employee } from '../services/data.service';
import { CommonModule } from '@angular/common';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    IonItem,
    IonLabel,
    CommonModule,
    IonItemOptions,
    IonItemOption,
    IonIcon,
  ],
  standalone: true,
})
export class EmployeeDetailComponent {
  private platform = inject(Platform);
  @Input({ required: true }) employee!: Employee;
  @Output() isDeleted = new EventEmitter<boolean>();

  isIos() {
    return this.platform.is('ios');
  }
  constructor(private dataService: DataService, 
    private router: Router
  ) {
    addIcons({ trashOutline });
  }

  async deleteEmployee(id: number | undefined): Promise<void> {
    if(!id){
      return;
    }

    try {
      const status = await lastValueFrom(this.dataService.deleteEmployeeById(id))
      this.isDeleted.emit(true);
    } catch(error) {
      
    }
  }
}
