import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
const { HttpsProxyAgent } = require("https-proxy-agent");

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);

  private readonly token = process.env.TELEGRAM_BOT_TOKEN!;
  private readonly chatId = process.env.TELEGRAM_CHAT_ID!;
  constructor(private configService: ConfigService) {}

  async sendMessage(text: string): Promise<void> {
    try {
      const proxyUrl = this.configService.get<string>('TELEGRAM_PROXY_URL');
      const agent = proxyUrl ? new HttpsProxyAgent(proxyUrl) : undefined;
      console.log(proxyUrl)
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