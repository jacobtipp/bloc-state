import { AnyClassType } from '../components';
/**
 * A custom React hook that retrieves an instance of a class from a context map.
 * This hook is designed to be used within a context provider system where class instances
 * are stored in a context map by their class names. It facilitates the access to these instances
 * by other components down the React component tree.
 *
 * @template Class The class type of the instance to retrieve. This class must extend AnyClassType.
 *
 * @param {Class} classDef The class definition of the instance to retrieve. This is used to
 * identify the corresponding context in the context map.
 *
 * @returns {InstanceType<Class>} The instance of the class retrieved from the context map. The instance
 * is cast to the appropriate type based on the class definition provided.
 *
 * @throws {Error} Throws an error if the context map does not exist or if the specified class
 * does not exist within the context map. This ensures that the hook is used within a properly
 * initialized context provider system and that requests are made for classes that have been
 * provided to the context.
 */
export declare const useProvider: <Class extends AnyClassType>(classDef: Class) => InstanceType<Class>;
