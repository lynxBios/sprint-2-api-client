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

  async getUser(id) {
    const endpoint = `/api/users/${id}`;
    const options = {
      headers: {
        'x-api-key': this.apiKey,
      },
    };

    return await this._request(endpoint, options);
  }

  async createUser(userData) {
    const endpoint = `/api/users/`;
    const options = {
      method: 'POST',
      headers: {
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    };

    return await this._request(endpoint, options);
  }

  testContext() {
    setTimeout(() => {
      // An arrow function does not have its own this; it uses this from the surrounding testContext() context.
      // eslint-disable-next-line no-console
      console.log(this.baseUrl);
    }, 1000);
  }
}
