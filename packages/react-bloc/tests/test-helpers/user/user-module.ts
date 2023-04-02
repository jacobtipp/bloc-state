import { asClass } from 'awilix';
import { BlocModule } from '../../../src';
import { User } from './user';

export abstract class UserApi {
  abstract getUserData(): User;
}

export class UserRemoteApiImpl implements UserApi {
  getUserData(): User {
    return { name: { first: '', last: '' }, age: 0 };
  }
}

export const UserModule: BlocModule = (container) => {
  container.register(UserApi.name, asClass(UserRemoteApiImpl));
};
