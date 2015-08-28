(function () {

    'use strict';

    var memberType = {
        String: 'string',
        Number: 'number',
        Date: 'date'
    };

    function Builder(template, num) {
        var self = this;

        self.size = function () {
            return num;
        };

        self.with = function (name, typeOrGenerator) {
            if (!name || typeof name !== 'string') {
                throw new Error('"with" requires a valid name for the member.');
            }

            if (!isValidMemberType(typeOrGenerator)) {
                throw new Error('"with" requires one of the MemberType enum values or a generator function ' +
                    'as the second argument.');
            }

            self.$with(name, typeOrGenerator);

            return self;
        };

        self.build = function () {
            return self.$build();
        };

        self.$with = function (name, typeOrGenerator) {
            throw new Error('Not Implemented');
        };

        self.$build = function () {
            throw new Error('Not Implemented');
        };

        self.$$objectFromTemplate = function (template, sequenceNo) {
            var result = {};
            for (var name in template) {
                if (template.hasOwnProperty(name)) {
                    result[name] = getValue(name, template[name], sequenceNo);
                }
            }
            return result;
        };

        function getValue(name, typeOfGenerator, item) {
            if (typeof typeOfGenerator === 'function') {
                return typeOfGenerator(item);
            }

            if (typeOfGenerator === memberType.Number) {
                return item;
            }

            if (typeOfGenerator === memberType.String) {
                return name + ' ' + item;
            }

            return new Date();
        }
    }

    function SingleObjectBuilder(template) {
        var self = this;
        Builder.call(self, template, 1);

        var $$template = copyTemplate(template);

        self.$build = function () {
            return self.$$objectFromTemplate($$template, 1);
        }

        self.$with = function (name, typeOrGenerator) {
            $$template[name] = typeOrGenerator;
        }
    }

    function CollectionBuilder(template, num) {
        var self = this;
        var firstBuilderSpec,
            nextBuilderSpecs = [],
            lastBuilderSpec,
            remainderBuilderSpec,
            currentBuilderSpec;

        Builder.call(self, template, num);

        remainderBuilderSpec = createBuilderSpec(0);
        currentBuilderSpec = remainderBuilderSpec;

        self.theFirst = function (n) {
            if (!n) {
                n = 1;
            }
            firstBuilderSpec = createBuilderSpec(n);
            currentBuilderSpec = firstBuilderSpec;
            return self;
        };

        self.theNext = function (n) {
            if (!n) {
                n = 1;
            }
            throwIfFirstNotInitialised();
            throwIfLastInitialised();
            throwIfNextExceedsSize(n);
            var nextBuilderSpec = createBuilderSpec(n);
            nextBuilderSpecs.push(nextBuilderSpec);
            currentBuilderSpec = nextBuilderSpec;
            return self;
        };

        self.theLast = function (n) {
            if (!n) {
                n = 1;
            }
            throwIfLastExceedsSize(n);
            lastBuilderSpec = createBuilderSpec(n);
            currentBuilderSpec = lastBuilderSpec;
            return self;
        };

        self.theRemainder = function () {
            currentBuilderSpec = remainderBuilderSpec;
            return self;
        };

        self.$build = function () {
            var size = self.size();
            var remainderBounds = [0, size];
            var result = [];

            if (firstBuilderSpec) {
                for (var i = 0; i < firstBuilderSpec.size; i++) {
                    result[i] = self.$$objectFromTemplate(firstBuilderSpec.template, i + 1);
                }

                remainderBounds[0] = firstBuilderSpec.size;
            }

            if (nextBuilderSpecs.length) {
                var start = firstBuilderSpec.size, end = 0;
                for (var j = 0; j < nextBuilderSpecs.length; j++) {
                    var spec = nextBuilderSpecs[j];
                    end = start + spec.size;
                    for (var k = start; k < end; k++) {
                        result[k] = self.$$objectFromTemplate(spec.template, k + 1);
                    }
                    start = end;
                }

                remainderBounds[0] = end;
            }

            if (lastBuilderSpec) {
                var start = self.size() - lastBuilderSpec.size;
                var end = self.size();
                for (var l = start; l < end; l++) {
                    result[l] = self.$$objectFromTemplate(lastBuilderSpec.template, l + 1);
                }

                remainderBounds[1] = start;
            }

            for (var n = remainderBounds[0]; n < remainderBounds[1]; n++) {
                result[n] = self.$$objectFromTemplate(remainderBuilderSpec.template, n + 1);
            }

            return result;
        };

        self.$with = function (name, typeOrGenerator) {
            currentBuilderSpec.template[name] = typeOrGenerator;
        };

        function createBuilderSpec(n) {
            return {size: n, template: copyTemplate(template)};
        }

        function sumOfNextBuilderSizes() {
            var sum = 0;
            for (var i = 0; i < nextBuilderSpecs.length; i++) {
                sum += nextBuilderSpecs[i].size;
            }
            return sum;
        }

        function throwIfFirstNotInitialised() {
            if (!firstBuilderSpec) {
                throw new Error('A call to "theNext" must follow a call to "theFirst".');
            }
        }

        function throwIfLastInitialised() {
            if (lastBuilderSpec) {
                throw new Error('"theNext" cannot be used once "theLast" has been used.');
            }
        }

        function firstBuilderSize() {
            if (!firstBuilderSpec) {
                return 0;
            }

            return firstBuilderSpec.size;
        }

        function throwIfNextExceedsSize(n) {
            if (firstBuilderSize() + sumOfNextBuilderSizes() + n > num) {
                throw new Error('Cannot exceed bounds of original builder with "theNext".')
            }
        }

        function throwIfLastExceedsSize(n) {
            if (firstBuilderSize() + sumOfNextBuilderSizes() + n > num) {
                throw new Error('Cannot exceed bounds of original builder with "theLast".')
            }
        }
    }

    function Factory() {
        var self = this;
        self.create = function (template, num) {
            var actualTemplate = getActualTemplate(template), actualNum = getActualNum(template, num);

            if (actualNum > 1) {
                return new CollectionBuilder(actualTemplate, actualNum);
            }

            return new SingleObjectBuilder(actualTemplate);
        }

        self.MemberType = memberType;

        function throwIfTemplateInvalid(template) {
            for (var name in template) {
                if (template.hasOwnProperty(name) && !isValidMemberType(template[name])) {
                    throw new Error('Template must be an object with fields that should be defined on built objects with' +
                        ' their required type using the MemberType enum or a generator function that will be called with' +
                        ' an argument indicating the position of the item in any collection.')
                }
            }
        }

        function getActualTemplate(template) {
            if (template && typeof template === 'object') {
                throwIfTemplateInvalid(template);
                return template;
            }

            return {};
        }

        function getActualNum(template, num) {
            if (template && typeof template === 'number') {
                return template;
            }

            if (num && typeof num === 'number') {
                return num;
            }

            return 1;
        }
    }

    function copyTemplate(template) {
        var copy = {};

        for (var name in template) {
            if (template.hasOwnProperty(name)) {
                copy[name] = template[name];
            }
        }
        return copy;
    }

    function isValidMemberType(val) {
        return !!(typeof val === 'function'
        || val === memberType.String
        || val === memberType.Number
        || val === memberType.Date);
    }

    var factory = new Factory();
    if (typeof window !== 'undefined') {
        window.builder = factory;
    }
    else if (typeof require === 'function') {
        if (typeof define === 'function') {
            define([], function () {
                return factory;
            });
        }
        else {
            module.exports = factory;
        }
    }
})
();