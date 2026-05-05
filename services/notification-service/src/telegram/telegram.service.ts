import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
const { HttpsProxyAgent } = require('https-proxy-agent');

interface TelegramResponse {
  ok: boolean;
  result: unknown;
}

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);

  private readonly token: string;
  private readonly chatId: string;
  private readonly proxyUrl?: string;

  constructor(private readonly configService: ConfigService) {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    const chatId = this.configService.get<string>('TELEGRAM_CHAT_ID');
    const proxyUrl = this.configService.get<string>('TELEGRAM_PROXY_URL');

    if (!token) throw new Error('TELEGRAM_BOT_TOKEN is not set');
    if (!chatId) throw new Error('TELEGRAM_CHAT_ID is not set');

    this.token = token;
    this.chatId = chatId;
    this.proxyUrl = proxyUrl ?? undefined;
  }

  async sendMessage(text: string): Promise<void> {
    const agent = this.proxyUrl
      ? new HttpsProxyAgent(this.proxyUrl)
      : undefined;

   
      await axios.post<TelegramResponse>(
        `https://api.telegram.org/bot${this.token}/sendMessage`,
        {
          chat_id: this.chatId,
          text,
          parse_mode: 'HTML',
        },
        {
          httpAgent: agent,
          httpsAgent: agent,
        },
      );
  }

  handleError(err: unknown): void {
    if (axios.isAxiosError(err)) {
      this.logger.error('[telegram api] error', {
        message: err.message,
        response: err.response?.data,
      });
      return;
    }

    this.logger.error('[telegram api] unknown error', err);
  }
}
