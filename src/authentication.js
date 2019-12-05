"use strict";

import fetch from "node-fetch";
import { Issuer, generators, custom } from "openid-client";

import { extractQueryParameter } from "./utils/common";

export class AuthProvider {
  constructor(tenant) {
    this.tenant = tenant;
    this.client = null;

    this.codeVerifier = generators.codeVerifier();
    this.state = generators.state();
    this.nonce = generators.nonce();
  }

  async validate(response) {
    const code = response.status;

    if (code === 200) {
      return;
    } else {
      const data = await response.json();
      throw new Error(data.error || code);
    }
  }

  refreshTokenSet(refreshToken) {
    return this.client.refresh(refreshToken)
  }

  getTokenSet(code) {
    return this.client.callback(
      "m6loapp://oauth2redirect/",
      { code: code },
      { code_verifier: this.codeVerifier, nonce: this.nonce },
      { exchangeBody: { client_id: "M6LOAPP", headers: {} } }
    );
  }

  async getCode(username, password, authCode) {
    const issuerUrl = "https://accounts.magister.net";
    const issuer = await Issuer.discover(issuerUrl);
    const codeChallenge = generators.codeChallenge(this.codeVerifier);

    this.client = new issuer.Client({
      authority: issuerUrl,
      client_id: "M6LOAPP",
      redirect_uris: ["m6loapp://oauth2redirect/"],
      response_types: ["code id_token"],
      id_token_signed_response_alg: "RS256",
      token_endpoint_auth_method: "none"
    });

    this.client[custom.clock_tolerance] = 5;

    const authUrl = this.client.authorizationUrl({
      scope: issuer.scopes_supported.join(" "),
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
      acr_values: `tenant:${this.tenant}`,
      client_id: "M6LOAPP",
      state: this.state,
      nonce: this.nonce,
      prompt: "select_account"
    });

    const noRedirects = { redirect: "manual", follow: 0 };
    const authResponse = await fetch(authUrl, noRedirects).then(response =>
      fetch(response.headers.get("location"), noRedirects)
    );

    const location = authResponse.headers.get("location");
    const sessionId = extractQueryParameter(
      `${issuerUrl}${location}`,
      "sessionId"
    );
    const returnUrl = extractQueryParameter(
      `${issuerUrl}${location}`,
      "returnUrl"
    );

    const cookies = authResponse.headers.raw()["set-cookie"];
    const xsrfCookie = cookies.filter(
      cookie => cookie.split("=")[0] === "XSRF-TOKEN"
    )[0];
    const xsrfToken = xsrfCookie.split("=")[1].split(";")[0];

    await fetch(`${issuerUrl}/challenges/username`, {
      method: "post",
      body: JSON.stringify({
        authCode,
        sessionId,
        returnUrl,
        username
      }),
      headers: {
        "Content-Type": "application/json",
        cookie: authResponse.headers.raw()["set-cookie"],
        "X-XSRF-TOKEN": xsrfToken
      }
    }).then(this.validate);

    const authCookies = await fetch(`${issuerUrl}/challenges/password`, {
      method: "post",
      body: JSON.stringify({
        authCode,
        sessionId,
        returnUrl,
        password
      }),
      headers: {
        "Content-Type": "application/json",
        cookie: authResponse.headers.raw()["set-cookie"],
        "X-XSRF-TOKEN": xsrfToken
      }
    }).then(response => {
      this.validate(response);
      return response.headers.raw()["set-cookie"];
    });

    return fetch(`${issuerUrl}${returnUrl}`, {
      redirect: "manual",
      follow: 0,
      headers: {
        cookie: authCookies
      }
    }).then(response => {
      const url = response.headers.get("location");
      return url.split("#code=")[1].split("&")[0];
    });
  }
}
