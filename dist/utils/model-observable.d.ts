import { Model } from "../model";
import { Observable } from "rxjs-compat";
/**
 * Used for configuring the Observable<ObservedModel>s generated by the ModelObservable class.
 * The ConfigNode represents a tree, which contains the name of the properties the observable will watch.
 */
export interface ConfigNode {
    name: string;
    children: ConfigNode[];
}
/**
 * Contains the changed Model, the defined action and the path to the source of the change.
 * In case of elements in lists the path variable does not contain the object's place in the list
 * @property path source of the change
 * @property action defines the nature of the change. Primitive and reference changes are referred to as 'change',
 * BehaviourList actions can be 'add', 'remove', or 'clear'
 * @property model the changed object
 * @property oldValue if a value was changed, then the the original, else its null
 */
export declare class ObservedModel {
    path?: string;
    action?: string;
    model: any;
    oldValue?: any;
}
/**
 * Used for generating observables for Model objects. These observables are configurable to watch only certain properties
 * of the Model object. This descriptor is a ConfigNode, which can be generated from a string or created by the user.
 * The observable's next function is called when:
 * - watched object's primitive property is changed
 * - watched object's complex property reference is changed
 * - watched BehaviourList gets an element added or removed
 * - watched BehaviourList gets cleared
 *
 * BehaviourList element properties can be added to the configuration (see example)
 * Adding a complex object to the ConfigNode, which is not part of the applied Model object or is undefined will result
 * in an error. This is because complex objects are watched through the Model's subject property.
 */
export declare class ModelObservable {
    /**Generates a ConfigNode object from the given string and settings, which can be used in generating observables for
     * the desired object.
     * @example
     * row separator: \n, tabulator: spacespace
     * let node = stringToNode("test","itemList
     * imageList
     *   file
     *   properties
     * complexObject
     *   type
     *   subObject
     *     type
     *     properties
     *   image
     * object","\n","  ");
     * @param {string} name the name of the root config node, usually the name of the object the configuration is made for
     * @param {string} str configuration data, see example
     * @param {string} nodeSeparator separates the configuration node names, see example
     * @param {string} tabulator used for determining parent-child relationships in complex objects, see example
     * @returns {ConfigNode} generated from the given string
     */
    static stringToNode(name: string, str: string, nodeSeparator: string, tabulator: string): ConfigNode;
    /**
     * Creates an Observable<ObservedModel> on the given Model object. The detected fields are set by the ConfigNode.
     * @param {Model} obj observed object
     * @param {ConfigNode} configNode observation config
     * @returns {Observable<ObservedModel>} generated observable
     */
    static getObservable(obj: Model, configNode: ConfigNode): Observable<ObservedModel>;
    static getObservable(obj: Model, configStr: string): Observable<ObservedModel>;
    /**
     * Creates an Observable<ObservedModel> on the given Model object. The detected fields are set by the ConfigNode array.
     * @param {Model} obj observed object
     * @param {ConfigNode[]} configArray determines the watched properties
     * @param fullDetection whether the current obj detects changes on all of its properties or just the ones that are
     * described in the configArray
     * @returns {Observable<ObservedModel>} generated observable
     */
    static generate(obj: Model, configArray: ConfigNode[], fullDetection?: boolean): Observable<ObservedModel>;
    /**
     * Merges two observables and appends the path variable of the ObservedModel appropriately.
     * @param {Observable<ObservedModel>} observable original observable
     * @param {Observable<ObservedModel>} otherObservable newly added observable
     * @param {string} prop name of the currently viewed property
     * @returns {Observable<ObservedModel>}
     */
    private static combineObservables;
    /**
     * Mapping for the correct path visualization
     * @param prop name of the currently viewed property
     * @returns {(value) => ObservedModel} modified observedModel with correct path
     */
    private static pathMap;
}
