//Mon Jul 29 2024 09:58:01 GMT+0000 (Coordinated Universal Time)
//Base:https://github.com/echo094/decode-js
//Modify:https://github.com/smallfawn/decode_action
const $ = new Env("一汽大众"),
  CryptoJS = require("crypto-js"),
  axios = require("axios"),
  {
    sendNotify
  } = require("./sendNotify");
let notifyStr = "";
const Did = process.env.yqdz_Did,
  apiHost = "https://one-app-h5.faw-vw.com/prod-api/mobile/one-app";
(async () => {
  const _0x2c558c = process.env.yqdz_accounts;
  if (!Did || !_0x2c558c) {
    logAndNotify("yqdz_Did或yqdz_accounts不存在");
    return;
  }
  let _0x2f41a1 = _0x2c558c.split("\n");
  for (let _0x2b4b4d = 0; _0x2b4b4d < _0x2f41a1.length; _0x2b4b4d++) {
    const _0x593f8b = _0x2f41a1[_0x2b4b4d].split("#")[0],
      _0x163355 = _0x2f41a1[_0x2b4b4d].split("#")[1],
      _0x5d4a82 = await sendPostRequest("/user/public/v1/login", undefined, {
        account: "" + _0x593f8b,
        password: "" + _0x163355,
        scope: "openid profile mbb"
      });
    if (_0x5d4a82.data.returnStatus !== "SUCCEED") {
      logAndNotify("账号【" + (_0x2b4b4d + 1) + "】 【" + _0x593f8b + "】登录失败");
      continue;
    }
    logAndNotify("账号【" + (_0x2b4b4d + 1) + "】 【" + _0x593f8b + "】登录成功");
    const _0x184589 = _0x5d4a82.data.data.tokenInfo,
      _0x20f648 = await sendGetRequest("/general/public/v1/mall/integral/get_days_sign", _0x184589.accessToken);
    if (_0x20f648.data.returnStatus !== "SUCCEED") {
      logAndNotify("账号【" + (_0x2b4b4d + 1) + "】 【" + _0x593f8b + "】签到失败");
      continue;
    }
    logAndNotify("账号【" + (_0x2b4b4d + 1) + "】 【" + _0x593f8b + "】签到成功 累计签到【" + _0x20f648.data.data.totaldays + "】天 积分【" + _0x20f648.data.data.availablescore + "】");
  }
})().catch(_0x4c7ccb => {
  logAndNotify(_0x4c7ccb);
}).finally(() => {
  sendNotify("一汽大众", notifyStr);
  $.done();
});
function oaSignFunc(_0x53034f) {
  var _0x1fefbf = _0x53034f.url,
    _0x2eaba6 = _0x53034f.data,
    _0x52dec5 = "",
    _0xc74704 = {};
  _0x1fefbf.split("?")[1] && _0x1fefbf.split("?")[1].split("&").forEach(function (_0x544201) {
    var _0x1ceec2 = _0x544201.split("=");
    _0xc74704[_0x1ceec2[0]] = decodeURIComponent(_0x1ceec2[1]);
  });
  var _0x5d0cf3 = _0xc74704.signTimestamp,
    _0x5d4a99 = _0xc74704.nonce,
    _0x47605f = btoa(unescape(encodeURIComponent(JSON.stringify(_0x2eaba6)))) + _0x5d4a99 + _0x5d0cf3,
    _0x1bc56a = CryptoJS.HmacSHA256(_0x47605f, atob("NjNmYThjZDA2ZGRhMzQ3ODQ3MTNjMWZkY2NmN2U2YmQ=")).words,
    _0x5c3ab1 = new ArrayBuffer(32),
    _0x1cf9b5 = new DataView(_0x5c3ab1);
  _0x1bc56a.forEach(function (_0x4a0a4d, _0x538b86) {
    _0x1cf9b5.setInt32(4 * _0x538b86, _0x4a0a4d, !1);
  });
  for (var _0x1fd599 = 0; _0x1fd599 < 32;) {
    _0x52dec5 += (255 & _0x1cf9b5.getInt8(_0x1fd599) | 256).toString(16).substring(1, 3);
    _0x1fd599++;
  }
  return _0x52dec5;
}
function signUrl(_0x134c84) {
  var _0x502966 = _0x134c84.path,
    _0x359979 = _0x134c84.params,
    _0x2f4b67 = _0x359979,
    _0x2f825a = "9144085367";
  _0x2f4b67.appkey = _0x2f825a;
  _0x2f4b67.signTimestamp = Date.now();
  _0x2f4b67.timestamp = _0x2f4b67.signTimestamp;
  _0x2f4b67.nonce = Array.from({
    length: 8
  }).map(function () {
    return (65536 * (1 + Math.random()) | 0).toString(16).substring(1);
  }).join("");
  var _0x375307 = Object.keys(_0x2f4b67).map(_0xf7aed4 => _0xf7aed4 + "=" + _0x2f4b67[_0xf7aed4]);
  _0x2f4b67.digitalSign = function (_0xe29928, _0x3dcb6f) {
    var _0x581698,
      _0x28a02d = _0xe29928.replace("one-app/", "").replace("test/", "").replace(/^\//, "");
    if (Array.isArray(_0x3dcb6f)) {
      _0x3dcb6f.sort();
      var _0x5a71b9 = "".concat(_0x28a02d, "_").concat(_0x3dcb6f.join("_"), "_").concat("63fa8cd06dda34784713c1fdccf7e6bd"),
        _0x5e873b = encodeURIComponent(_0x5a71b9);
      _0x581698 = CryptoJS.MD5(_0x5e873b).toString(CryptoJS.enc.Hex);
    } else {
      console.error("signAlgorithm - queryArray 必须为数组！");
    }
    return _0x581698;
  }(_0x502966, _0x375307);
  return Object.keys(_0x2f4b67).map(_0x450c83 => _0x450c83 + "=" + _0x2f4b67[_0x450c83]).join("&");
  console.error("signAlgorithm - appkey 不存在！");
  return _0x2f4b67;
}
function sendPostRequest(_0x346fef, _0x4d7ff4, _0x221baa) {
  const _0x210838 = {
    "anonymous-id": "MINIAPPCOMMUNITY_",
    "Content-Type": "application/json",
    "x-namespace-code": "production",
    "x-microservice-name": "api-gateway",
    "x-mp-name": "COMMUNITY",
    Did: Did,
    Referer: "https://servicewechat.com/" + atob("d3g0ZjNiNjY0NWU3OWJkMDlk") + "/78/page-frame.html"
  };
  if (_0x346fef.indexOf("?") > -1) {
    _0x346fef += "&" + signUrl({
      path: _0x346fef,
      params: {}
    });
  } else {
    _0x346fef += "?" + signUrl({
      path: _0x346fef,
      params: {}
    });
  }
  const _0x1e6c02 = apiHost + _0x346fef;
  let _0x2f3070 = {};
  _0x4d7ff4 ? _0x2f3070 = {
    ..._0x210838,
    ...{
      Authorization: "Bearer " + _0x4d7ff4
    },
    ...{
      bodySign: oaSignFunc({
        url: _0x346fef,
        data: _0x221baa
      })
    }
  } : _0x2f3070 = {
    ..._0x210838
  };
  const _0x45c5a1 = axios.create({
    headers: _0x2f3070
  });
  return _0x45c5a1.post(_0x1e6c02, _0x221baa);
}
function sendGetRequest(_0xfbb59d, _0x10eaab) {
  const _0x400262 = {
    "anonymous-id": "MINIAPPCOMMUNITY_",
    "Content-Type": "application/json",
    "x-namespace-code": "production",
    "x-microservice-name": "api-gateway",
    "x-mp-name": "COMMUNITY",
    Did: Did,
    Referer: "https://servicewechat.com/" + atob("d3g0ZjNiNjY0NWU3OWJkMDlk") + "/78/page-frame.html"
  };
  _0xfbb59d.indexOf("?") > -1 ? _0xfbb59d += "&" + signUrl({
    path: _0xfbb59d,
    params: {}
  }) : _0xfbb59d += "?" + signUrl({
    path: _0xfbb59d,
    params: {}
  });
  const _0x3f2c51 = apiHost + _0xfbb59d,
    _0x47dd7d = {
      ..._0x400262,
      ...{
        Authorization: "Bearer " + _0x10eaab
      }
    },
    _0x13704f = axios.create({
      headers: _0x47dd7d
    });
  return _0x13704f.get(_0x3f2c51);
}
function logAndNotify(_0x45b5b2) {
  1;
  $.log(_0x45b5b2);
  notifyStr += _0x45b5b2;
  notifyStr += "\n";
}
function Env(_0x433ea7, _0x8309af) {
  "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0);
  class _0x9fb9c4 {
    constructor(_0x6e5ea2) {
      this.env = _0x6e5ea2;
    }
    send(_0x10845d, _0x389462 = "GET") {
      _0x10845d = "string" == typeof _0x10845d ? {
        url: _0x10845d
      } : _0x10845d;
      let _0x347a45 = this.get;
      "POST" === _0x389462 && (_0x347a45 = this.post);
      return new Promise((_0x3b1269, _0x291cac) => {
        _0x347a45.call(this, _0x10845d, (_0x99cc7f, _0x4bba3f, _0x45f1f2) => {
          _0x99cc7f ? _0x291cac(_0x99cc7f) : _0x3b1269(_0x4bba3f);
        });
      });
    }
    get(_0x8c2cb) {
      return this.send.call(this.env, _0x8c2cb);
    }
    post(_0x5405e7) {
      return this.send.call(this.env, _0x5405e7, "POST");
    }
  }
  return new class {
    constructor(_0x4bcdf7, _0xc1ad51) {
      this.name = _0x4bcdf7;
      this.http = new _0x9fb9c4(this);
      this.data = null;
      this.dataFile = "box.dat";
      this.logs = [];
      this.isMute = !1;
      this.isNeedRewrite = !1;
      this.logSeparator = "\n";
      this.startTime = new Date().getTime();
      Object.assign(this, _0xc1ad51);
      this.log("", "🔔" + this.name + ", 开始!");
    }
    isNode() {
      return "undefined" != typeof module && !!module.exports;
    }
    isQuanX() {
      return "undefined" != typeof $task;
    }
    isSurge() {
      return "undefined" != typeof $httpClient && "undefined" == typeof $loon;
    }
    isLoon() {
      return "undefined" != typeof $loon;
    }
    toObj(_0x34942d, _0x5775c3 = null) {
      try {
        return JSON.parse(_0x34942d);
      } catch {
        return _0x5775c3;
      }
    }
    toStr(_0x35f206, _0x400f7a = null) {
      try {
        return JSON.stringify(_0x35f206);
      } catch {
        return _0x400f7a;
      }
    }
    getjson(_0xc88ef0, _0xfc1d2a) {
      let _0x2cd1f4 = _0xfc1d2a;
      const _0x95f65 = this.getdata(_0xc88ef0);
      if (_0x95f65) {
        try {
          _0x2cd1f4 = JSON.parse(this.getdata(_0xc88ef0));
        } catch {}
      }
      return _0x2cd1f4;
    }
    setjson(_0x3e2719, _0x473c79) {
      try {
        return this.setdata(JSON.stringify(_0x3e2719), _0x473c79);
      } catch {
        return !1;
      }
    }
    getScript(_0xb8927d) {
      return new Promise(_0x21e9d4 => {
        this.get({
          url: _0xb8927d
        }, (_0x1ea2d3, _0x4c850c, _0x2ca289) => _0x21e9d4(_0x2ca289));
      });
    }
    runScript(_0x44d6a7, _0xe090cc) {
      return new Promise(_0x4ef42d => {
        let _0x138fff = this.getdata("@chavy_boxjs_userCfgs.httpapi");
        _0x138fff = _0x138fff ? _0x138fff.replace(/\n/g, "").trim() : _0x138fff;
        let _0x46469e = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
        _0x46469e = _0x46469e ? 1 * _0x46469e : 20;
        _0x46469e = _0xe090cc && _0xe090cc.timeout ? _0xe090cc.timeout : _0x46469e;
        const [_0xcb4935, _0x46ff74] = _0x138fff.split("@"),
          _0x3af401 = {
            url: "http://" + _0x46ff74 + "/v1/scripting/evaluate",
            body: {
              script_text: _0x44d6a7,
              mock_type: "cron",
              timeout: _0x46469e
            },
            headers: {
              "X-Key": _0xcb4935,
              Accept: "*/*"
            }
          };
        this.post(_0x3af401, (_0x390ae4, _0x334454, _0x4b41d9) => _0x4ef42d(_0x4b41d9));
      }).catch(_0x4f93a3 => this.logErr(_0x4f93a3));
    }
    loaddata() {
      if (!this.isNode()) {
        return {};
      }
      {
        this.fs = this.fs ? this.fs : require("fs");
        this.path = this.path ? this.path : require("path");
        const _0x51c175 = this.path.resolve(this.dataFile),
          _0x5a7ec2 = this.path.resolve(process.cwd(), this.dataFile),
          _0x9eae40 = this.fs.existsSync(_0x51c175),
          _0x107ca1 = !_0x9eae40 && this.fs.existsSync(_0x5a7ec2);
        if (!_0x9eae40 && !_0x107ca1) {
          return {};
        }
        {
          const _0x2fd29b = _0x9eae40 ? _0x51c175 : _0x5a7ec2;
          try {
            return JSON.parse(this.fs.readFileSync(_0x2fd29b));
          } catch (_0x53f222) {
            return {};
          }
        }
      }
    }
    writedata() {
      if (this.isNode()) {
        this.fs = this.fs ? this.fs : require("fs");
        this.path = this.path ? this.path : require("path");
        const _0x173f9a = this.path.resolve(this.dataFile),
          _0x487753 = this.path.resolve(process.cwd(), this.dataFile),
          _0x22ecfa = this.fs.existsSync(_0x173f9a),
          _0x511436 = !_0x22ecfa && this.fs.existsSync(_0x487753),
          _0x3bc768 = JSON.stringify(this.data);
        _0x22ecfa ? this.fs.writeFileSync(_0x173f9a, _0x3bc768) : _0x511436 ? this.fs.writeFileSync(_0x487753, _0x3bc768) : this.fs.writeFileSync(_0x173f9a, _0x3bc768);
      }
    }
    lodash_get(_0x5b6b03, _0x155abe, _0x4a044b) {
      const _0x73c84d = _0x155abe.replace(/\[(\d+)\]/g, ".$1").split(".");
      let _0x2a8905 = _0x5b6b03;
      for (const _0x5ce594 of _0x73c84d) if (_0x2a8905 = Object(_0x2a8905)[_0x5ce594], void 0 === _0x2a8905) {
        return _0x4a044b;
      }
      return _0x2a8905;
    }
    lodash_set(_0x36f311, _0x59997e, _0x2e3ab6) {
      return Object(_0x36f311) !== _0x36f311 ? _0x36f311 : (Array.isArray(_0x59997e) || (_0x59997e = _0x59997e.toString().match(/[^.[\]]+/g) || []), _0x59997e.slice(0, -1).reduce((_0x5c8341, _0x198afc, _0x49decf) => Object(_0x5c8341[_0x198afc]) === _0x5c8341[_0x198afc] ? _0x5c8341[_0x198afc] : _0x5c8341[_0x198afc] = Math.abs(_0x59997e[_0x49decf + 1]) >> 0 == +_0x59997e[_0x49decf + 1] ? [] : {}, _0x36f311)[_0x59997e[_0x59997e.length - 1]] = _0x2e3ab6, _0x36f311);
    }
    getdata(_0x22f6e9) {
      let _0x109e64 = this.getval(_0x22f6e9);
      if (/^@/.test(_0x22f6e9)) {
        const [, _0x5f4e38, _0x16e761] = /^@(.*?)\.(.*?)$/.exec(_0x22f6e9),
          _0x1e1cfc = _0x5f4e38 ? this.getval(_0x5f4e38) : "";
        if (_0x1e1cfc) {
          try {
            const _0xd4517a = JSON.parse(_0x1e1cfc);
            _0x109e64 = _0xd4517a ? this.lodash_get(_0xd4517a, _0x16e761, "") : _0x109e64;
          } catch (_0x3a355f) {
            _0x109e64 = "";
          }
        }
      }
      return _0x109e64;
    }
    setdata(_0x1f93d5, _0x167c16) {
      let _0x42276f = !1;
      if (/^@/.test(_0x167c16)) {
        const [, _0x80b5d4, _0x31899a] = /^@(.*?)\.(.*?)$/.exec(_0x167c16),
          _0x4e8088 = this.getval(_0x80b5d4),
          _0x4f98cb = _0x80b5d4 ? "null" === _0x4e8088 ? null : _0x4e8088 || "{}" : "{}";
        try {
          const _0x20c2a9 = JSON.parse(_0x4f98cb);
          this.lodash_set(_0x20c2a9, _0x31899a, _0x1f93d5);
          _0x42276f = this.setval(JSON.stringify(_0x20c2a9), _0x80b5d4);
        } catch (_0x1a8824) {
          const _0x4522c9 = {};
          this.lodash_set(_0x4522c9, _0x31899a, _0x1f93d5);
          _0x42276f = this.setval(JSON.stringify(_0x4522c9), _0x80b5d4);
        }
      } else {
        _0x42276f = this.setval(_0x1f93d5, _0x167c16);
      }
      return _0x42276f;
    }
    getval(_0x19759c) {
      return this.isSurge() || this.isLoon() ? $persistentStore.read(_0x19759c) : this.isQuanX() ? $prefs.valueForKey(_0x19759c) : this.isNode() ? (this.data = this.loaddata(), this.data[_0x19759c]) : this.data && this.data[_0x19759c] || null;
    }
    setval(_0xcd1a0, _0xab89ce) {
      return this.isSurge() || this.isLoon() ? $persistentStore.write(_0xcd1a0, _0xab89ce) : this.isQuanX() ? $prefs.setValueForKey(_0xcd1a0, _0xab89ce) : this.isNode() ? (this.data = this.loaddata(), this.data[_0xab89ce] = _0xcd1a0, this.writedata(), !0) : this.data && this.data[_0xab89ce] || null;
    }
    initGotEnv(_0x42de4e) {
      this.got = this.got ? this.got : require("got");
      this.cktough = this.cktough ? this.cktough : require("tough-cookie");
      this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar();
      _0x42de4e && (_0x42de4e.headers = _0x42de4e.headers ? _0x42de4e.headers : {}, void 0 === _0x42de4e.headers.Cookie && void 0 === _0x42de4e.cookieJar && (_0x42de4e.cookieJar = this.ckjar));
    }
    get(_0x2fe72f, _0x323494 = () => {}) {
      _0x2fe72f.headers && (delete _0x2fe72f.headers["Content-Type"], delete _0x2fe72f.headers["Content-Length"]);
      this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (_0x2fe72f.headers = _0x2fe72f.headers || {}, Object.assign(_0x2fe72f.headers, {
        "X-Surge-Skip-Scripting": !1
      })), $httpClient.get(_0x2fe72f, (_0x4176b0, _0x207ed5, _0x2bd200) => {
        !_0x4176b0 && _0x207ed5 && (_0x207ed5.body = _0x2bd200, _0x207ed5.statusCode = _0x207ed5.status);
        _0x323494(_0x4176b0, _0x207ed5, _0x2bd200);
      })) : this.isQuanX() ? (this.isNeedRewrite && (_0x2fe72f.opts = _0x2fe72f.opts || {}, Object.assign(_0x2fe72f.opts, {
        hints: !1
      })), $task.fetch(_0x2fe72f).then(_0x4c5ccc => {
        const {
          statusCode: _0x9e186a,
          statusCode: _0x5868cc,
          headers: _0x46736a,
          body: _0x29f8dc
        } = _0x4c5ccc;
        _0x323494(null, {
          status: _0x9e186a,
          statusCode: _0x5868cc,
          headers: _0x46736a,
          body: _0x29f8dc
        }, _0x29f8dc);
      }, _0x3a5e1 => _0x323494(_0x3a5e1))) : this.isNode() && (this.initGotEnv(_0x2fe72f), this.got(_0x2fe72f).on("redirect", (_0x45ba1e, _0x362cd6) => {
        try {
          if (_0x45ba1e.headers["set-cookie"]) {
            const _0x35f5b5 = _0x45ba1e.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
            _0x35f5b5 && this.ckjar.setCookieSync(_0x35f5b5, null);
            _0x362cd6.cookieJar = this.ckjar;
          }
        } catch (_0x32543c) {
          this.logErr(_0x32543c);
        }
      }).then(_0x5f2b38 => {
        const {
          statusCode: _0x22e9c6,
          statusCode: _0x4818b4,
          headers: _0x27ce8a,
          body: _0x41c21b
        } = _0x5f2b38;
        _0x323494(null, {
          status: _0x22e9c6,
          statusCode: _0x4818b4,
          headers: _0x27ce8a,
          body: _0x41c21b
        }, _0x41c21b);
      }, _0x199492 => {
        const {
          message: _0x3419d2,
          response: _0x1651f9
        } = _0x199492;
        _0x323494(_0x3419d2, _0x1651f9, _0x1651f9 && _0x1651f9.body);
      }));
    }
    post(_0x2b836b, _0x580a27 = () => {}) {
      if (_0x2b836b.body && _0x2b836b.headers && !_0x2b836b.headers["Content-Type"] && (_0x2b836b.headers["Content-Type"] = "application/x-www-form-urlencoded"), _0x2b836b.headers && delete _0x2b836b.headers["Content-Length"], this.isSurge() || this.isLoon()) {
        this.isSurge() && this.isNeedRewrite && (_0x2b836b.headers = _0x2b836b.headers || {}, Object.assign(_0x2b836b.headers, {
          "X-Surge-Skip-Scripting": !1
        }));
        $httpClient.post(_0x2b836b, (_0x39649f, _0xaa8ab5, _0x320450) => {
          !_0x39649f && _0xaa8ab5 && (_0xaa8ab5.body = _0x320450, _0xaa8ab5.statusCode = _0xaa8ab5.status);
          _0x580a27(_0x39649f, _0xaa8ab5, _0x320450);
        });
      } else {
        if (this.isQuanX()) {
          _0x2b836b.method = "POST";
          this.isNeedRewrite && (_0x2b836b.opts = _0x2b836b.opts || {}, Object.assign(_0x2b836b.opts, {
            hints: !1
          }));
          $task.fetch(_0x2b836b).then(_0x1bd18b => {
            const {
              statusCode: _0x71cd67,
              statusCode: _0xa9178a,
              headers: _0x14f125,
              body: _0x22a8ec
            } = _0x1bd18b;
            _0x580a27(null, {
              status: _0x71cd67,
              statusCode: _0xa9178a,
              headers: _0x14f125,
              body: _0x22a8ec
            }, _0x22a8ec);
          }, _0x47a50b => _0x580a27(_0x47a50b));
        } else {
          if (this.isNode()) {
            this.initGotEnv(_0x2b836b);
            const {
              url: _0x515d08,
              ..._0x5863ba
            } = _0x2b836b;
            this.got.post(_0x515d08, _0x5863ba).then(_0x47023d => {
              const {
                statusCode: _0x18b1de,
                statusCode: _0x57856d,
                headers: _0x2b00fb,
                body: _0x4ef10a
              } = _0x47023d;
              _0x580a27(null, {
                status: _0x18b1de,
                statusCode: _0x57856d,
                headers: _0x2b00fb,
                body: _0x4ef10a
              }, _0x4ef10a);
            }, _0x11c0f => {
              const {
                message: _0x5d7882,
                response: _0x5747f5
              } = _0x11c0f;
              _0x580a27(_0x5d7882, _0x5747f5, _0x5747f5 && _0x5747f5.body);
            });
          }
        }
      }
    }
    time(_0x29b1ed, _0x5b29cf = null) {
      const _0x55f4e8 = _0x5b29cf ? new Date(_0x5b29cf) : new Date();
      let _0x1e0777 = {
        "M+": _0x55f4e8.getMonth() + 1,
        "d+": _0x55f4e8.getDate(),
        "H+": _0x55f4e8.getHours(),
        "m+": _0x55f4e8.getMinutes(),
        "s+": _0x55f4e8.getSeconds(),
        "q+": Math.floor((_0x55f4e8.getMonth() + 3) / 3),
        S: _0x55f4e8.getMilliseconds()
      };
      /(y+)/.test(_0x29b1ed) && (_0x29b1ed = _0x29b1ed.replace(RegExp.$1, (_0x55f4e8.getFullYear() + "").substr(4 - RegExp.$1.length)));
      for (let _0x475268 in _0x1e0777) new RegExp("(" + _0x475268 + ")").test(_0x29b1ed) && (_0x29b1ed = _0x29b1ed.replace(RegExp.$1, 1 == RegExp.$1.length ? _0x1e0777[_0x475268] : ("00" + _0x1e0777[_0x475268]).substr(("" + _0x1e0777[_0x475268]).length)));
      return _0x29b1ed;
    }
    msg(_0x240ac2 = _0x433ea7, _0x148fd5 = "", _0x2967a9 = "", _0x1fd2a9) {
      const _0x2ac9c1 = _0x1fcabd => {
        if (!_0x1fcabd) {
          return _0x1fcabd;
        }
        if ("string" == typeof _0x1fcabd) {
          return this.isLoon() ? _0x1fcabd : this.isQuanX() ? {
            "open-url": _0x1fcabd
          } : this.isSurge() ? {
            url: _0x1fcabd
          } : void 0;
        }
        if ("object" == typeof _0x1fcabd) {
          if (this.isLoon()) {
            let _0x26f116 = _0x1fcabd.openUrl || _0x1fcabd.url || _0x1fcabd["open-url"],
              _0x496bcb = _0x1fcabd.mediaUrl || _0x1fcabd["media-url"];
            return {
              openUrl: _0x26f116,
              mediaUrl: _0x496bcb
            };
          }
          if (this.isQuanX()) {
            let _0x27b16b = _0x1fcabd["open-url"] || _0x1fcabd.url || _0x1fcabd.openUrl,
              _0x1ce765 = _0x1fcabd["media-url"] || _0x1fcabd.mediaUrl;
            return {
              "open-url": _0x27b16b,
              "media-url": _0x1ce765
            };
          }
          if (this.isSurge()) {
            let _0x33c413 = _0x1fcabd.url || _0x1fcabd.openUrl || _0x1fcabd["open-url"];
            return {
              url: _0x33c413
            };
          }
        }
      };
      if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(_0x240ac2, _0x148fd5, _0x2967a9, _0x2ac9c1(_0x1fd2a9)) : this.isQuanX() && $notify(_0x240ac2, _0x148fd5, _0x2967a9, _0x2ac9c1(_0x1fd2a9))), !this.isMuteLog) {
        let _0x3db4c1 = ["", "==============📣系统通知📣=============="];
        _0x3db4c1.push(_0x240ac2);
        _0x148fd5 && _0x3db4c1.push(_0x148fd5);
        _0x2967a9 && _0x3db4c1.push(_0x2967a9);
        console.log(_0x3db4c1.join("\n"));
        this.logs = this.logs.concat(_0x3db4c1);
      }
    }
    log(..._0x14a7d5) {
      _0x14a7d5.length > 0 && (this.logs = [...this.logs, ..._0x14a7d5]);
      console.log(_0x14a7d5.join(this.logSeparator));
    }
    logErr(_0x6792cb, _0x17b95e) {
      const _0x24af02 = !this.isSurge() && !this.isQuanX() && !this.isLoon();
      _0x24af02 ? this.log("", "❗️" + this.name + ", 错误!", _0x6792cb.stack) : this.log("", "❗️" + this.name + ", 错误!", _0x6792cb);
    }
    wait(_0x3e5150) {
      return new Promise(_0x54ae7c => setTimeout(_0x54ae7c, _0x3e5150));
    }
    done(_0x14f9d0 = {}) {
      const _0x2c24db = new Date().getTime(),
        _0xefb9ad = (_0x2c24db - this.startTime) / 1000;
      this.log("", "🔔" + this.name + ", 结束! 🕛 " + _0xefb9ad + " 秒");
      this.log();
      (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(_0x14f9d0);
    }
  }(_0x433ea7, _0x8309af);
}