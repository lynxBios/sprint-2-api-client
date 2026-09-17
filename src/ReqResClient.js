import 'dotenv/config';

/**
 * API client for interacting with the ReqRes API.
 */

export class ReqResClient {
  constructor() {
    if (!process.env.API_BASE_URL) {
      throw new Error('API_BASE_URL must be set');
    }

    this.baseUrl = process.env.API_BASE_URL;
    this.apiKey = process.env.REQRES_API_KEY;
  }
}
