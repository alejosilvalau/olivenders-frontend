# Reporte de Pruebas Realizadas

## Prueba End To End del Frontend con Cypress

### Link del video: [Prueba E2E](https://www.youtube.com/watch?v=4MzoutkW2-I)

## Prueba de Unidad (para el auth.service)

![Test Auth](Screenshot%202025-08-18%20160938.png)

## Prueba de integración Backend (login)

```javascript
  console.log
    [query] db.getCollection('wizard').find({ username: 'notexist' }, {}).limit(1).toArray(); [took 46 ms, 0 results]

      at DefaultLogger.log (node_modules/@mikro-orm/core/logging/DefaultLogger.js:38:14)

  console.log
    { message: 'Wizard not found' }

      at Object.<anonymous> (tests/login.test.ts:14:13)

  console.log
    Origin: undefined

      at origin (src/index.ts:29:15)

  console.log
    [query] db.getCollection('wizard').find({ username: 'dracomalfoy' }, {}).limit(1).toArray(); [took 55 ms, 1 result]

      at DefaultLogger.log (node_modules/@mikro-orm/core/logging/DefaultLogger.js:38:14)

  console.log
    { message: 'Incorrect password' }

      at Object.<anonymous> (tests/login.test.ts:24:13)

  console.log
    Origin: undefined

      at origin (src/index.ts:29:15)

  console.log
    [query] db.getCollection('wizard').find({ username: 'dracomalfoy' }, {}).limit(1).toArray(); [took 41 ms, 1 result]

      at DefaultLogger.log (node_modules/@mikro-orm/core/logging/DefaultLogger.js:38:14)

  console.log
    {
      message: 'Login successful',
      data: {
        id: '686fab31e5c1922fd703246c',
        username: 'dracomalfoy',
        name: 'draco',
        last_name: 'Malfoy',
        email: 'draco.malfoy2@hogwarts.edu',
        address: '5 Manor Drive, Malfoy Manor',
        phone: '445345678',
        role: 'admin',
        deactivated: false,
        school: '6870f73ba7d116ea3b5a1b06'
      },
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NmZhYjMxZTVjMTkyMmZkNzAzMjQ2YyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1NTEzNjg3NiwiZXhwIjoxNzU1MTQwNDc2fQ.60SzX-OmSy7be_4xxTjHYL8AVZFcrey9CRRljjJU0is'
    }

      at Object.<anonymous> (tests/login.test.ts:36:13)

  console.log
    Origin: undefined

      at origin (src/index.ts:29:15)

  console.log
    [query] db.getCollection('wizard').find({ username: 'dracomalfoy' }, {}).limit(1).toArray(); [took 43 ms, 1 result]

      at DefaultLogger.log (node_modules/@mikro-orm/core/logging/DefaultLogger.js:38:14)

  console.log
    { message: 'data and hash arguments required' }

      at Object.<anonymous> (tests/login.test.ts:46:13)

 PASS  tests/login.test.ts (5.09 s)
  Wizard Login Endpoint
    √ Nonexistent user (134 ms)
    √ Incorrect password (127 ms)
    √ Successful login (110 ms)
    √ Missing attributes (55 ms)

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        5.428 s, estimated 6 s
Ran all test suites.
```

<div align="center">
<h3><a href="./README.md">Volver al Index</a><h3>
</div>
