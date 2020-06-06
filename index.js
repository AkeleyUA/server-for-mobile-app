const express = require('express');
const path = require('path');
const dbConnect = require('./db')();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json({ extended: true }));
app.use('/api/auth', require('./Routes/auth'));
app.use('/api/data', require('./Routes/data'));
app.use('/api/item', require('./Routes/item'));

app.use('/', express.static(path.join(__dirname, 'Public')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'Public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`server up and started on port:${PORT}`);
});
