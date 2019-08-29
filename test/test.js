import { expect } from "chai";

import { AuthManager } from "../src/manager";
import { username, password, tenant } from "./options.json";

const manager = new AuthManager(tenant);

// options.json content:
// {
//   "username": "",
//   "password": "",
//   "tenant": ""
// }

describe("AuthManager", () => {
  it("should be able to log in and verify the token set", async () => {
    const tokenSet = await manager.login(username, password);
    expect(Object.keys(tokenSet)).to.contain("refresh_token");
  });

  it("should be able to return all values from token set", () => {
    expect(manager.accessToken).to.not.be.undefined;
    expect(manager.refreshToken).to.not.be.undefined;
    expect(manager.idToken).to.not.be.undefined;
    expect(manager.expiresAt).to.not.be.undefined;
  });

  it("should be able to refresh a token set", async () => {
    const tokenSet = await manager.refresh();
    expect(Object.keys(tokenSet)).to.contain("refresh_token");
  });

  it("should correctly detect the token set expiration state", async () => {
    const expired = await manager.checkExpiration();
    expect(expired).to.be.false;
  });
});
