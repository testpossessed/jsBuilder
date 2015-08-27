(function(){

    function Factory(){
        this.create = function(spec, num){

        }
    }

    var factory = new Factory();
    if(typeof window !== 'undefined')
    {
        window.builder = factory;
    }
    else if(typeof require === 'function'){
        if(typeof define === 'function'){
            define([], function(){
                return factory;
            });
        }
        else
        {
            module.exports = factory;
        }
    }
})();