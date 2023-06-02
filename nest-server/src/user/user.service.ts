import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  private readonly users = [
    {
      id: 1,
      name: 'John Doe',
      age: 25,
      email: '',
    },
  ];

  create() {
    const user = {
      id: this.users.length + 1,
      name: 'John Doe',
      age: 25,
      email: '',
    };
    this.users.push(user);
  }

  get(id: number) {
    return this.users.find((user) => user.id === id);
  }
}
