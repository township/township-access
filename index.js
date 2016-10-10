var sublevel = require('subleveldown')

module.exports = function townshipAccess (maindb) {
  var access = {}
  var db = sublevel(maindb, 'township-access', { valueEncoding: 'json' })
  access.db = db

  access.get = function (key, callback) {
    db.get(key, callback)
  }

  access.create = function (key, scopes, callback) {
    var data = {
      key: key,
      scopes: scopes
    }

    db.put(key, data, function (err) {
      if (err) return callback(err)
      else callback(null, data)
    })
  }

  access.update = function (key, scopes, callback) {
    access.get(key, function (err, account) {
      if (err) return callback(err)
      account.scopes = scopes
      db.put(key, account, function (err) {
        if (err) return callback(err)
        else callback(null, account)
      })
    })
  }

  access.destroy = function (key, callback) {
    db.del(key, callback)
  }

  access.verify = function (key, scopes, callback) {
    db.get(key, function (err, account) {
      if (err) return callback(err)
      var scopeAccess = access.verifyScopes(account, scopes)
      if (scopeAccess) return callback(null, account)
      else callback(new Error('Access denied'))
    })
  }

  access.verifyScopes = function (account, scopes) {
    var i = 0
    var l = scopes.length
    for (i; i < l; i++) {
      if (!access.verifyScope(account, scopes[i])) return false
    }
    return true
  }

  access.verifyScope = function (account, scope) {
    if (!account || !scope) return false
    var accountScopes = account.scopes.join(',')
    if (accountScopes.indexOf(scope) === -1) return false
    return true
  }

  return access
}
