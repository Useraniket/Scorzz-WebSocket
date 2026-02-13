import express from 'express';
import { matchRouter } from './routes/matches.js';  

const app = express();
const PORT = 8000;

app.use(express.json());//enables middleware to parse JSON bodies in incoming requests

app.get('/', (req, res) => {
    res.json({ message: 'Hello! The server is up and running.' });
});

app.use('/matches',matchRouter)

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
