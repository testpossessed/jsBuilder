var builder = builder || {};

if(typeof require === 'function') {
    builder = require('../src/index.js');
}

describe('SingleObjectBuilder without template', function(){
    var sut;

    beforeEach(function(){
        sut = builder.create();
    });

    it('Should return fairly useless empty object if not configured', function () {
        var actual = sut.build();
        expect(actual).toBeDefined();
        expect(actual).toEqual({});
    });

    it('Should add member with correct name, type and value when type is string', function () {
        var actual = sut.with('myName', builder.MemberType.String).build();
        expect(actual.myName).toBeDefined();
        expect(typeof actual.myName).toBe('string');
        expect(actual.myName).toBe('myName 1');
    });

    it('Should add member with correct name, type and value when type is number', function () {
        var actual = sut.with('myName', builder.MemberType.Number).build();
        expect(actual.myName).toBeDefined();
        expect(typeof actual.myName).toBe('number');
        expect(actual.myName).toBe(1);
    });

    it('Should add member with correct name, type and value when type is date', function () {
        var actual = sut.with('myName', builder.MemberType.Date).build();
        expect(actual.myName).toBeDefined();
        expect(actual.myName instanceof Date).toBeTruthy();
    });

    it('Should add member with correct name, type and value provided with generator', function () {
        var actual = sut.with('myName', function(item){
            return 'Item ' + item;
        }).build();
        expect(actual.myName).toBeDefined();
        expect(typeof actual.myName).toBe('string');
        expect(actual.myName).toBe('Item 1');
    });
})
