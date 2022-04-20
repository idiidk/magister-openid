"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AuthManager = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _authentication = require("./authentication");

var _common = require("./utils/common");

var AuthManager = /*#__PURE__*/function () {
  function AuthManager(tenant, tokenSet) {
    (0, _classCallCheck2["default"])(this, AuthManager);
    this._authProvider = new _authentication.AuthProvider(tenant);
    this.tokenSet = tokenSet || {};
  }

  (0, _createClass2["default"])(AuthManager, [{
    key: "accessToken",
    get: function get() {
      return this.tokenSet.access_token;
    }
  }, {
    key: "refreshToken",
    get: function get() {
      return this.tokenSet.refresh_token;
    }
  }, {
    key: "idToken",
    get: function get() {
      return this.tokenSet.id_token;
    }
  }, {
    key: "expiresAt",
    get: function get() {
      return this.tokenSet.expires_at;
    }
  }, {
    key: "checkExpiration",
    value: function () {
      var _checkExpiration = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var autoRefresh,
            expired,
            _args = arguments;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                autoRefresh = _args.length > 0 && _args[0] !== undefined ? _args[0] : true;
                expired = (0, _common.getTime)() > this.expiresAt;

                if (!(expired && autoRefresh)) {
                  _context.next = 5;
                  break;
                }

                _context.next = 5;
                return this.refresh();

              case 5:
                return _context.abrupt("return", expired);

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function checkExpiration() {
        return _checkExpiration.apply(this, arguments);
      }

      return checkExpiration;
    }()
  }, {
    key: "login",
    value: function () {
      var _login = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(username, password, authCode) {
        var code;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this._authProvider.getCode(username, password, authCode);

              case 2:
                code = _context2.sent;
                _context2.next = 5;
                return this._authProvider.getTokenSet(code);

              case 5:
                this.tokenSet = _context2.sent;
                return _context2.abrupt("return", this.tokenSet);

              case 7:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function login(_x, _x2, _x3) {
        return _login.apply(this, arguments);
      }

      return login;
    }()
  }, {
    key: "refresh",
    value: function () {
      var _refresh = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this._authProvider.refreshTokenSet(this.refreshToken);

              case 2:
                this.tokenSet = _context3.sent;
                return _context3.abrupt("return", this.tokenSet);

              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function refresh() {
        return _refresh.apply(this, arguments);
      }

      return refresh;
    }()
  }]);
  return AuthManager;
}();

exports.AuthManager = AuthManager;