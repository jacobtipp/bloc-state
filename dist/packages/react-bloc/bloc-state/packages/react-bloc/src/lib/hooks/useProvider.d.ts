import { AnyClassType } from '../components/provider';
export declare const useProvider: <Class extends AnyClassType>(classDef: Class) => InstanceType<Class>;
