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

  async _request(endpoint, options) {
    const url = this.baseUrl.concat(endpoint);
    const response = await fetch(url, options);

    if (!response.ok) {
      const err = new Error(`HTTP ${response.status}`);
      err.status = response.status;
      throw err;
    }

    return response.json();
  }
}
