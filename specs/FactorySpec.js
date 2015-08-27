var builder = builder || {};

if(typeof require === 'function') {
    builder = require('../src/index.js');
}

describe('jsBuilder Factory', function(){
    it('Should be defined', function () {
        expect(builder).toBeDefined();
    });

    it('Should define a method to create objects', function () {
        expect(builder.create).toBeDefined();
        expect(typeof builder.create).toBe('function');
    });

    it('Should expect a required specification and optional number of items as arguments', function () {
        expect(builder.create.length).toBe(2);
    });
})