const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 80;

const control = require("./routes/control");

app.use(bodyParser.text()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.all("/",function(req, res, next) {
    res.status(503).send();
})
app.use("/control",control);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
