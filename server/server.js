import express from 'express';
import cors from 'cors';
import  'dotenv/config';
import { clerkMiddleware, requireAuth } from '@clerk/express'
import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import userRouter from './routes/userRoutes.js';


const app = express();
      // ✅ FIRST
await connectCloudinary();
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware()); 



app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(requireAuth()); // ✅ SECOND - This will protect all routes below this line



app.use('/api/ai', aiRouter);
app.use('/api/user', userRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
