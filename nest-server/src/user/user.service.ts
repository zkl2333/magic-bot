import { Injectable, NotFoundException } from '@nestjs/common';

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
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }
}
