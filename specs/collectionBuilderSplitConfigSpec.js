var builder = builder || {};

if (typeof require === 'function') {
    builder = require('../src/index.js');
}

describe('CollectionBuilder with split config', function () {
    var testDate = new Date(2015, 02, 10);
    var template = {
        myString: builder.MemberType.String,
        myNumber: builder.MemberType.Number,
        myDate: function () {
            return testDate;
        }
    };

    it('Should return expected collection with first items overridden', function () {
        var actual = builder.create(template, 3)
            .theFirst(2)
            .with('myNumber', function () {
                return 9;
            }).build();

        var expected = [{
            myString: 'myString 1',
            myNumber: 9,
            myDate: testDate
        }, {
            myString: 'myString 2',
            myNumber: 9,
            myDate: testDate
        }, {
            myString: 'myString 3',
            myNumber: 3,
            myDate: testDate
        }];

        expect(actual).toEqual(expected);
    });

    it('Should return expected collection with last items overridden', function () {
        var actual = builder.create(template, 3)
            .theLast(2)
            .with('myNumber', function () {
                return 9;
            }).build();

        var expected = [{
            myString: 'myString 1',
            myNumber: 1,
            myDate: testDate
        }, {
            myString: 'myString 2',
            myNumber: 9,
            myDate: testDate
        }, {
            myString: 'myString 3',
            myNumber: 9,
            myDate: testDate
        }];

        expect(actual).toEqual(expected);
    });

    it('Should return expected collection with first and single next subset overridden', function () {
        var actual = builder.create(template, 5)
            .theFirst()
            .with('myNumber', function () {
                return 9;
            })
            .theNext(2)
            .with('myNumber', function () {
                return 8;
            })
            .build();

        var expected = [{
            myString: 'myString 1',
            myNumber: 9,
            myDate: testDate
        }, {
            myString: 'myString 2',
            myNumber: 8,
            myDate: testDate
        }, {
            myString: 'myString 3',
            myNumber: 8,
            myDate: testDate
        }, {
            myString: 'myString 4',
            myNumber: 4,
            myDate: testDate
        }, {
            myString: 'myString 5',
            myNumber: 5,
            myDate: testDate
        }];

        expect(actual).toEqual(expected);
    });

    it('Should return expected collection with first and multiple next subsets overridden', function () {
        var actual = builder.create(template, 5)
            .theFirst()
            .with('myNumber', function () {
                return 9;
            })
            .theNext()
            .with('myNumber', function () {
                return 8;
            })
            .theNext(2)
            .with('myNumber', function () {
                return 7;
            })
            .build();

        var expected = [{
            myString: 'myString 1',
            myNumber: 9,
            myDate: testDate
        }, {
            myString: 'myString 2',
            myNumber: 8,
            myDate: testDate
        }, {
            myString: 'myString 3',
            myNumber: 7,
            myDate: testDate
        }, {
            myString: 'myString 4',
            myNumber: 7,
            myDate: testDate
        }, {
            myString: 'myString 5',
            myNumber: 5,
            myDate: testDate
        }];

        expect(actual).toEqual(expected);
    });

    it('Should return expected collection with first, multiple next and last subsets overridden', function () {
        var actual = builder.create(template, 6)
            .theFirst()
            .with('myNumber', function () {
                return 9;
            })
            .theNext()
            .with('myNumber', function () {
                return 8;
            })
            .theNext(2)
            .with('myNumber', function () {
                return 7;
            })
            .theLast(2)
            .with('myNumber', function(){
                return 6;
            })
            .build();

        var expected = [{
            myString: 'myString 1',
            myNumber: 9,
            myDate: testDate
        }, {
            myString: 'myString 2',
            myNumber: 8,
            myDate: testDate
        }, {
            myString: 'myString 3',
            myNumber: 7,
            myDate: testDate
        }, {
            myString: 'myString 4',
            myNumber: 7,
            myDate: testDate
        }, {
            myString: 'myString 5',
            myNumber: 6,
            myDate: testDate
        },{
            myString: 'myString 6',
            myNumber: 6,
            myDate: testDate
        }];

        expect(actual).toEqual(expected);
    });


    it('Should return expected collection with first, single next, last and explicit remainder subsets overridden', function () {
        var actual = builder.create(template, 6)
            .theFirst()
            .with('myNumber', function () {
                return 9;
            })
            .theNext()
            .with('myNumber', function () {
                return 8;
            })
            .theLast(2)
            .with('myNumber', function(){
                return 6;
            })
            .theRemainder()
            .with('myNumber', function () {
                return 3;
            })
            .build();

        var expected = [{
            myString: 'myString 1',
            myNumber: 9,
            myDate: testDate
        }, {
            myString: 'myString 2',
            myNumber: 8,
            myDate: testDate
        }, {
            myString: 'myString 3',
            myNumber: 3,
            myDate: testDate
        }, {
            myString: 'myString 4',
            myNumber: 3,
            myDate: testDate
        }, {
            myString: 'myString 5',
            myNumber: 6,
            myDate: testDate
        },{
            myString: 'myString 6',
            myNumber: 6,
            myDate: testDate
        }];

        expect(actual).toEqual(expected);
    });
})
