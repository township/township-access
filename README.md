# township-access

An access control module to accompany [township-auth](https://github.com/township/township-auth).

## Install

```
npm i --save township-access
```

## Example

```js
var townshipAccess = require('township-access')
var level = require('level')

var db = level('db')
var access = townshipAccess(db)
var key = 'pizza'
var scopes = ['site:read', 'site:edit']

access.create(key, scopes, function (err, account) {
  access.verify(key, ['site:edit'], function (err, verified) {
    console.log(verified)
  })
})
```

## See also
- [township-auth](https://github.com/township/township-auth) - manage authentication credentials
- [township-token](https://github.com/township/township-token) - create & decode JWT tokens with township auth/access data

## License
[MIT](LICENSE.md)
