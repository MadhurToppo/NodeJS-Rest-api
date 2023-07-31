# NodeJS Rest Api

This application provides template for CRUD operations of a Todos list in
NodeJS.

## Get JWT token for Login

```sh
curl --verbose --request POST http://localhost:3000/login \
--header 'Content-Type: application/json' \
--data '{"username":"user", "password": "password"}'
```

## Get all Todos

```sh
curl -X GET http://localhost:3000/todos -H "Authorization: jwt-token"
```
