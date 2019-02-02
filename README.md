# township-access

An access control module to accompany [township-auth](https://github.com/township/township-auth).

## Install

```
npm i --save township-access
```

## Example

```js
const townshipAccess = require('township-access')
const level = require('level')

const db = level('db')
const access = townshipAccess(db)
const key = 'pizza'
const scopes = ['site:read', 'site:edit']

access.create(key, scopes, function (err, account) {
  access.verify(key, ['site:edit'], function (err, verified) {
    console.log(verified)
  })
})
```

## Documentation
- [API docs](docs/api.md)

## See also
- [township-auth](https://github.com/township/township-auth) - manage authentication credentials
- [township-token](https://github.com/township/township-token) - create & decode JWT tokens with township auth/access data

## License
[MIT](LICENSE.md)
