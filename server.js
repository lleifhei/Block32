const express = require('express')
const pg = require('pg')
const { Client } = pg
const client = new Client()

const app = express()
const port = 5432
app.use(express.json())


app.get('/api/flavors', async (req, res) => {
        const result = await client.query('SELECT * FROM flavors')
        console.log(result.rows)
        res.json(result.rows)
}
)
app.get('/api/flavors/:id', async (req, res) => {
    const id = req.params.id
    try {
        const result = await client.query('SELECT * FROM flavors WHERE id = $1', [id])
        if (result.rows.length === 0) {
            res.status(404).send('Flavor not found')
        } else {
            res.json(result.rows[0])
        }
    } catch (err) {
        console.error(err)
        res.status(500).send('Error retrieving flavor')
    }
}
)
app.put('/api/flavors/:id', async (req, res) => {
    const id = req.params.id
    const { name, description } = req.body
    try {
        const result = await client.query('UPDATE flavors SET name = $1, description = $2 WHERE id = $3 RETURNING *', [name, description, id])
        if (result.rows.length === 0) {
            res.status(404).send('Flavor not found')
        } else {
            res.json(result.rows[0])
        }
    } catch (err) {
        console.error(err)
        res.status(500).send('Error updating flavor')
    }
}
)
app.delete('/api/flavors/:id', async (req, res) => {
    const id = req.params.id
    try {
        const result = await client.query('DELETE FROM flavors WHERE id = $1 RETURNING *', [id])
        if (result.rows.length === 0) {
            res.status(404).send('Flavor not found')
        } else {
            res.json(result.rows[0])
        }
    } catch (err) {
        console.error(err)
        res.status(500).send('Error deleting flavor')
    }
})
app.listen(port, async () => {
    await client.connect()
    console.log(`Example app listening on port ${port}`)
    console.log('Connected to PostgreSQL database')
})