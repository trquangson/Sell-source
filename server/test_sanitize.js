const sanitize = require('express-mongo-sanitize').sanitize;
const req = { query: { $gt: '1' } };
sanitize(req.query);
console.log(req.query);
