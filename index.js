'use strict';

let express = require('express');
let app = express();

let config = require('./config/config');

let routes = require('./routes/api');

// Bootstrap express with routes
require('./config/express')(app, routes);
// Bootstrap mongoose
require('./config/mongoose')(config);


let port = config.port;
app.listen(port, () => {console.log(`App listening on port ${port}`);});