var builder = builder || {};

if(typeof require === 'function') {
    builder = require('../src/index.js');
}

describe('CollectionBuilder', function(){
    var sut;

    beforeEach(function(){
        sut = builder.create(3);
    });

    it('Should be defined', function () {
        expect(sut).toBeDefined();
    });

    it('Should define a method to complete the build operation', function () {
        expect(sut.build).toBeDefined();
        expect(typeof sut.build).toBe('function');
    });

    it('Should define a method to query the number of items to be built', function () {
        expect(sut.size).toBeDefined();
        expect(typeof sut.size).toBe('function');
    });

    it('Should return the size originally specified on creation', function () {
        expect(sut.size()).toBe(3);
    });

    it('Should define a method to configure a field on the objects', function () {
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

    it('Should define a method to configure first n objects', function () {
        expect(sut.theFirst).toBeDefined();
        expect(typeof sut.theFirst).toBe('function');
    });

    it('Should expect a number of first items to apply configuration to', function () {
        expect(sut.theFirst.length).toBe(1);
    });

    it('Should self after configuring the first subset of objects', function () {
        var actual = sut.theFirst();
        expect(actual).toBe(sut);
    });

    it('Should define a method to configure next n objects', function () {
        expect(sut.theNext).toBeDefined();
        expect(typeof sut.theNext).toBe('function');
    });

    it('Should expect a number of next items to apply configuration to', function () {
        expect(sut.theNext.length).toBe(1);
    });

    it('Should return self after configuring a next subset of objects', function () {
        sut.theFirst();
        var actual = sut.theNext();
        expect(actual).toBe(sut);
    });

    it('Should define a method to configure last n objects', function () {
        expect(sut.theLast).toBeDefined();
        expect(typeof sut.theLast).toBe('function');
    });

    it('Should expect a number of last items to apply configuration to', function () {
        expect(sut.theLast.length).toBe(1);
    });

    it('Should return self after configuring the last subset of objects', function () {
        var actual = sut.theLast();
        expect(actual).toBe(sut);
    });

    it('Should throw an error if next n is requested before first n', function () {
        expect(function(){
            sut.theNext();
        }).toThrowError('A call to "theNext" must follow a call to "theFirst".')
    });

    it('Should throw an error if next n is requested after last n', function () {
        sut.theFirst();
        sut.theLast();
        expect(function(){
            sut.theNext();
        }).toThrowError('"theNext" cannot be used once "theLast" has been used.')
    });

    it('Should throw an error if the total of first and next n exceeds original size', function () {
        sut.theFirst(2);
        expect(function() {
            sut.theNext(2);
        }).toThrowError('Cannot exceed bounds of original builder with "theNext".');
    });

    it('Should throw an error if the total of first and last n exceeds original size', function () {
        sut.theFirst(2);
        expect(function() {
            sut.theLast(2);
        }).toThrowError('Cannot exceed bounds of original builder with "theLast".');
    });

    it('Should define a method to configure remaining objects not configured through first, next or last n methods', function () {
        expect(sut.theRemainder).toBeDefined();
        expect(typeof sut.theRemainder).toBe('function');
    });

    it('Should return self after configuring the remainder subset of objects', function () {
        var actual = sut.theRemainder();
        expect(actual).toBe(sut);
    });
})
