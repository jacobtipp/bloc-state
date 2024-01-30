import { BlocBase, ClassType } from '@jacobtipp/bloc';
export declare const useBlocInstance: <Bloc extends ClassType<BlocBase<any>>>(bloc: Bloc) => InstanceType<Bloc>;
