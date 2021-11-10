require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan')
const mongoose = require('mongoose');
const { PORT = 3000, MONGODB_URL } = process.env;
const CONFIG = {
    useUnifiedTopology: true,
    useNewUrlParser: true
};
mongoose.connect(MONGODB_URL, CONFIG);
mongoose.connection.on('open', () => console.log('Connected'));
mongoose.connection.on('close', () => console.log('closed'));
mongoose.connection.on('error', () => console.log('error'));
//MIDDLEWARE
app.use(cors());
app.use(morgan('dev'));
app.use(express.json())
//
const { Schema, model } = mongoose;
const cheesesSchema = new Schema({
    name: String,
    countryOfOrigin: String,
    image: String
});
const Cheese = model("Cheese", cheesesSchema);

app.get('/', (req, res) => {
    res.send('test')
});
//index route
app.get('/cheeses', async (req, res) => {
    try {
        res.json(await Cheese.find({}));
    } catch (error) {
        res.status(400).json(error
        );
    };
});
//delete route
app.delete('/cheeses/:id', async (req, res) => {
    try {
        res.json(await Cheese.findByIdAndRemove(req.params.id))
    } catch (error) {
        res.status(400).json(error);
    };
});
app.put('/cheeses:id', async (req, res) => {
    try {
        res.json(await Cheese.findByIdAndUpdate(req.params.id, req.body, { new: true }));
    } catch (error) {
        res.status(400).json(error);
    };
});
//create route
app.post('/cheeses', async (req, res) => {
    try {
        res.json(await Cheese.create(req.body));
    } catch (error) {
        res.status(400).json(error);
    };
});



app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});
