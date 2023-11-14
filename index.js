const express = require('express');
const cors = require('cors'); // Add CORS to request api's to your frontend

const bodyParser = require('body-parser');
const cabRoutes = require('./routes/cabRoutes')
const userRoutes = require('./routes/userRoute')


const app = express();


const port = process.env.PORT || 3000


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); // Enable CORS if needed for your frontend

app.use('/api',cabRoutes)

app.use('/user',userRoutes)


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
