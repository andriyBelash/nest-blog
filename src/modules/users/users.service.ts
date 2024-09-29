import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { PaginationDto } from 'src/common/filter/paginate.dto';
import { paginate } from 'src/common/utils/paginate.utils';
import { instanceToPlain } from 'class-transformer';
import { CreateUserDto } from './dto/create-user.dto';
import * as path from 'path';
import * as fs from 'fs';
import * as bcrypt from 'bcrypt';
import type { PaginationData } from 'src/common/types/Shared';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async findOne(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findAll(pagination: PaginationDto): Promise<PaginationData<User[]>> {
    const result = await paginate<User, null>(this.usersRepository, pagination);
    // Використовуємо instanceToPlain для серіалізації та приховування пароля
    const data = instanceToPlain(result.data);

    return {
      data: data as User[],
      meta: result.meta,
    };
  }

  async update(id: number, updateData: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, updateData);
    return this.findById(id);
  }

  async getFileUrl(avatar: Express.Multer.File): Promise<string | null> {
    const appUrl = this.configService.get('APP_URL');
    let avatarUrl: null | string = null;
    if (avatar) {
      const fileName = `${Date.now()}-${avatar.originalname}`;
      const filePath = path.join('storage', 'users', fileName);
      // Створюємо директорію, якщо вона не існує
      await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
      await fs.promises.writeFile(filePath, avatar.buffer);
      // Формуємо повний URL для аватара
      avatarUrl = `${appUrl}/storage/users/${fileName}`;
    }
    return avatarUrl;
  }

  private async checkUserExistence(email: string, username: string, excludeUserId?: number): Promise<void> {
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
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }
    if (usernameUser) {
      throw new HttpException('Username already exists', HttpStatus.BAD_REQUEST);
    }
  }

  async createUser(body: CreateUserDto, avatar: Express.Multer.File) {
    await this.checkUserExistence(body.email, body.username);

    const hashedPassword = await bcrypt.hash('password', 10);

    const avatarUrl = await this.getFileUrl(avatar);
    await this.usersRepository.save({ ...body, password: hashedPassword, avatar_url: avatarUrl });
    return 'User created';
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
      user.avatar_url = await this.getFileUrl(file);
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
