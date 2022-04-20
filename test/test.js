import { resolve as resolvePath } from "path";
import { config } from "dotenv";
import { expect } from "chai";

import { AuthManager } from "../src/manager";

config({ path: resolvePath(process.cwd(), "test", ".env") });
const { M6_USERNAME, M6_PASSWORD, M6_TENANT, M6_AUTH_CODE } = process.env;

const manager = new AuthManager(M6_TENANT);

describe("AuthManager", () => {
  it("should be able to log in and verify the token set", async () => {
    const tokenSet = await manager.login(M6_USERNAME, M6_PASSWORD, M6_AUTH_CODE);
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
