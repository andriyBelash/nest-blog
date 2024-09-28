import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { PaginationDto } from 'src/common/filter/paginate.dto';
import type { IUser } from 'src/common/types/User';
import type { IUsersList } from 'src/common/types/User';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findAll(pagination: PaginationDto): Promise<IUsersList> {
    const page = pagination.page || 1;
    const per_page = pagination.per_page || 10;
    const [users, total] = await this.usersRepository.findAndCount({
      skip: (page - 1) * per_page,
      take: per_page,
    });
    const filtered = users.map(({ password: _, ...user }) => user) as IUser[];
    const meta = { total, page, per_page };

    return {
      data: filtered,
      meta,
    };
  }

  async update(id: number, updateData: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, updateData);
    return this.findById(id);
  }
}
