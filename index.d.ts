declare module builder {
    /**
     * @description Enum of valid types for defining fields on built objects
     */
    class MemberType {
        static String:string;
        static Number:string;
        static Date:string;
    }

    interface SingleObjectBuilder {
        /**
         * @description Returns the number of objects the builder will build
         * @returnType {number}
         */
        size(): number;
        /**
         * @description Configures a field with a value or generator for the value
         * @param {string} name The name of the field to be generated on the built object
         * @param {any} typeOrGenerator The type of the value to be generated for the field or a function to generate it
         * @returnType {SingleObjectBuilder}
         */
        with(name:string, typeOrGenerator:any): SingleObjectBuilder
        /**
         * @description Builds the required object
         * @returnType {Object}
         */
        build(): {};
    }

    interface CollectionBuilder {
        /**
         * @description Returns the number of objects the builder will build
         * @returnType {number}
         */
        size(): number;
        /**
         * @description Configures a field with a value or generator for the value
         * @param {string} name The name of the field to be generated on the built object
         * @param {any} typeOrGenerator The type of the value to be generated for the field or a function to generate it
         * @returnType {CollectionBuilder}
         */
        with(name:string, typeOrGenerator:any): SingleObjectBuilder
        /**
         * @description Builds the required objects
         * @returnType {Array}
         */
        build(): Array;
        /**
         * @description Initiates configuration of the first n objects
         * @param {number} [n=1] The number of objects subsequent calls to with are applied to defaults to 1
         * @returnType {CollectionBuilder}
         */
        theFirst(n?:number): CollectionBuilder;
        /**
         * @description Initiates configuration of the next n objects
         * @param {number} [n=1] The number of objects subsequent calls to with are applied to defaults to 1
         * @returnType {CollectionBuilder}
         */
        theNext(n?:number): CollectionBuilder;
        /**
         * @description Initiates configuration of the last n objects
         * @param {number} [n=1] The number of objects subsequent calls to with are applied
         * @returnType {CollectionBuilder}
         */
        theLast(n?:number): CollectionBuilder;
        /**
         * @description Returns the builder to a state where subsequent calls to with are applied as the default object specification
         */
        theRemainder(): CollectionBuilder;
    }
    /**
     * @description Creates a builder for a single object
     * @param {Object} [template] Optional template (interface) from which to build objects
     */
    function create(template?:{}):SingleObjectBuilder;
    /**
     * @description Creates a builder for a single object
     * @param {Object} [template] Optional template (interface) from which to build objects
     * @param {number} [n=1] Optional number of items to build
     */
    function create(template?:{}, n?:number):CollectionBuilder;
}
