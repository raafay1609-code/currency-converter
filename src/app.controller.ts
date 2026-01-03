import { Body, Controller, Get, HttpException, InternalServerErrorException, NotFoundException, Post, Query, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse } from './api.response';
import { get } from 'http';
import { ConvertDto } from './convert.Dto';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('currencies')
  async getCurrencies() {
    try {
      const data = await this.appService.getCurrencies();
      if (!data || !data.data) {
        throw new NotFoundException('Currencies not found');
      }
      const arr = Object.values(data.data);
      const ApiResponse: ApiResponse<any> = {
        code: 1,
        message: 'Success',
        data: arr
      };
      return ApiResponse
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch currencies');
    }
  }

  @Post('convert')
  async convert(@Body() convertDTO: ConvertDto) {
    try {
      const data = await this.appService.getExchangeRates(convertDTO);
      if (!data) {
        throw new NotFoundException('Exchange rate not found for given currencies');
      }
      const ApiResponse: ApiResponse<any> = {
        code: 1,
        message: 'Success',
        data: data
      };
      return ApiResponse
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Conversion failed');
    }
  }
}
