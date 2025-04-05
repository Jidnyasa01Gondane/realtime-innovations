import { Injectable, inject } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';
@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  private toastController = inject(ToastController);

  constructor() {}

  async presentToast(position: 'top' | 'middle' | 'bottom', message: string): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: position,
    });

    await toast.present();
  }
}
