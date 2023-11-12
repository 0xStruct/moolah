
# Mina Email Oracle

Oracle server is built with ExpressJS and has 3 endpoints

`get /` to get server's public key output

`post /` to post email content for verification

`get /test` to test email verification for pass (`test-pass.eml`) and fake (`test-fake.eml`) cases

To run the server

first, copy `.env-example` to `.env`

then enter oracle private key

```
npm install
npm start
```


