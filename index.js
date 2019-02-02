const sublevel = require('subleveldown')
const createLock = require('level-lock')

/**
* Create a township access db
* @name createTownshipAccess
* @namespace townshipAccess
* @param {object} leveldb - an instance of a leveldb created using [level](https://github.com/level/)
* @return {object}
* @example
* const createTownshipAccess = require('township-access')
* const level = require('level')
*
* const db = level('./db')
* const access = createTownshipAccess(db)
*/
module.exports = function createTownshipAccess (leveldb) {
  const db = sublevel(leveldb, 'township-access', { valueEncoding: 'json' })

  /**
  * Get a set of access scopes
  *
  * @name access.get
  * @memberof townshipAccess
  * @param {string} key - the key for the access scopes
  * @param {function} callback - callback with `err`, `data` arguments
  */
  function get (key, callback) {
    db.get(key, callback)
  }

  /**
  * Create a set of access scopes
  *
  * @name access.create
  * @memberof townshipAccess
  * @param {string} key - the key for the access scopes
  * @param {array} scopes - array of strings
  * @param {function} callback - callback with `err`, `data` arguments
  */
  function create (key, scopes, callback) {
    const data = {
      key: key,
      scopes: scopes
    }

    db.put(key, data, function (err) {
      if (err) return callback(err)
      else callback(null, data)
    })
  }

  /**
  * Update a set of access scopes
  *
  * @name access.update
  * @memberof townshipAccess
  * @param {string} key - the key for the access scopes
  * @param {array} scopes - array of strings
  * @param {function} callback - callback with `err`, `data` arguments
  */
  function update (key, scopes, callback) {
    const unlock = lock(key)

    get(key, function (err, account) {
      if (err) return callback(err)
      account.scopes = scopes

      db.put(key, account, function (err) {
        unlock()
        if (err) return callback(err)
        else callback(null, account)
      })
    })
  }

  /**
  * Delete a set of access scopes
  *
  * @name access.destroy
  * @memberof townshipAccess
  * @param {string} key - the key for the access scopes
  * @param {function} callback - callback with `err`, `data` arguments
  */
  function destroy (key, callback) {
    db.del(key, callback)
  }

  /**
  * Verify that a set of scopes match what is in the db for a key
  *
  * @name access.verify
  * @memberof townshipAccess
  * @param {string} key - the key for the access scopes
  * @param {array} scopes - array of strings with scopes that must match
  * @param {function} callback - callback with `err`, `data` arguments
  */
  function verify (key, scopes, callback) {
    db.get(key, function (err, account) {
      if (err) return callback(err)
      var scopeAccess = verifyScopes(account, scopes)
      if (scopeAccess) return callback(null, account)
      else callback(new Error('Access denied'))
    })
  }

  /**
  * Verify that a set of scopes match what is available in an object with a scopes property
  *
  * @name access.verifyScopes
  * @memberof townshipAccess
  * @param {object} data
  * @param {array} data.scopes - array of strings
  * @param {array} scopes - array of strings with scopes that must match
  * @return {boolean} returns `true` if `scopes` are all found in `data.scopes`
  */
  function verifyScopes (data, scopes) {
    let i = 0
    const l = scopes.length

    for (i; i < l; i++) {
      if (!verifyScope(data, scopes[i])) return false
    }

    return true
  }

  /**
  * Verify that a scope matches what is available in an object with a scopes property
  *
  * @name access.verifyScope
  * @memberof townshipAccess
  * @param {string} key - the key for the access scopes
  * @param {function} callback - callback with `err`, `data` arguments
  * @return {boolean} returns `true` if `scope` is found in `data.scopes`
  */
  function verifyScope (account, scope) {
    if (!account || !account.scopes || !account.scopes.length || !scope) return false
    return account.scopes.includes(scope)
  }

  /**
  * Lock an access db key while performing an operation on it
  *
  * @name access.lock
  * @memberof townshipAccess
  * @param {string} key - the key for the access scopes
  * @param {string} [mode=w] - can be `r`, `w`, or `rw`, default is `w`
  * @return {boolean} returns `true` if `scope` is found in `data.scopes`
  */
  function lock (key, mode) {
    return createLock(db, key, mode)
  }

  return {
    db,
    get,
    create,
    update,
    destroy,
    verify,
    verifyScope,
    verifyScopes,
    lock
  }
}
