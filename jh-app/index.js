import got from 'got'
import express from 'express'
import * as url from 'url';
import crypto from 'crypto';
import prettier from 'prettier';

const app = express()
const port = 8080

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
app.use(express.static(__dirname + '/public'));

const codeVerifier = crypto
  .randomBytes(60)
  .toString('hex')
  .slice(0, 128);
const codeChallenge = crypto
  .createHash('sha256')
  .update(Buffer.from(codeVerifier))
  .digest('base64')
  .replace(/=/g, '')
  .replace(/\+/g, '-')
  .replace(/\//g, '_');

const clientID = "df52dda0-6385-4eb5-96b4-1658345424ad"
const redirectURI = "http%3A%2F%2Flocalhost%3A8080%2Fdynamic"
const scope = "openid https://api.banno.com/consumer/auth/accounts.readonly"
const responseType = "code"
const state = crypto.randomUUID()
const challengeMethod = "S256"

app.get('/', (req, res) => {

    const url = `https://digital.garden-fi.com/a/consumer/api/v0/oidc/auth?client_id=${clientID}&redirect_uri=${redirectURI}&scope=${scope}&response_type=${responseType}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=${challengeMethod}`
    res.send('<html><head><link rel="stylesheet" type="text/css" href="/style.css" /></head><body><a class="button" href="' + url + '">Login</a></body></html>')
})

app.get('/dynamic', (req, res) => {
    console.log("inside /dynamic, got code: " + req.query.code)
    const options = {
        headers: {
            'Authorization': 'Bearer eyJ4NXQiOiJNekkwTm1ZeU5tWXpabU5tTmpoaU16UmlNRGt4TlRnME1UYzNNRGt6WlRZd1lUQmtZMlF5TURZelpESmxNVGN6TWpNeE1HVmxNVEF5TWpJM1l6WXhNQSIsImtpZCI6Ik16STBObVl5Tm1ZelptTm1OamhpTXpSaU1Ea3hOVGcwTVRjM01Ea3paVFl3WVRCa1kyUXlNRFl6WkRKbE1UY3pNak14TUdWbE1UQXlNakkzWXpZeE1BX1JTMjU2IiwidHlwIjoiYXQrand0IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJmMmEwZmU4YS05YjBhLTQxMTMtYjBlMS0xNGRlNTE3MWQ5N2IiLCJhdXQiOiJBUFBMSUNBVElPTiIsImF1ZCI6IkcxbFVrV3VxOXduU1VBbHg2bjBhQW0xQUJvMGEiLCJuYmYiOjE2ODMxMzc5MDMsImF6cCI6IkcxbFVrV3VxOXduU1VBbHg2bjBhQW0xQUJvMGEiLCJpc3MiOiJodHRwczpcL1wvYXBpLmFzZ2FyZGVvLmlvXC90XC9jaGludGFuYXdpbGFtdW5hXC9vYXV0aDJcL3Rva2VuIiwiZXhwIjoxNjgzMTQxNTAzLCJpYXQiOjE2ODMxMzc5MDMsImp0aSI6ImQyMTI1YzFiLWFhZWUtNDIyYi04NTAzLTY4OGUxNjgyNjQwMSIsImNsaWVudF9pZCI6IkcxbFVrV3VxOXduU1VBbHg2bjBhQW0xQUJvMGEifQ.AqCjwS5x-yr4gBraWgmwQ5FJ48l3ptX88Grd_61OmpyNrad42qZVn0tf6__RzFViloOsoM0Z_Z0HVqoa0p9jzfIS02h7IkdsFIZBYFYx-Z7cJWWpC-QIzG158BSFIgxQIEFBtmpA58WEP9WdWTeh7UrCIB8_-GN73mIxUaMO_WL_D4BLSlOTijiHhQbeJmlpeKa_L9kZvzPK4ewNNQt5bngyQJtRPiLXu4rfVE7zsjo6KwDv1mEJtv4SsqgG8bTr5nWnEf5LoQybT49eg2hbGc5p7qS08yI_kwWfNmJdJZz34YpO16UZdMsFpKQ0JWYJJSQstOBDiC2km8wT76USxw'
        }
    }
    var url = `https://9d41cb15-8572-45fc-b493-02da2b5c12a4-dev.e1-us-east-azure.choreoapis.dev/wrrg/accountsdetails2/1.0.0/users/b9e0e57f-0d36-4f55-a189-7e0b295bd160/accounts?client_id=${clientID}&redirect_uri=${redirectURI}&code_verifier=${codeVerifier}&code=${req.query.code}`
    try {
        var data = got.get(url, options).then(response => {
            console.log(response.body)
            var prettyRes = prettier.format(response.body, { parser: "json" })
            res.send('<html><head><link rel="stylesheet" type="text/css" href="/style.css" /></head><body><h1>Dynamic</h1><p>Code: <code>' + req.query.code + '</code></p><p>Response: <pre>' + prettyRes + '</pre></p></body></html>')
        })
    } catch (error) {
        console.log("error: " + error)
    }    
    // res.send('<html><head><link rel="stylesheet" type="text/css" href="/style.css" /><link rel=stylesheet href="https://cdn.jsdelivr.net/npm/pretty-print-json@2.0/dist/css/pretty-print-json.css"/><script src=https://cdn.jsdelivr.net/npm/pretty-print-json@2.0/dist/pretty-print-json.min.js></script></head><body><h1>Dynamic</h1><p>Code: ' + req.query.code + '</p><p>State: ' + req.query.state + '</p></body></html>')

})

app.listen(port, () => {
    console.log(`jh-app listening at http://localhost:${port}`)
})