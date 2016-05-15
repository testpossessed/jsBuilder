module.exports = function(wallaby) {
    wallaby.defaults.files.load = false;
    wallaby.defaults.files.instrument = false;
    wallaby.defaults.files.ignore = true;
    return {
        "files": [
            {pattern: "src/**/*.js", load: true, instrument: true, ignore: false}
        ],
        "tests": ["specs/**/*Spec.js"]
    }
};