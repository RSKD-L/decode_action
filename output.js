//Fri Aug 02 2024 01:51:20 GMT+0000 (Coordinated Universal Time)
//Base:https://github.com/echo094/decode-js
//Modify:https://github.com/smallfawn/decode_action
const $ = new Env("一汽大众"),
  CryptoJS = require("crypto-js"),
  axios = require("axios"),
  {
    sendNotify
  } = require("./sendNotify"),
  cache = require("./cache");
let notifyStr = "";
const Did = process.env.yqdz_Did,
  apiHost = "https://one-app-h5.faw-vw.com/prod-api/mobile/one-app",
  appHost = "https://oneapp-api.faw-vw.com";
(async () => {
  const _0x552527 = process.env.yqdz_accounts;
  if (!Did || !_0x552527) {
    logAndNotify("yqdz_Did或yqdz_accounts不存在");
    return;
  }
  cache.initializeCache();
  let _0x422c91 = _0x552527.split("\n");
  for (let _0x4f0492 = 0; _0x4f0492 < _0x422c91.length; _0x4f0492++) {
    const _0x4b04ef = _0x422c91[_0x4f0492].split("#")[0],
      _0x3d09ce = _0x422c91[_0x4f0492].split("#")[1];
    let _0x468639 = cache.readCache(_0x4b04ef);
    if (!_0x468639) {
      const _0x31d110 = await sendPostRequest(apiHost, "/user/public/v1/login", undefined, {
        account: "" + _0x4b04ef,
        password: "" + _0x3d09ce,
        scope: "openid profile mbb"
      });
      if (_0x31d110.data.returnStatus !== "SUCCEED") {
        logAndNotify("账号【" + (_0x4f0492 + 1) + "】 【" + _0x4b04ef + "】登录失败");
        continue;
      }
      logAndNotify("账号【" + (_0x4f0492 + 1) + "】 【" + _0x4b04ef + "】登录成功");
      _0x468639 = _0x31d110.data.data.tokenInfo;
      cache.addCache(_0x4b04ef, _0x468639);
    } else {
      logAndNotify("账号【" + (_0x4f0492 + 1) + "】 【" + _0x4b04ef + "】从缓存中读取用户信息");
    }
    const _0x61f6fc = await sendPostRequest(apiHost, "/general/public/v1/member/get_miniapp_score", _0x468639.accessToken, {
      systemKey: "8F7EC8DCAEE74A2FA1",
      tenantId: "VW",
      businessId: 1,
      businessTypeId: 1,
      scoreTypeId: 2
    });
    if (_0x61f6fc.data.returnStatus !== "SUCCEED") {
      logAndNotify("账号【" + (_0x4f0492 + 1) + "】 【" + _0x4b04ef + "】缓存失效 重新登录");
      const _0x5dc42a = await sendPostRequest(apiHost, "/user/public/v1/login", undefined, {
        account: "" + _0x4b04ef,
        password: "" + _0x3d09ce,
        scope: "openid profile mbb"
      });
      if (_0x5dc42a.data.returnStatus !== "SUCCEED") {
        logAndNotify("账号【" + (_0x4f0492 + 1) + "】 【" + _0x4b04ef + "】登录失败");
        continue;
      }
      logAndNotify("账号【" + (_0x4f0492 + 1) + "】 【" + _0x4b04ef + "】登录成功");
      _0x468639 = _0x5dc42a.data.data.tokenInfo;
      cache.addCache(_0x4b04ef, _0x468639);
    }
    const _0x5d5d4c = await sendGetRequest(apiHost, "/general/public/v1/mall/integral/get_days_sign", _0x468639.accessToken);
    if (_0x5d5d4c.data.returnStatus !== "SUCCEED") {
      logAndNotify("账号【" + (_0x4f0492 + 1) + "】 【" + _0x4b04ef + "】签到失败");
      continue;
    }
    logAndNotify("账号【" + (_0x4f0492 + 1) + "】 【" + _0x4b04ef + "】签到成功 累计签到【" + _0x5d5d4c.data.data.totaldays + "】天 积分【" + _0x5d5d4c.data.data.availablescore + "】");
    const _0x446b65 = await sendGetRequest(appHost, "/profile/lottery/able/v1", _0x468639.accessToken);
    if (_0x446b65.data.returnStatus !== "SUCCEED") {
      logAndNotify("账号【" + (_0x4f0492 + 1) + "】 【" + _0x4b04ef + "】查询盲盒状态出错");
    } else {
      if (!_0x446b65.data.data.able) {
        logAndNotify("账号【" + (_0x4f0492 + 1) + "】 【" + _0x4b04ef + "】还不到开盲盒的时候");
      } else {
        logAndNotify("账号【" + (_0x4f0492 + 1) + "】 【" + _0x4b04ef + "】可以开盲盒了 手动去app开");
      }
    }
  }
})().catch(_0x26be49 => {
  logAndNotify(_0x26be49);
}).finally(() => {
  sendNotify("一汽大众", notifyStr);
  $.done();
});
function oaSignFunc(_0x476168) {
  var _0x8c2096 = _0x476168.url,
    _0x95c1a = _0x476168.data,
    _0x2e50b2 = "",
    _0x2cdb62 = {};
  _0x8c2096.split("?")[1] && _0x8c2096.split("?")[1].split("&").forEach(function (_0x37b1ac) {
    var _0x46f301 = _0x37b1ac.split("=");
    _0x2cdb62[_0x46f301[0]] = decodeURIComponent(_0x46f301[1]);
  });
  var _0xbcab04 = _0x2cdb62.signTimestamp,
    _0x5cb1bc = _0x2cdb62.nonce,
    _0x2c2978 = btoa(unescape(encodeURIComponent(JSON.stringify(_0x95c1a)))) + _0x5cb1bc + _0xbcab04,
    _0x34d497 = CryptoJS.HmacSHA256(_0x2c2978, atob("NjNmYThjZDA2ZGRhMzQ3ODQ3MTNjMWZkY2NmN2U2YmQ=")).words,
    _0x27c2b8 = new ArrayBuffer(32),
    _0x490aa5 = new DataView(_0x27c2b8);
  _0x34d497.forEach(function (_0x4a8887, _0xb0fbc0) {
    _0x490aa5.setInt32(4 * _0xb0fbc0, _0x4a8887, !1);
  });
  for (var _0x511330 = 0; _0x511330 < 32;) {
    _0x2e50b2 += (255 & _0x490aa5.getInt8(_0x511330) | 256).toString(16).substring(1, 3);
    _0x511330++;
  }
  return _0x2e50b2;
}
function signUrl(_0x21d1cc) {
  var _0x563255 = _0x21d1cc.path,
    _0xda79c8 = _0x21d1cc.params,
    _0x31c5cf = _0xda79c8,
    _0x4265d7 = "9144085367";
  _0x31c5cf.appkey = _0x4265d7;
  _0x31c5cf.signTimestamp = Date.now();
  _0x31c5cf.timestamp = _0x31c5cf.signTimestamp;
  _0x31c5cf.nonce = Array.from({
    length: 8
  }).map(function () {
    return (65536 * (1 + Math.random()) | 0).toString(16).substring(1);
  }).join("");
  var _0x53a8a9 = Object.keys(_0x31c5cf).map(_0xd3396d => _0xd3396d + "=" + _0x31c5cf[_0xd3396d]);
  _0x31c5cf.digitalSign = function (_0x21ccd6, _0x43b84f) {
    var _0x47ad2f,
      _0x27aa53 = _0x21ccd6.replace("one-app/", "").replace("test/", "").replace(/^\//, "");
    if (Array.isArray(_0x43b84f)) {
      _0x43b84f.sort();
      var _0x388a96 = "".concat(_0x27aa53, "_").concat(_0x43b84f.join("_"), "_").concat("63fa8cd06dda34784713c1fdccf7e6bd"),
        _0x885cb0 = encodeURIComponent(_0x388a96);
      _0x47ad2f = CryptoJS.MD5(_0x885cb0).toString(CryptoJS.enc.Hex);
    } else {
      console.error("signAlgorithm - queryArray 必须为数组！");
    }
    return _0x47ad2f;
  }(_0x563255, _0x53a8a9);
  return Object.keys(_0x31c5cf).map(_0xe2cf97 => _0xe2cf97 + "=" + _0x31c5cf[_0xe2cf97]).join("&");
  console.error("signAlgorithm - appkey 不存在！");
  return _0x31c5cf;
}
function sendPostRequest(_0x53428d, _0x3e7471, _0x322d5d, _0x8e2900) {
  const _0x488ca9 = {
    "anonymous-id": "MINIAPPCOMMUNITY_",
    "Content-Type": "application/json",
    "x-namespace-code": "production",
    "x-microservice-name": "api-gateway",
    "x-mp-name": "COMMUNITY",
    Did: Did,
    Referer: "https://servicewechat.com/" + atob("d3g0ZjNiNjY0NWU3OWJkMDlk") + "/78/page-frame.html",
    entry: "vwapp"
  };
  if (_0x3e7471.indexOf("?") > -1) {
    _0x3e7471 += "&" + signUrl({
      path: _0x3e7471,
      params: {}
    });
  } else {
    _0x3e7471 += "?" + signUrl({
      path: _0x3e7471,
      params: {}
    });
  }
  const _0x15fb1d = _0x53428d + _0x3e7471;
  let _0x288049 = {};
  if (_0x322d5d) {
    _0x288049 = {
      ..._0x488ca9,
      ...{
        Authorization: "Bearer " + _0x322d5d
      },
      ...{
        bodySign: oaSignFunc({
          url: _0x3e7471,
          data: _0x8e2900
        })
      }
    };
  } else {
    _0x288049 = {
      ..._0x488ca9
    };
  }
  const _0x2bcbe6 = axios.create({
    headers: _0x288049
  });
  return _0x2bcbe6.post(_0x15fb1d, _0x8e2900);
}
function sendGetRequest(_0x4f308e, _0x4c1f96, _0x11bf7a) {
  const _0x4fc412 = {
    "anonymous-id": "MINIAPPCOMMUNITY_",
    "Content-Type": "application/json",
    "x-namespace-code": "production",
    "x-microservice-name": "api-gateway",
    "x-mp-name": "COMMUNITY",
    Did: Did,
    Referer: "https://servicewechat.com/" + atob("d3g0ZjNiNjY0NWU3OWJkMDlk") + "/78/page-frame.html",
    entry: "vwapp"
  };
  _0x4c1f96.indexOf("?") > -1 ? _0x4c1f96 += "&" + signUrl({
    path: _0x4c1f96,
    params: {}
  }) : _0x4c1f96 += "?" + signUrl({
    path: _0x4c1f96,
    params: {}
  });
  const _0x2ba0de = _0x4f308e + _0x4c1f96;
  let _0x8ce5b8 = {};
  _0x11bf7a ? _0x8ce5b8 = {
    ..._0x4fc412,
    ...{
      Authorization: "Bearer " + _0x11bf7a
    },
    ...{
      bodySign: oaSignFunc({
        url: _0x4c1f96,
        data: {}
      })
    }
  } : _0x8ce5b8 = {
    ..._0x4fc412
  };
  const _0x3b79a8 = axios.create({
    headers: _0x8ce5b8
  });
  return _0x3b79a8.get(_0x2ba0de);
}
function logAndNotify(_0x3466a3) {
  1;
  $.log(_0x3466a3);
  notifyStr += _0x3466a3;
  notifyStr += "\n";
}
function Env(_0x446f07, _0x52018a) {
  "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0);
  class _0x4da4d6 {
    constructor(_0x4fd5f5) {
      this.env = _0x4fd5f5;
    }
    send(_0x1a0375, _0x616833 = "GET") {
      _0x1a0375 = "string" == typeof _0x1a0375 ? {
        url: _0x1a0375
      } : _0x1a0375;
      let _0x485d00 = this.get;
      "POST" === _0x616833 && (_0x485d00 = this.post);
      return new Promise((_0x3c0321, _0xe443b) => {
        _0x485d00.call(this, _0x1a0375, (_0x112ff3, _0x4bb195, _0xf5f0b) => {
          _0x112ff3 ? _0xe443b(_0x112ff3) : _0x3c0321(_0x4bb195);
        });
      });
    }
    get(_0x4fea55) {
      return this.send.call(this.env, _0x4fea55);
    }
    post(_0x45f29b) {
      return this.send.call(this.env, _0x45f29b, "POST");
    }
  }
  return new class {
    constructor(_0x23982b, _0x5b8f0b) {
      this.name = _0x23982b;
      this.http = new _0x4da4d6(this);
      this.data = null;
      this.dataFile = "box.dat";
      this.logs = [];
      this.isMute = !1;
      this.isNeedRewrite = !1;
      this.logSeparator = "\n";
      this.startTime = new Date().getTime();
      Object.assign(this, _0x5b8f0b);
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
    toObj(_0x815172, _0x2af43e = null) {
      try {
        return JSON.parse(_0x815172);
      } catch {
        return _0x2af43e;
      }
    }
    toStr(_0x36ea74, _0x2f657d = null) {
      try {
        return JSON.stringify(_0x36ea74);
      } catch {
        return _0x2f657d;
      }
    }
    getjson(_0x2eb146, _0x346755) {
      let _0x458439 = _0x346755;
      const _0x5b15c5 = this.getdata(_0x2eb146);
      if (_0x5b15c5) {
        try {
          _0x458439 = JSON.parse(this.getdata(_0x2eb146));
        } catch {}
      }
      return _0x458439;
    }
    setjson(_0x1f36c2, _0xd8502a) {
      try {
        return this.setdata(JSON.stringify(_0x1f36c2), _0xd8502a);
      } catch {
        return !1;
      }
    }
    getScript(_0x4a64de) {
      return new Promise(_0x277d98 => {
        this.get({
          url: _0x4a64de
        }, (_0x212e3e, _0x383e1e, _0x43997a) => _0x277d98(_0x43997a));
      });
    }
    runScript(_0x292777, _0x290f33) {
      return new Promise(_0x48d612 => {
        let _0x182c40 = this.getdata("@chavy_boxjs_userCfgs.httpapi");
        _0x182c40 = _0x182c40 ? _0x182c40.replace(/\n/g, "").trim() : _0x182c40;
        let _0x10deb1 = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
        _0x10deb1 = _0x10deb1 ? 1 * _0x10deb1 : 20;
        _0x10deb1 = _0x290f33 && _0x290f33.timeout ? _0x290f33.timeout : _0x10deb1;
        const [_0x21c687, _0x1effb3] = _0x182c40.split("@"),
          _0x37a5ac = {
            url: "http://" + _0x1effb3 + "/v1/scripting/evaluate",
            body: {
              script_text: _0x292777,
              mock_type: "cron",
              timeout: _0x10deb1
            },
            headers: {
              "X-Key": _0x21c687,
              Accept: "*/*"
            }
          };
        this.post(_0x37a5ac, (_0xfdd0c6, _0x551c77, _0x500e78) => _0x48d612(_0x500e78));
      }).catch(_0x144bb3 => this.logErr(_0x144bb3));
    }
    loaddata() {
      if (!this.isNode()) {
        return {};
      }
      {
        this.fs = this.fs ? this.fs : require("fs");
        this.path = this.path ? this.path : require("path");
        const _0x270e17 = this.path.resolve(this.dataFile),
          _0x2427ec = this.path.resolve(process.cwd(), this.dataFile),
          _0x2a2ab9 = this.fs.existsSync(_0x270e17),
          _0x35824f = !_0x2a2ab9 && this.fs.existsSync(_0x2427ec);
        if (!_0x2a2ab9 && !_0x35824f) {
          return {};
        }
        {
          const _0x4914d7 = _0x2a2ab9 ? _0x270e17 : _0x2427ec;
          try {
            return JSON.parse(this.fs.readFileSync(_0x4914d7));
          } catch (_0x24fd9f) {
            return {};
          }
        }
      }
    }
    writedata() {
      if (this.isNode()) {
        this.fs = this.fs ? this.fs : require("fs");
        this.path = this.path ? this.path : require("path");
        const _0x36f1f3 = this.path.resolve(this.dataFile),
          _0x1193d7 = this.path.resolve(process.cwd(), this.dataFile),
          _0x5df188 = this.fs.existsSync(_0x36f1f3),
          _0x10f576 = !_0x5df188 && this.fs.existsSync(_0x1193d7),
          _0xf4c1e2 = JSON.stringify(this.data);
        _0x5df188 ? this.fs.writeFileSync(_0x36f1f3, _0xf4c1e2) : _0x10f576 ? this.fs.writeFileSync(_0x1193d7, _0xf4c1e2) : this.fs.writeFileSync(_0x36f1f3, _0xf4c1e2);
      }
    }
    lodash_get(_0x10b71b, _0x55e582, _0x4cb41a) {
      const _0x395eb7 = _0x55e582.replace(/\[(\d+)\]/g, ".$1").split(".");
      let _0x3bfe5e = _0x10b71b;
      for (const _0x47ea7f of _0x395eb7) if (_0x3bfe5e = Object(_0x3bfe5e)[_0x47ea7f], void 0 === _0x3bfe5e) {
        return _0x4cb41a;
      }
      return _0x3bfe5e;
    }
    lodash_set(_0xebb086, _0xf19c4c, _0x1f069c) {
      return Object(_0xebb086) !== _0xebb086 ? _0xebb086 : (Array.isArray(_0xf19c4c) || (_0xf19c4c = _0xf19c4c.toString().match(/[^.[\]]+/g) || []), _0xf19c4c.slice(0, -1).reduce((_0x197716, _0x4d7026, _0xa02f2f) => Object(_0x197716[_0x4d7026]) === _0x197716[_0x4d7026] ? _0x197716[_0x4d7026] : _0x197716[_0x4d7026] = Math.abs(_0xf19c4c[_0xa02f2f + 1]) >> 0 == +_0xf19c4c[_0xa02f2f + 1] ? [] : {}, _0xebb086)[_0xf19c4c[_0xf19c4c.length - 1]] = _0x1f069c, _0xebb086);
    }
    getdata(_0x143bbb) {
      let _0x805172 = this.getval(_0x143bbb);
      if (/^@/.test(_0x143bbb)) {
        const [, _0x493953, _0x512617] = /^@(.*?)\.(.*?)$/.exec(_0x143bbb),
          _0x25b761 = _0x493953 ? this.getval(_0x493953) : "";
        if (_0x25b761) {
          try {
            const _0x340677 = JSON.parse(_0x25b761);
            _0x805172 = _0x340677 ? this.lodash_get(_0x340677, _0x512617, "") : _0x805172;
          } catch (_0x5c6a32) {
            _0x805172 = "";
          }
        }
      }
      return _0x805172;
    }
    setdata(_0x35a8f4, _0x181f59) {
      let _0x2cb042 = !1;
      if (/^@/.test(_0x181f59)) {
        const [, _0x2e65bf, _0x523c88] = /^@(.*?)\.(.*?)$/.exec(_0x181f59),
          _0x49043d = this.getval(_0x2e65bf),
          _0x35be9c = _0x2e65bf ? "null" === _0x49043d ? null : _0x49043d || "{}" : "{}";
        try {
          const _0x371cac = JSON.parse(_0x35be9c);
          this.lodash_set(_0x371cac, _0x523c88, _0x35a8f4);
          _0x2cb042 = this.setval(JSON.stringify(_0x371cac), _0x2e65bf);
        } catch (_0x55d52c) {
          const _0x12b2ea = {};
          this.lodash_set(_0x12b2ea, _0x523c88, _0x35a8f4);
          _0x2cb042 = this.setval(JSON.stringify(_0x12b2ea), _0x2e65bf);
        }
      } else {
        _0x2cb042 = this.setval(_0x35a8f4, _0x181f59);
      }
      return _0x2cb042;
    }
    getval(_0x18215a) {
      return this.isSurge() || this.isLoon() ? $persistentStore.read(_0x18215a) : this.isQuanX() ? $prefs.valueForKey(_0x18215a) : this.isNode() ? (this.data = this.loaddata(), this.data[_0x18215a]) : this.data && this.data[_0x18215a] || null;
    }
    setval(_0xa8f64d, _0x5d9a85) {
      return this.isSurge() || this.isLoon() ? $persistentStore.write(_0xa8f64d, _0x5d9a85) : this.isQuanX() ? $prefs.setValueForKey(_0xa8f64d, _0x5d9a85) : this.isNode() ? (this.data = this.loaddata(), this.data[_0x5d9a85] = _0xa8f64d, this.writedata(), !0) : this.data && this.data[_0x5d9a85] || null;
    }
    initGotEnv(_0x1109f5) {
      this.got = this.got ? this.got : require("got");
      this.cktough = this.cktough ? this.cktough : require("tough-cookie");
      this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar();
      _0x1109f5 && (_0x1109f5.headers = _0x1109f5.headers ? _0x1109f5.headers : {}, void 0 === _0x1109f5.headers.Cookie && void 0 === _0x1109f5.cookieJar && (_0x1109f5.cookieJar = this.ckjar));
    }
    get(_0x26ac60, _0x3718bb = () => {}) {
      _0x26ac60.headers && (delete _0x26ac60.headers["Content-Type"], delete _0x26ac60.headers["Content-Length"]);
      this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (_0x26ac60.headers = _0x26ac60.headers || {}, Object.assign(_0x26ac60.headers, {
        "X-Surge-Skip-Scripting": !1
      })), $httpClient.get(_0x26ac60, (_0x3a7022, _0x479f30, _0x7d20d8) => {
        !_0x3a7022 && _0x479f30 && (_0x479f30.body = _0x7d20d8, _0x479f30.statusCode = _0x479f30.status);
        _0x3718bb(_0x3a7022, _0x479f30, _0x7d20d8);
      })) : this.isQuanX() ? (this.isNeedRewrite && (_0x26ac60.opts = _0x26ac60.opts || {}, Object.assign(_0x26ac60.opts, {
        hints: !1
      })), $task.fetch(_0x26ac60).then(_0x251e39 => {
        const {
          statusCode: _0xfc4bf8,
          statusCode: _0x55b773,
          headers: _0xf3e80c,
          body: _0x14cb99
        } = _0x251e39;
        _0x3718bb(null, {
          status: _0xfc4bf8,
          statusCode: _0x55b773,
          headers: _0xf3e80c,
          body: _0x14cb99
        }, _0x14cb99);
      }, _0x31ec3f => _0x3718bb(_0x31ec3f))) : this.isNode() && (this.initGotEnv(_0x26ac60), this.got(_0x26ac60).on("redirect", (_0x7a330b, _0x14d840) => {
        try {
          if (_0x7a330b.headers["set-cookie"]) {
            const _0x5b4f58 = _0x7a330b.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
            _0x5b4f58 && this.ckjar.setCookieSync(_0x5b4f58, null);
            _0x14d840.cookieJar = this.ckjar;
          }
        } catch (_0x2066aa) {
          this.logErr(_0x2066aa);
        }
      }).then(_0x2b421 => {
        const {
          statusCode: _0x2f5dfc,
          statusCode: _0x48e975,
          headers: _0x30c112,
          body: _0x5a8f7a
        } = _0x2b421;
        _0x3718bb(null, {
          status: _0x2f5dfc,
          statusCode: _0x48e975,
          headers: _0x30c112,
          body: _0x5a8f7a
        }, _0x5a8f7a);
      }, _0x113147 => {
        const {
          message: _0x561123,
          response: _0x360de6
        } = _0x113147;
        _0x3718bb(_0x561123, _0x360de6, _0x360de6 && _0x360de6.body);
      }));
    }
    post(_0x361e54, _0x5388e8 = () => {}) {
      if (_0x361e54.body && _0x361e54.headers && !_0x361e54.headers["Content-Type"] && (_0x361e54.headers["Content-Type"] = "application/x-www-form-urlencoded"), _0x361e54.headers && delete _0x361e54.headers["Content-Length"], this.isSurge() || this.isLoon()) {
        this.isSurge() && this.isNeedRewrite && (_0x361e54.headers = _0x361e54.headers || {}, Object.assign(_0x361e54.headers, {
          "X-Surge-Skip-Scripting": !1
        }));
        $httpClient.post(_0x361e54, (_0x137498, _0x41ab59, _0x44719c) => {
          !_0x137498 && _0x41ab59 && (_0x41ab59.body = _0x44719c, _0x41ab59.statusCode = _0x41ab59.status);
          _0x5388e8(_0x137498, _0x41ab59, _0x44719c);
        });
      } else {
        if (this.isQuanX()) {
          _0x361e54.method = "POST";
          this.isNeedRewrite && (_0x361e54.opts = _0x361e54.opts || {}, Object.assign(_0x361e54.opts, {
            hints: !1
          }));
          $task.fetch(_0x361e54).then(_0x551a40 => {
            const {
              statusCode: _0x5a14a3,
              statusCode: _0x13e9f2,
              headers: _0x3e7b2d,
              body: _0x5a47b6
            } = _0x551a40;
            _0x5388e8(null, {
              status: _0x5a14a3,
              statusCode: _0x13e9f2,
              headers: _0x3e7b2d,
              body: _0x5a47b6
            }, _0x5a47b6);
          }, _0x19cef3 => _0x5388e8(_0x19cef3));
        } else {
          if (this.isNode()) {
            this.initGotEnv(_0x361e54);
            const {
              url: _0x52c632,
              ..._0x15ec09
            } = _0x361e54;
            this.got.post(_0x52c632, _0x15ec09).then(_0x5f506e => {
              const {
                statusCode: _0x3421a9,
                statusCode: _0x4dcd43,
                headers: _0x539dba,
                body: _0x484a33
              } = _0x5f506e;
              _0x5388e8(null, {
                status: _0x3421a9,
                statusCode: _0x4dcd43,
                headers: _0x539dba,
                body: _0x484a33
              }, _0x484a33);
            }, _0x3304e8 => {
              const {
                message: _0x3ffac5,
                response: _0x57e2e0
              } = _0x3304e8;
              _0x5388e8(_0x3ffac5, _0x57e2e0, _0x57e2e0 && _0x57e2e0.body);
            });
          }
        }
      }
    }
    time(_0x57d3a5, _0x48fbbf = null) {
      const _0x49a08c = _0x48fbbf ? new Date(_0x48fbbf) : new Date();
      let _0x5be1f3 = {
        "M+": _0x49a08c.getMonth() + 1,
        "d+": _0x49a08c.getDate(),
        "H+": _0x49a08c.getHours(),
        "m+": _0x49a08c.getMinutes(),
        "s+": _0x49a08c.getSeconds(),
        "q+": Math.floor((_0x49a08c.getMonth() + 3) / 3),
        S: _0x49a08c.getMilliseconds()
      };
      /(y+)/.test(_0x57d3a5) && (_0x57d3a5 = _0x57d3a5.replace(RegExp.$1, (_0x49a08c.getFullYear() + "").substr(4 - RegExp.$1.length)));
      for (let _0x46cea4 in _0x5be1f3) new RegExp("(" + _0x46cea4 + ")").test(_0x57d3a5) && (_0x57d3a5 = _0x57d3a5.replace(RegExp.$1, 1 == RegExp.$1.length ? _0x5be1f3[_0x46cea4] : ("00" + _0x5be1f3[_0x46cea4]).substr(("" + _0x5be1f3[_0x46cea4]).length)));
      return _0x57d3a5;
    }
    msg(_0x7ab8c8 = _0x446f07, _0x46ccc6 = "", _0x1a3df1 = "", _0x5cc982) {
      const _0x23c315 = _0x40dca9 => {
        if (!_0x40dca9) {
          return _0x40dca9;
        }
        if ("string" == typeof _0x40dca9) {
          return this.isLoon() ? _0x40dca9 : this.isQuanX() ? {
            "open-url": _0x40dca9
          } : this.isSurge() ? {
            url: _0x40dca9
          } : void 0;
        }
        if ("object" == typeof _0x40dca9) {
          if (this.isLoon()) {
            let _0x457772 = _0x40dca9.openUrl || _0x40dca9.url || _0x40dca9["open-url"],
              _0x4af34c = _0x40dca9.mediaUrl || _0x40dca9["media-url"];
            return {
              openUrl: _0x457772,
              mediaUrl: _0x4af34c
            };
          }
          if (this.isQuanX()) {
            let _0x29529d = _0x40dca9["open-url"] || _0x40dca9.url || _0x40dca9.openUrl,
              _0x4a51ca = _0x40dca9["media-url"] || _0x40dca9.mediaUrl;
            return {
              "open-url": _0x29529d,
              "media-url": _0x4a51ca
            };
          }
          if (this.isSurge()) {
            let _0x4920cd = _0x40dca9.url || _0x40dca9.openUrl || _0x40dca9["open-url"];
            return {
              url: _0x4920cd
            };
          }
        }
      };
      if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(_0x7ab8c8, _0x46ccc6, _0x1a3df1, _0x23c315(_0x5cc982)) : this.isQuanX() && $notify(_0x7ab8c8, _0x46ccc6, _0x1a3df1, _0x23c315(_0x5cc982))), !this.isMuteLog) {
        let _0x151610 = ["", "==============📣系统通知📣=============="];
        _0x151610.push(_0x7ab8c8);
        _0x46ccc6 && _0x151610.push(_0x46ccc6);
        _0x1a3df1 && _0x151610.push(_0x1a3df1);
        console.log(_0x151610.join("\n"));
        this.logs = this.logs.concat(_0x151610);
      }
    }
    log(..._0xf78b33) {
      _0xf78b33.length > 0 && (this.logs = [...this.logs, ..._0xf78b33]);
      console.log(_0xf78b33.join(this.logSeparator));
    }
    logErr(_0x4a3add, _0x1aaa9c) {
      const _0x11b3ed = !this.isSurge() && !this.isQuanX() && !this.isLoon();
      _0x11b3ed ? this.log("", "❗️" + this.name + ", 错误!", _0x4a3add.stack) : this.log("", "❗️" + this.name + ", 错误!", _0x4a3add);
    }
    wait(_0x47948b) {
      return new Promise(_0x5c6417 => setTimeout(_0x5c6417, _0x47948b));
    }
    done(_0x4ba235 = {}) {
      const _0x2bcb16 = new Date().getTime(),
        _0x3c55f0 = (_0x2bcb16 - this.startTime) / 1000;
      this.log("", "🔔" + this.name + ", 结束! 🕛 " + _0x3c55f0 + " 秒");
      this.log();
      (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(_0x4ba235);
    }
  }(_0x446f07, _0x52018a);
}