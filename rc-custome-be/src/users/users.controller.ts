import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    async getAllUser(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('sortBy') sortBy: string = 'name',
        @Query('order') order: 'asc' | 'desc' = 'asc',
        @Query('search') search: string = '',
    ): Promise<{ data: User[], meta: { currentPage: number, nextPage: number | null, total: number, remaining: number } }> {
        const { data, total } = await this.usersService.getAllUsers(page, limit, sortBy, order, search);

        const remaining = Math.max(0, total - (page * limit));
        const nextPage = remaining > 0 ? page + 1 : null;

        return {
            data,
            meta: {
                currentPage: page,
                nextPage,
                total,
                remaining,
            },
        };
    }

    @Post()
    createUser(@Body() user: Partial<User>): Promise<User> {
        return this.usersService.createUser(user);
    }

    @Put(':id')
    updateUser(@Param('id') id: number, @Body() user: Partial<User>): Promise<User> {
        return this.usersService.updateUser(id, user);
    }

    @Delete(':id')
    removeUser(@Param('id') id: number): Promise<void> {
        return this.usersService.removeUser(id);
    }
}
