# Magister OpenID

<img src="https://img.shields.io/github/issues/idiidk/magister-openid?style=for-the-badge" />

> OpenID authentication wrapper for the Magister digital school system

This package provides a simple and spec compliant API for requesting, refreshing and managing authentication tokens

Simple authentication flow:
```javascript
import { AuthManager } from "magister-openid";
import { username, password, tenant } from "./options.json";

const manager = new AuthManager(tenant);

async function login() {
  const tokenSet = await manager.login(username, password);
  //do stuff with tokens
}

login();
```

Refreshing tokens and checking for expiration of tokens are both implemented in the tests. They provide further documentation.

This library would not be possible without the incredible [Node OpenID library](https://www.npmjs.com/package/openid-client), created by [@panva](https://github.com/panva/), thank you very much for the amazing work!
