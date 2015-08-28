var builder = builder || {};

if (typeof require === 'function') {
    builder = require('../src/index.js');
}

describe('Nesting Builders', function () {
    it('Should build a semi complex object using "nested" builders without a template', function () {
        var actual = builder.create()
            .with('id', builder.MemberType.Number)
            .with('name', builder.MemberType.String)
            .with('children', function () {
                return builder.create(3)
                    .with('id', builder.MemberType.Number)
                    .with('name', builder.MemberType.String)
                    .build()
            }).build();

        var expected = {
            id: 1,
            name: 'name 1',
            children: [
                {
                    id: 1,
                    name: 'name 1'
                },
                {
                    id: 2,
                    name: 'name 2'
                },
                {
                    id: 3,
                    name: 'name 3'
                }
            ]
        }

        expect(actual).toEqual(expected);
        expect(actual.children).toBeDefined();
        expect(actual.children).toEqual(expected.children);
    });

    it('Should build a semi complex object using "nested" builders with a template', function () {
        var template = {
            id: builder.MemberType.Number,
            name: builder.MemberType.String,
            children: function () {
                return builder.create(3)
                    .with('id', builder.MemberType.Number)
                    .with('name', builder.MemberType.String)
                    .build();
            }
        };

        var actual = builder.create(template).build();

        var expected = {
            id: 1,
            name: 'name 1',
            children: [
                {
                    id: 1,
                    name: 'name 1'
                },
                {
                    id: 2,
                    name: 'name 2'
                },
                {
                    id: 3,
                    name: 'name 3'
                }
            ]
        }

        expect(actual).toEqual(expected);
        expect(actual.children).toBeDefined();
        expect(actual.children).toEqual(expected.children);
    });
})
