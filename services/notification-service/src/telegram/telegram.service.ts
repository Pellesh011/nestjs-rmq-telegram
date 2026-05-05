import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
const { HttpsProxyAgent } = require("https-proxy-agent");

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);

  private token;
  private chatId;
  private proxyUrl;
  constructor(private configService: ConfigService) {
    this.proxyUrl = this.configService.get<string>('TELEGRAM_PROXY_URL');
    this.chatId = this.configService.get<string>('TELEGRAM_CHAT_ID');
    this.token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
  }

  async sendMessage(text: string): Promise<void> {
    try {
      const agent = this.proxyUrl ? new HttpsProxyAgent(this.proxyUrl) : undefined;
      await axios.post(
        `https://api.telegram.org/bot${this.token}/sendMessage`,
        {
          chat_id: this.chatId,
          text,
          parse_mode: 'HTML',
        }, {
          httpAgent: agent,
          httpsAgent: agent,
        },
      );
    } catch (err) {
      this.logger.error('[telegram api] error', err)
      throw err;
    }
  }
}