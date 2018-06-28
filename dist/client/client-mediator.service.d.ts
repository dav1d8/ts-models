import { EventEmitter } from "@angular/core";
import { Observable } from "rxjs/Observable";
export declare class ClientMediator {
    private _emitter;
    readonly events: Observable<RequestStartedEventArgs>;
    notifyRequestStarted(text: string): RequestStartedEventArgs;
}
export declare class RequestStartedEventArgs {
    text: string;
    success: EventEmitter<{}>;
    error: EventEmitter<{}>;
    complete: EventEmitter<{}>;
    constructor(text: string);
}
