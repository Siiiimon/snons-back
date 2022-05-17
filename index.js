const express = require('express')
const cors = require('cors')
const app = express()
const port = 8080

app.use(cors())

app.route('/auth')
	.get('/setup', (req, res) => {
		res.send(process.env.CLIENT_KEY)
	})

	.get('/redirect', (req, res) => {
		console.log(`got hit with ${req.query.code} from state: ${req.query.state}`)
		res.send("back so soon?")
	})


app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})