import got from 'got'

// const express = require('express')
import express from 'express'
import * as url from 'url';
import crypto from 'crypto';

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
            'Authorization': 'Bearer eyJ4NXQiOiJNekkwTm1ZeU5tWXpabU5tTmpoaU16UmlNRGt4TlRnME1UYzNNRGt6WlRZd1lUQmtZMlF5TURZelpESmxNVGN6TWpNeE1HVmxNVEF5TWpJM1l6WXhNQSIsImtpZCI6Ik16STBObVl5Tm1ZelptTm1OamhpTXpSaU1Ea3hOVGcwTVRjM01Ea3paVFl3WVRCa1kyUXlNRFl6WkRKbE1UY3pNak14TUdWbE1UQXlNakkzWXpZeE1BX1JTMjU2IiwidHlwIjoiYXQrand0IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJmMmEwZmU4YS05YjBhLTQxMTMtYjBlMS0xNGRlNTE3MWQ5N2IiLCJhdXQiOiJBUFBMSUNBVElPTiIsImF1ZCI6WyJRSWVCYjJuYndEVnZFMVdMdWRlUnVxSFRmQ1VhIiwiY2hvcmVvOmRlcGxveW1lbnQ6cHJvZHVjdGlvbiJdLCJuYmYiOjE2ODMwNTQ2ODQsImF6cCI6IlFJZUJiMm5id0RWdkUxV0x1ZGVSdXFIVGZDVWEiLCJpc3MiOiJodHRwczpcL1wvYXBpLmFzZ2FyZGVvLmlvXC90XC9jaGludGFuYXdpbGFtdW5hXC9vYXV0aDJcL3Rva2VuIiwiZXhwIjoxNjgzMDU4Mjg0LCJpYXQiOjE2ODMwNTQ2ODQsImp0aSI6IjRlMWE2MTc3LWIxYTctNDJlMC1iNDk3LWM0YWQzOWE2NjdhOCIsImNsaWVudF9pZCI6IlFJZUJiMm5id0RWdkUxV0x1ZGVSdXFIVGZDVWEifQ.X0VjKrcAYUI_JRSeMM9WqpEm8wPAnl2g-Xfl_6LAA1oMSfrQ8yuuYa0sZ-rM5LOjYvElHK5j9JZdw9D7mVHp-epBBKj-e1OgUi8vgykX66zzIbBCrtSiSGQmk7X3pDkf0ilE-6PVOTEc9Bjl-lxBrvWUDn58MEHi6KgHE9NOKwc6zoyRYOt1hP5N5-IWx-K9NsyT9VJ_1eMfvi3aooZpcbQYpuWwVv8CMTqldDypacQBf_UJJhEVy5-b1_lQe3hQy2hq5IRui7knc30FbBE1k96500QQRhkHCDMQXcsBNlB_nFAoeT3Ud_nVLTFkd-2U1u0X-hXP3lL-V9ey1XMlbA'
        }
    }
    const url = `https://9d41cb15-8572-45fc-b493-02da2b5c12a4-dev.e1-us-east-azure.choreoapis.dev/xmqq/accountsdetails/1.0.0/users/chintana/accounts&client_id=${clientID}&redirect_uri=${redirectURI}&code_verifier=${codeVerifier}`
    const {data} = got.get(url, options);
    console.log("data: " + JSON.stringify(data))
    res.send(data)
    // res.send('<html><head><link rel="stylesheet" type="text/css" href="/style.css" /></head><body><h1>Dynamic</h1><p>Code: ' + req.query.code + '</p><p>State: ' + req.query.state + '</p></body></html>')

})

app.listen(port, () => {
    console.log(`jh-app listening at http://localhost:${port}`)
})