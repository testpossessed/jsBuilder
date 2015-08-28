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

    it('Should expect optional template and number of items as arguments', function () {
        expect(builder.create.length).toBe(2);
    });

    it('Should return a single object builder if create requested without arguments', function () {
        var actual = builder.create();
        assertIsSingleObjectBuilder(actual);
    });

    it('Should return a single object builder if create is called with a single argument that is an object', function () {
        var actual = builder.create({});
        assertIsSingleObjectBuilder(actual);
    });

    it('Should return a single object builder if create is called with a single argument that is the number 1', function () {
        var actual = builder.create(1);
        assertIsSingleObjectBuilder(actual);
    });

    it('Should return a collection builder if create is called with a single argument that is a number greater then 1', function () {
        var actual = builder.create(2);
        assertIsCollectionBuilder(actual);
    });

    it('Should throw an error if template is provided but is not valid', function () {
        expect(function(){
            builder.create({member:null})
        }).toThrowError('Template must be an object with fields that should be defined on built objects with' +
            ' their required type using the MemberType enum or a generator function that will be called with' +
            ' an argument indicating the position of the item in any collection.')
    });

    it('Should provide enum of types for use with configuration methods', function () {
        expect(builder.MemberType).toBeDefined();
        expect(builder.MemberType.String).toBeDefined();
        expect(builder.MemberType.Number).toBeDefined();
        expect(builder.MemberType.Date).toBeDefined();
    });

    function assertIsSingleObjectBuilder(target) {
        expect(target.constructor.name).toBe('SingleObjectBuilder');
    }

    function assertIsCollectionBuilder(target) {
        expect(target.constructor.name).toBe('CollectionBuilder');
    }
})