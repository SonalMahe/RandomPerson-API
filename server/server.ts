import {z} from 'zod';
import express from 'express';

//Initialize Express app-
const app = express();

//Middleware to parse JSON bodies-
app.use(express.json());

//Set the port-
const PORT = 3000;

//route to minimal test the server-
app.get('/ping', (req, res) => {
    res.send('pong');
});

//Start the server-
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

