var path = require('path');
var sass = require("node-sass");
var eyeglass = require("eyeglass");

var options = {
    eyeglass: {
        modules: [
            {
                path: path.join(__dirname, 'sass-utilizer.scss')
            }
        ],

        engines: {
            sass: sass
        }
    }
};

sass.render(eyeglass(options));