var test = require('tape')
var memdb = require('memdb')
var townshipAccess = require('../index')

test('create an access record', function (t) {
  var access = townshipAccess(memdb())
  var key = 'pizza'
  var scopes = ['site:read']

  access.create(key, scopes, function (err, account) {
    t.notOk(err)
    t.ok(account)
    t.equal(account.key, key)
    t.end()
  })
})

test('update an access record', function (t) {
  var access = townshipAccess(memdb())
  var key = 'pizza'
  var scopes = ['site:read']

  access.create(key, scopes, function (err, account) {
    t.notOk(err)
    t.ok(account)
    var newScopes = ['site:read', 'site:edit']

    access.update(key, newScopes, function (err, updated) {
      t.notOk(err)
      t.equal(updated.key, key)
      t.equal(updated.scopes.length, 2)
      t.end()
    })
  })
})

test('verify a scope', function (t) {
  var access = townshipAccess(memdb())
  var key = 'pizza'
  var scopes = ['site:read', 'site:edit']

  access.create(key, scopes, function (err, account) {
    t.notOk(err)
    access.verify(key, ['site:edit'], function (err, verified) {
      t.notOk(err)
      t.end()
    })
  })
})
