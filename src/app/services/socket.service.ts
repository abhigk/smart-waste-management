import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

import * as socketIo from 'socket.io-client';

const SERVER_URL = '/';

@Injectable()
export class SocketService {
    private socket;

    public initSocket(): void {
        this.socket = socketIo(SERVER_URL);
    }

    public onNewNotification(): Observable<Object> {
        return new Observable<Object>(observer => {

            this.socket.on('notifications', (data) => {
                //console.log('check chek');
                observer.next(data);
            });
        });
    }

    public onNewReading(): Observable<Object> {
        return new Observable<Object>(observer => {
            this.socket.on('binReadings', (data) => observer.next(data));
        });
    }
}
