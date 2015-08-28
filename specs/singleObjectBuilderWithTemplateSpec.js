var builder = builder || {};

if (typeof require === 'function') {
    builder = require('../src/index.js');
}

describe('SingleObjectBuilder with template', function () {
    var sut;

    beforeEach(function () {
        sut = builder.create({
            myString: builder.MemberType.String,
            myNumber: builder.MemberType.Number,
            myDate: builder.MemberType.Date,
            myGenerated: function(item){
                return 'Item ' + item;
            }
        });
    });

    it('Should add string member from template correctly', function () {
        var actual = sut.build();
        expect(actual.myString).toBeDefined();
        expect(typeof actual.myString).toBe('string');
        expect(actual.myString).toBe('myString 1');
    });

    it('Should add number member from template correctly', function () {
        var actual = sut.build();
        expect(actual.myNumber).toBeDefined();
        expect(typeof actual.myNumber).toBe('number');
        expect(actual.myNumber).toBe(1);
    });

    it('Should add date member from template correctly', function () {
        var actual = sut.build();
        expect(actual.myDate).toBeDefined();
        expect(actual.myDate instanceof Date).toBeTruthy();
    });

    it('Should add generated member from template correctly', function () {
        var actual = sut.build();
        expect(actual.myGenerated).toBeDefined();
        expect(typeof actual.myGenerated).toBe('string');
        expect(actual.myGenerated).toBe('Item 1');
    });

    it('Should override template with configuration using generator', function () {
        var actual = sut.with('myNumber', function(item){
            return item * 3;
        }).build();

        expect(actual.myNumber).toBeDefined();
        expect(typeof actual.myNumber).toBe('number');
        expect(actual.myNumber).toBe(3);
    });
})
