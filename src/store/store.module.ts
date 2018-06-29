import {ModuleWithProviders, NgModule} from "@angular/core";
import {ClientMediator} from "../client";
import {Store} from "./store.service";

@NgModule({
    imports: [],
    exports: [],
    declarations: [],
})
export class StoreModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: StoreModule,
            providers: [
                Store,
                ClientMediator
            ]
        }
    }
}