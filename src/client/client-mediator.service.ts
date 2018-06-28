import {EventEmitter, Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";

@Injectable()
export class ClientMediator {

    private _emitter = new EventEmitter<RequestStartedEventArgs>();

    public get events(): Observable<RequestStartedEventArgs> {
        return this._emitter.asObservable();
    }

    notifyRequestStarted(text: string): RequestStartedEventArgs {
        let reqStarted = new RequestStartedEventArgs(text);
        this._emitter.emit(reqStarted);
        return reqStarted
    }
}

export class RequestStartedEventArgs {
    text: string;
    success = new EventEmitter();
    error = new EventEmitter();
    complete = new EventEmitter();

    constructor(text: string) {
        this.text = text;
    }
}