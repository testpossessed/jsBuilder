var builder = builder || {};

if(typeof require === 'function') {
    builder = require('../src/index.js');
}

describe('SingleObjectBuilder', function(){
    var sut;

    beforeEach(function(){
        sut = builder.create();
    });

    it('Should be defined', function () {
        expect(sut).toBeDefined();
    });

    it('Should define a method to complete the build operation', function () {
        expect(sut.build).toBeDefined();
        expect(typeof sut.build).toBe('function');
    });

    it('Should define a method to configure a field of the object', function () {
        expect(sut.with).toBeDefined();
        expect(typeof sut.with).toBe('function');
    });

    it('Should expect name and type or generator arguments to configure field with', function () {
        expect(sut.with.length).toBe(2);
    });

    it('Should throw error if name not specified on with', function () {
        expect(function(){
            sut.with();
        }).toThrowError('"with" requires a valid name for the member.');
    });

    it('Should throw error if name is not a string', function () {
        expect(function(){
            sut.with(1);
        }).toThrowError('"with" requires a valid name for the member.');
    });

    it('Should throw error if type or generator is not specified on with', function () {
        expect(function(){
            sut.with('myName');
        }).toThrowError('"with" requires one of the MemberType enum values or a generator function as the second argument.');
    });

    it('Should throw an error if the type is not one MemberType values or a generator function', function () {
        expect(function(){
            sut.with('myName', 'bad');
        }).toThrowError('"with" requires one of the MemberType enum values or a generator function as the second argument.');
    });

    it('Should return self from with', function () {
        expect(sut.with('myName', builder.MemberType.String)).toBe(sut);
    });
})
