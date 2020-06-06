const express = require('express');
const dbConnect = require('./db')();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json({ extended: true }));
app.use('/api/auth', require('./Routes/auth'));
app.use('/api/data', require('./Routes/data'));
app.use('/api/item', require('./Routes/item'));

app.use('/', express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`server up and started on port:${PORT}`);
});
