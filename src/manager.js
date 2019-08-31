"use strict";

import { AuthProvider } from "./authentication";
import { getTime } from "./utils/common";

export class AuthManager {
  constructor(tenant, tokenSet) {
    this._authProvider = new AuthProvider(tenant);

    this.tokenSet = tokenSet || {};
  }

  get accessToken() {
    return this.tokenSet.access_token;
  }

  get refreshToken() {
    return this.tokenSet.refresh_token;
  }

  get idToken() {
    return this.tokenSet.id_token;
  }

  get expiresAt() {
    return this.tokenSet.expires_at;
  }

  async checkExpiration(autoRefresh = true) {
    const expired = getTime() > this.expiresAt;

    if (expired && autoRefresh) {
      await this.refresh();
    }

    return expired;
  }

  async login(username, password) {
    const code = await this._authProvider.getCode(username, password);
    this.tokenSet = await this._authProvider.getTokenSet(code);

    return this.tokenSet;
  }

  async refresh() {
    this.tokenSet = await this._authProvider.refreshTokenSet(this.refreshToken);
    return this.tokenSet;
  }
}
