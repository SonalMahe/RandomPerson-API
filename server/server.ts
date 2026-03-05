import {z} from 'zod';
import express from 'express';

//Initialize Express app-
const app = express();

//Middleware to parse JSON bodies-
app.use(express.json());

//Set the port-
const PORT = 3000;


//phase 1- Minimal server & ping route-
//route to minimal test the server-
app.get('/ping', (req, res) => {
    res.send('pong');
});

//Start the server-
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



// //Phase 2 — Fetch random person data and validate with Zod-
// Create GET /random-person route 
// Use fetch to get data from https://randomuser.me/api/ 
// Validate the response with Zod 
// Return full name and country (instead of email) 

app.get('/random-person', async (req, res) => {
    try {
        const response = await fetch('https://randomuser.me/api/');
        const data = await response.json();

        // Define Zod schema for validation
        const personSchema = z.object({
            results: z.array(
                z.object({
                    name: z.object({
                        first: z.string(),
                        last: z.string(),
                    }),
                    location: z.object({
                        country: z.string(),
                    }),
                })
            ),
        });

        // Validate the data
        const validatedData = personSchema.safeParse(data);
        if (!validatedData.success) {
            console.error('Validation errors:', validatedData.error);
            return res.status(400).json({ error: 'Invalid data received' });
        }else {
            const person = validatedData.data.results[0];
            const fullName = `${person.name.first} ${person.name.last}`;
            const country = person.location.country;
            res.json({ fullName, country });
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch random person data' });
    }
});