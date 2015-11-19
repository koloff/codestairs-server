"use strict";

let routes = require('./routes/api');


let express = require('express');
let app = express();

app.use('/', routes);


app.listen(1234, () => {console.log(`App listening on port ${3000}`);});