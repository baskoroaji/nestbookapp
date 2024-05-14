import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBookDto, UpdateBookDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) {}

  getBookmarks(userId: number) {
    return this.prisma.book.findMany({
      where: {
        userId,
      },
    });
  }

  getBookmarkById(userId: number, bookId: number) {
    return this.prisma.book.findFirst({
      where: {
        id: bookId,
        userId,
      },
    });
  }

  async createBookmark(userId: number, dto: CreateBookDto) {
    const bookmark = await this.prisma.book.create({
      data: {
        userId,
        ...dto,
      },
    });

    return bookmark;
  }

  async editBookmarkById(userId: number, bookId: number, dto: UpdateBookDto) {
    // get the bookmark by id
    const bookmark = await this.prisma.book.findUnique({
      where: {
        id: bookId,
      },
    });

    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException('Access to resources denied');

    return this.prisma.book.update({
      where: {
        id: bookId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteBookmarkById(userId: number, bookId: number) {
    const bookmark = await this.prisma.book.findUnique({
      where: {
        id: bookId,
      },
    });

    // check if user owns the bookmark
    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException('Access to resources denied');

    await this.prisma.book.delete({
      where: {
        id: bookId,
      },
    });
  }
}
