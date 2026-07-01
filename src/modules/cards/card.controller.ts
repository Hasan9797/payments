import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CardService } from './card.service';

@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Get('get-all')
  getAll(@Query() query: any) {
    return this.cardService.getAll(query);
  }

  @Post('add')
  addCard(@Body() body: any) {
    return this.cardService.addCard(body);
  }

  @Get('get-by-id')
  async getById(@Query() query: any) {
    return await this.cardService.getById(query);
  }

  @Put('update')
  async updateCard(@Body() body: any) {
    return await this.cardService.updateCard(body);
  }

  @Delete('delete')
  async deleteCard(@Query() query: any) {
    return await this.cardService.deleteCard(query);
  }
}
