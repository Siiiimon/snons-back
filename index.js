const express = require('express')
const cors = require('cors')
const app = express()
const fetch = require('node-fetch')
require('dotenv').config()
const port = 8080

let accessToken

app.use(cors())

app.get('/auth/setup', (req, res) => {
	if (req.headers.authorization == process.env.SNONS_PW) {
		res.send(process.env.CLIENT_KEY)
	} else {
		res.status(403).send("Unauthorized.")
	}
})

app.get('/auth/redirect', async (req, res) => {
	if (!req.query.state) {
		res.send("Ok.")
	} else {
		const auth = Buffer.from(process.env.CLIENT_KEY + ":" + process.env.CLIENT_SECRET).toString('base64')
		const h = {
			'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
			'Authorization': 'Basic ' + auth
		}
		const params = new URLSearchParams()
		params.append("grant_type", "authorization_code")
		params.append("code", req.query.code)
		params.append("redirect_uri", "https%3A%2F%2Fsnons-back-production.up.railway.app%2Fauth%2Fredirect")
		const response = await fetch("https://api.sonos.com/login/v3/oauth/access?" + params, {
			method: 'POST',
			headers: h,
		})
		const data = await response.json()
		accessToken = data.access_token
		res.send("back so soon?")
	}
})

app.get('/access', (req, res) => {
	if (req.headers.authorization == process.env.SNONS_PW) {
		res.send(accessToken)
	} else {
		res.status(403).send("Unauthorized.")
	}
})


app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
