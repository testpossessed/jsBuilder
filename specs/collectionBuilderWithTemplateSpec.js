var builder = builder || {};

if (typeof require === 'function') {
    builder = require('../src/index.js');
}

describe('CollectionBuilder with template', function () {
    var sut, testDate = new Date(2015, 02, 10);

    beforeEach(function () {
        sut = builder.create({
            myString: builder.MemberType.String,
            myNumber: builder.MemberType.Number,
            myDate: function (item) {
                return testDate;
            }
        }, 3);
    });

    it('Should return collection with all members populated', function () {
        var expected = [{
            myString: 'myString 1',
            myNumber: 1,
            myDate: testDate
        }, {
            myString: 'myString 2',
            myNumber: 2,
            myDate: testDate
        }, {
            myString: 'myString 3',
            myNumber: 3,
            myDate: testDate
        }]
        var actual = sut.build();
        expect(actual).toEqual(expected);
    });

    it('Should return collection with template and configured members populated', function () {
        var expected = [{
            myString: 'myString 1',
            myNumber: 1,
            myDate: testDate,
            extra: 1
        }, {
            myString: 'myString 2',
            myNumber: 2,
            myDate: testDate,
            extra: 2
        }, {
            myString: 'myString 3',
            myNumber: 3,
            myDate: testDate,
            extra: 3
        }]
        var actual = sut.with('extra', builder.MemberType.Number).build();
        expect(actual).toEqual(expected);
    });

    it('Should return collection with template member overridden', function () {
        var expected = [{
            myString: 'String 1',
            myNumber: 1,
            myDate: testDate
        }, {
            myString: 'String 2',
            myNumber: 2,
            myDate: testDate
        }, {
            myString: 'String 3',
            myNumber: 3,
            myDate: testDate
        }]
        var actual = sut.with('myString', function (item) {
            return 'String ' + item;
        }).build();
        expect(actual).toEqual(expected);
    });
})
