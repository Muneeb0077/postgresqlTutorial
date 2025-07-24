const {Client} = require('pg');
const express = require('express');
const app = express();

app.use(express.json());


const client = new Client({
  
    host: '',
    user: '',
    database: '',
    password: '',
    port: 5432,
});
client.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch(err => console.error('Connection error', err.stack));

app.post('/postData', async (req, res) => {
    const { name, id } = req.body;
    try {
        client.query('INSERT INTO demotable (name, id) VALUES ($1, $2)', [name, id],(err, result) => {
            if (err) {
                console.error('Insert error', err.stack);
                res.status(500).json({ error: 'Database insert failed' });
            } else {
                console.log('Insert successful', result);
                res.status(201).json(result);
            }
        });
    
    } catch (err) {
        console.error('Insert error', err.stack);
        res.status(500).json({ error: 'Database insert failed' });
    }
});

app.get('/getData', async (req, res) => {
    try {
        client.query('SELECT * FROM demotable', (err, result) => {
            if (err) {
                console.error('Select error', err.stack);
                res.status(500).json({ error: 'Database select failed' });
            } else {
                console.log('Select successful', result.rows);
                res.status(200).json(result.rows);
            }
        });
    
    } catch (err) {
        console.error('Select error', err.stack);
        res.status(500).json({ error: 'Database select failed' });
    }
});

app.get('/getData/:id', async (req, res) => {
    const { id } = req.params;
    try {
        client.query('SELECT * FROM demotable WHERE id = $1', [id], (err, result) => {
            if (err) {
                console.error('Select error', err.stack);
                res.status(500).json({ error: 'Database select failed' });
            } else if (result.rows.length === 0) {
                res.status(404).json({ error: 'Data not found' });
            } else {
                console.log('Select successful', result.rows[0]);
                res.status(200).json(result.rows[0]);
            }
        });
    
    } catch (err) {
        console.error('Select error', err.stack);
        res.status(500).json({ error: 'Database select failed' });
    }
});

app.put('/updateData/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        client.query('UPDATE demotable SET name = $1 WHERE id = $2', [name, id], (err, result) => {
            if (err) {
                console.error('Update error', err.stack);
                res.status(500).json({ error: 'Database update failed' });
            } else if (result.rowCount === 0) {
                res.status(404).json({ error: 'Data not found' });
            } else {
                console.log('Update successful', result);
                res.status(200).json(result);
            }
        });
    
    } catch (err) {
        console.error('Update error', err.stack);
        res.status(500).json({ error: 'Database update failed' });
    }
});

app.delete('/deleteData/:id', async (req, res) => {
    const { id } = req.params;
    try {
        client.query('DELETE FROM demotable WHERE id = $1', [id], (err, result) => {
            if (err) {
                console.error('Delete error', err.stack);
                res.status(500).json({ error: 'Database delete failed' });
            } else if (result.rowCount === 0) {
                res.status(404).json({ error: 'Data not found' });
            } else {
                console.log('Delete successful', result);
                res.status(200).json(result);
            }
        });
    
    } catch (err) {
        console.error('Delete error', err.stack);
        res.status(500).json({ error: 'Database delete failed' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});