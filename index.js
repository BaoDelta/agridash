var path = require("path");
var fs = require("fs");

require("babel/register")(JSON.parse(fs.readFileSync(".babelrc", "utf8")));
require(path.resolve("src/node_modules/app/_server"));
