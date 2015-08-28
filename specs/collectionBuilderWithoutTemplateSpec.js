var builder = builder || {};

if(typeof require === 'function') {
    builder = require('../src/index.js');
}

describe('CollectionBuilder without template', function(){
    var sut;

    beforeEach(function(){
        sut = builder.create(3);
    });

    it('Should return collection of fairly useless empty objects if not configured', function () {
        var actual = sut.build();
        assertCollectionIsValid(actual, [{}, {}, {}]);
    });

    it('Should add member to all objects with correct name, type and value when type is string', function () {
        var actual = sut.with('myName', builder.MemberType.String).build();
        assertCollectionIsValid(actual, [{myName: 'myName 1'}, {myName: 'myName 2'}, {myName: 'myName 3'}]);
    });

    it('Should add member with correct name, type and value when type is number', function () {
        var actual = sut.with('myName', builder.MemberType.Number).build();
        assertCollectionIsValid(actual, [{myName: 1}, {myName: 2}, {myName: 3}]);
    });

    it('Should add member with correct name, type and value when type is date', function () {
        var actual = sut.with('myName', builder.MemberType.Date).build();
        expect(actual[0].myName).toBeDefined();
        expect(actual[0].myName instanceof Date).toBeTruthy();
        expect(actual[1].myName).toBeDefined();
        expect(actual[1].myName instanceof Date).toBeTruthy();
        expect(actual[2].myName).toBeDefined();
        expect(actual[2].myName instanceof Date).toBeTruthy();
    });

    it('Should add member with correct name, type and value provided with generator', function () {
        var actual = sut.with('myName', function(item){
            return 'Item ' + item;
        }).build();
        assertCollectionIsValid(actual, [{myName: 'Item 1'}, {myName: 'Item 2'}, {myName: 'Item 3'}]);
    });

    function assertCollectionIsValid(actual, expected)
    {
        expect(actual).toBeDefined();
        expect(actual instanceof Array).toBeTruthy();
        expect(actual).toEqual(expected);
    }
})
