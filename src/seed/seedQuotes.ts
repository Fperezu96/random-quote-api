import dotenv from 'dotenv';
import Quote from '../models/Quote';
import mongoose from 'mongoose';

dotenv.config();

const quotes = [
  { text: "To be or not to be.", author: "Shakespeare" },
  { text: "The unexamined life is not worth living.", author: "Socrates" },
];

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(async () => {
    await Quote.deleteMany();
    await Quote.insertMany(quotes);
    process.exit(0);
  })
  .catch(console.error);
