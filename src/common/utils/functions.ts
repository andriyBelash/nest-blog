import * as path from 'path';
import * as fs from 'fs';
import { slugify as translitSlugify } from 'transliteration';

export async function getFileUrl(
  avatar: Express.Multer.File,
  BASE_URL: string,
  folder: string,
): Promise<string | null> {
  let avatarUrl: null | string = null;
  if (avatar) {
    const fileName = `${Date.now()}-${avatar.originalname}`;
    const filePath = path.join('storage', folder, fileName);
    // Створюємо директорію, якщо вона не існує
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
    await fs.promises.writeFile(filePath, avatar.buffer);
    // Формуємо повний URL для аватара
    avatarUrl = `${BASE_URL}/storage/${folder}/${fileName}`;
  }
  return avatarUrl;
}

export const slugify = (title: string) => {
  const slug = translitSlugify(title);
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
};
