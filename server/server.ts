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



// Phase 3 — User POST route 
// Create POST /users route 
// Accept an object with name, age, and email 
// Validate using Zod with rules: 
//   - name: 3-12 characters 
//   - age: optional, 18-100, default 28 
//   - email: must be valid and lowercase 
// Return 201 with the validated user or 400 with error details 

app.post('/users', (req, res) => {
    const userSchema = z.object({
        name: z.string().min(3).max(12),
        age: z.number().min(18).max(100).optional().default(28),
        email: z.email().toLowerCase(),      
    });

    //validate the data using Zod schema-
    const validateNewUser = userSchema.safeParse(req.body);
    if (!validateNewUser.success) {
        console.error('Validation errors:', validateNewUser.error);
        return res.status(400).json(
            { error: 'Invalid user data', 
            details: validateNewUser.error });
    } else {
        const newUser = validateNewUser.data;
        res.status(201).json({ message: 'User created successfully', user: newUser }        

        );
    }
});



// Challenge — Fetch additional data 
// Create GET /random-login route 
// Fetch a random user from the RandomUser API 
// Return their username and registered date 
// Validate the response with Zod to ensure the fields exist 
// Optional: Display in the response a short summary like: 'username (registered on YYYY-MM-DD)' 

 