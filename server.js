const express = require('express')
const pg = require('pg')
const { Client } = pg
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '',
    port: 5432,
})
const app = express()
const port = 3000
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
}
)

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
app.post('/api/flavors', async (req, res) => {
    const { name, is_favorite } = req.body
    try {
        const result = await client.query('INSERT INTO flavors (name, is_favorite) VALUES ($1, $2) RETURNING *', [name, is_favorite])
        res.status(201).json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).send('Error creating flavor')
    }
})
app.put('/api/flavors/:id', async (req, res) => {
    const id = req.params.id
    const { name, is_favorite } = req.body
    try {
        const result = await client.query('UPDATE flavors SET name = $1, description = $2 WHERE id = $3 RETURNING *', [name, is_favorite, id])
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