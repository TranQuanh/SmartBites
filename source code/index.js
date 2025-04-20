const express = require('express');
const app = express();
const port = 500;

app.set('view engine', 'pug');
app.set('views', './views');
app.get('/', (req, res) => {
  res.render("index.pug", {
    title: 'Hey',
    message: 'Hello there!'
  });
});
app.get('/products', (req, res) => {
  console.log([]);
  res.send('sản phẩm');
});
app.listen(port,()=>{
    console.log(`Example app listening on port ${port}`);
})