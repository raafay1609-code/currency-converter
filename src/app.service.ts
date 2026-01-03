import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { ConvertDto } from './convert.Dto';

@Injectable()
export class AppService {

  baseUrl: string = 'https://api.freecurrencyapi.com/v1';
  apiKey: string = '4E0VK7BnkdeUuh1vegAt808v2IUjzUR6lxcvBMT2'

  constructor(private http: HttpService) { }

  async getCurrencies() {
    try {
      const response = await lastValueFrom(
        this.http.get(`${this.baseUrl}/currencies`, {
          params: { apikey: this.apiKey }
        })
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getExchangeRates(dto: ConvertDto) {
    try {
      const { base_currency, target_currency, date, amount } = dto
      if (!date) {
        throw new BadRequestException('Date is required for historical conversion');
      }
      if (!target_currency) {
        throw new BadRequestException('Target currency is required for historical conversion');
      }
      const params: any = { apikey: this.apiKey, base_currency: base_currency, date: date, currencies: target_currency };
      const response = await lastValueFrom(
        this.http.get(`${this.baseUrl}/historical`, {
          params
        })
      );
      const data = Object.values(response.data.data)

      return {
        from: base_currency,
        to: target_currency,
        date: date,
        rate: data[0][target_currency],
        amount: amount,
        converted_amount: +(data[0][target_currency] * amount).toFixed(2)
      }

    } catch (error) {
      throw error;
    }
  }
}