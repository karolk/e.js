var assert = require("assert")

describe('E', function(){

    var E;
    beforeEach(function() {
        E = require('../e')
    })

    describe('#subscribe()', function(){
        it('should expect 2 arguments', function(){
            assert.equal(E.subscribe.length, 2);
        })
        it('should create namespace for observers if there isn\'t one', function() {
            var subscriber = function(){}
            E.subscribe('foo', subscriber)
            assert.equal(typeof E.__events__['foo'], "object")
            assert.equal(E.__events__['foo'][0], subscriber)
        })
        it('should add observers to existing namespace', function() {
            var subscriber2 = function(){}
            E.subscribe('foo', subscriber2)
            assert.equal(E.__events__['foo'][1], subscriber2)
        })
    })

    describe('#on()', function() {
        it('should be a synonyme of subscribe', function() {
            assert.equal(E.subscribe, E.on)
        })
    })

    describe('#onAll()', function() {
        it('should create namespace for all observers', function() {
            var subscriber = function(){}
            E.onAll(['tom', 'jerry'], subscriber)
            assert.equal(typeof E.__events__['tom'], "object")
            assert.equal(E.__events__['tom'][0], subscriber)
            assert.equal(typeof E.__events__['jerry'], "object")
            assert.equal(E.__events__['jerry'][0], subscriber)
        })
    })

    describe('#publish()', function(){
        it('should expect 2 arguments', function(){
            assert.equal(E.publish.length, 2);
        })
        it('should expect 2 arguments', function(){
            assert.equal(E.publish.length, 2);
        })
        it('should execude subscribers', function() {
            var called1 = 0
            var called2 = 0
            var subscriber1 = function(){called1++}
            E.on('test', subscriber1)
            var subscriber2 = function(){called2++}
            E.on('test', subscriber2)
            E.publish('test')
            assert.equal(called1, 1)
            assert.equal(called2, 1)
        })
    })
})
