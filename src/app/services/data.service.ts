import { inject, Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable } from 'rxjs';

export interface Message {
  fromName: string;
  subject: string;
  date: string;
  id: number;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  dbService = inject(NgxIndexedDBService);

  constructor() { }

  public getMessages(): Observable<any> {
    return this.dbService.getAll('employee')
  }

  public getMessageById(id: number): Message {
    return {} as Message;
  }
}
