const express = require('express')
const cors = require('cors')
const app = express()
//const cuid = require('cuid')
const fetch = require('node-fetch')
const port = 8080

app.use(cors())

let db = {}

app.get('/auth/setup', (req, res) => {
	res.send(process.env.CLIENT_KEY)
})

app.get('/auth/redirect', async (req, res) => {
	if (!req.query.state) {
		console.log("not sure where to go from here")
		res.send("yea you did it!")
	} else {
	console.log(`got hit with ${req.query.code} from state: ${req.query.state}`)
	//const id = cuid()
	//db[id] = true

	const auth = Buffer.from(process.env.CLIENT_KEY + ":" + process.env.CLIENT_SECRET).toString('base64')
	const h = {
		'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
		'Authorization': 'Basic ' + auth
	}
	const params = new URLSearchParams()
	params.append("grant_type", "authorization_code")
	params.append("code", req.query.code)
	//params.append("redirect_uri", "https%3A%2F%2Fsnons-back-production.up.railway.app%2Faccess%2Fredirect%2F"+id)
	params.append("redirect_uri", "https%3A%2F%2Fsnons-back-production.up.railway.app%2Fauth%2Fredirect")
	//console.log("request parameters: ", params)
	//console.log("request headers: ", h)
	const response = await fetch("https://api.sonos.com/login/v3/oauth/access?" + params, {
		method: 'POST',
		headers: h,
	})
	const data = await response.json()
	console.log("response: ", response)
	console.log("\n\ndata: ", data)
	res.send("back so soon?")
	}
})


app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
