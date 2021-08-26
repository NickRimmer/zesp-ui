window.$ = window.jQuery = require('jquery')

if (process.env.NODE_ENV !== "development") console.debug = () => {
    // show info for dev environment only
    console.log("Debug logs are disabled");
};