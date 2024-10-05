import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Like, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { SearchUsers } from './dto/search-users.dto';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { CreateUserDto } from './dto/create-user.dto';
import { getFileUrl } from 'src/common/utils/functions';
import * as bcrypt from 'bcrypt';
import type { PaginationData } from 'src/common/types/Shared';

@Injectable()
export class UsersService {
  private APP_URL: string;
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {
    this.APP_URL = this.configService.get('APP_URL');
  }

  async findOne(email: string, withPassword = false): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (withPassword) {
      return user;
    } else {
      const userInstance = plainToInstance(User, user);
      return instanceToPlain(userInstance) as User;
    }
  }

  async findById(id: number): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findAll(queryDto: SearchUsers): Promise<PaginationData<User[]>> {
    const { page, per_page, search, role } = queryDto;

    const whereCondition: any = {
      username: search ? Like(`%${search}%`) : undefined,
    };

    if (role) {
      whereCondition.role = role;
    }

    const [items, total] = await this.usersRepository.findAndCount({
      skip: (page - 1) * per_page,
      take: per_page,
      order: {
        id: 'DESC',
      },
      where: whereCondition,
    });

    const data = instanceToPlain(items);
    return {
      data: data as User[],
      meta: { total, page, per_page },
    };
  }

  async update(id: number, updateData: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, updateData);
    return this.findById(id);
  }

  public async checkUserExistence(email: string, username: string, excludeUserId?: number): Promise<void> {
    const emailQuery = this.usersRepository.createQueryBuilder('user').where('user.email = :email', { email });
    const usernameQuery = this.usersRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username });

    if (excludeUserId) {
      emailQuery.andWhere('user.id != :id', { id: excludeUserId });
      usernameQuery.andWhere('user.id != :id', { id: excludeUserId });
    }

    const [emailUser, usernameUser] = await Promise.all([emailQuery.getOne(), usernameQuery.getOne()]);

    if (emailUser) {
      throw new HttpException('email_already_exists', HttpStatus.BAD_REQUEST);
    }
    if (usernameUser) {
      throw new HttpException('username_already_exists', HttpStatus.BAD_REQUEST);
    }
  }

  async createUser(body: CreateUserDto, avatar: Express.Multer.File): Promise<User> {
    await this.checkUserExistence(body.email, body.username);

    const hashedPassword = await bcrypt.hash('password', 10);

    const avatarUrl = await getFileUrl(avatar, this.APP_URL, 'users');
    const newUser = await this.usersRepository.save({ ...body, password: hashedPassword, avatar_url: avatarUrl });
    const userInstance = plainToInstance(User, newUser);
    return instanceToPlain(userInstance) as User;
  }

  async updateUser(id: number, body: Partial<CreateUserDto>, file: Express.Multer.File) {
    const user = await this.findById(id);
    if (!user) {
      return new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    if (body.email || body.username) {
      await this.checkUserExistence(body.email || user.email, body.username || user.username, id);
    }

    if (file) {
      user.avatar_url = await getFileUrl(file, this.APP_URL, 'users');
    }

    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }

    this.usersRepository.merge(user, body);
    const results = await this.usersRepository.save(user);

    return instanceToPlain(results);
  }

  async deleteUser(id: number) {
    const user = await this.findById(id);
    if (!user) {
      return new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    await this.usersRepository.delete(id);
    return 'User deleted';
  }
}
