/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var redDress = __webpack_require__(1);
	var Agent    = __webpack_require__(2).Agent;

	var matrix   = new redDress.RedDress(3, 3);

	function createAgent (matrix, x, y) {
	    
	    const agent  = new Agent();
	    const walker = matrix.set(agent, x, y, true);
	    
	    function fireNearby (walker) {
	        
	        var checks = [
	            [-1, -1], [0, -1], [-1, 1],
	            [-1, 0], [1, 0]
	            [-1, -1], [1, 0], [1, 1]
	        ];
	        
	        for (var i = 0, l = checks.length; i < l; i += 1) {
	            
	            console.log('Checking', checks[i]);
	            
	            try {
	                
	                var value = walker.find.apply(walker, checks[i]);
	                console.log(value.state);
	                
	            } catch (e) {
	                continue;
	            }
	            
	        }
	        
	    }
	    
	    agent.addState('fire', function () {
	        
	        fireNearby(walker);
	        this.setState('noFire');
	            
	    }, true);
	    
	    agent.addState('noFire', function () {
	        
	        fireNearby(walker);
	        this.setState('fire');
	            
	    });
	    
	}

	createAgent(matrix, 0, 0);
	createAgent(matrix, 0, 1);
	createAgent(matrix, 0, 2);

	createAgent(matrix, 1, 0);
	createAgent(matrix, 1, 1);
	createAgent(matrix, 1, 2);

	createAgent(matrix, 2, 0);
	createAgent(matrix, 2, 1);
	createAgent(matrix, 2, 2);

	window.matrix = matrix;

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	var matrix = Symbol('Matrix');
	var length = Symbol('Length');

	var xS      = Symbol('x');
	var yS      = Symbol('y');
	var parentS = Symbol('parent');

	class BoundError extends Error {}

	class RedDressWalker {

	    constructor (x, y, parent) {

	        this[xS]      = x;
	        this[yS]      = y;
	        this[parentS] = parent;

	    }

	    /**
	     * Move the walker to a different cell
	     * @param x
	     * @param y
	     * @returns {*}
	     */
	    move (x, y) {

	        let moveX = this[xS] + x;
	        let moveY = this[yS] + y;

	        this[parentS].__check_bounds(moveX, moveY);

	        this[xS] = moveX;
	        this[yS] = moveY;

	        return this.value;

	    }

	    /**
	     * Get the value of the cell the walker is on.
	     * @returns {*}
	     */
	    get value () {
	        return this[parentS].find(this[xS], this[yS]);
	    }

	    /**
	     * Find a cell from the walkers point.
	     * @param x
	     * @param y
	     * @returns {*}
	     */
	    find (x, y) {

	        let moveX = this[xS] + x;
	        let moveY = this[yS] + y;

	        return this[parentS].find(moveX, moveY);

	    }

	    /**
	     * Set cell value
	     * @param value
	     */
	    set (value) {

	        this[parentS].set(value, this[xS], this[yS]);

	    }

	    /**
	     * Get the current position
	     * @returns {*[]}
	     */

	    getPosition () {
	        return [this[xS], this[yS]]
	    }

	}

	class RedDress {

	    /**
	     * Create a new RedDress matrix.
	     *
	     * @example
	     *
	     * let matrix = new RedDress(3, 3); // Creates an empty 3, 3 matrix.
	     *
	     * @param {int} rows - Rows constraint for the matrix
	     * @param {int} columns - Column constraints for the matrix.
	     */
	    constructor (rows, columns) {

	        this.rows    = rows;
	        this.columns = columns;

	        this[length] = rows * columns;
	        this[matrix] = new Array(this[length])

	    }

	    /**
	     * Check wether the specified coordinates are in the matrix.
	     * @param {int} x
	     * @param {int} y
	     * @private
	     */
	    __check_bounds (x, y) {

	        if (isNaN(x) === true) {
	            throw new Error('x is not a number');
	        }

	        if (isNaN(y) === true) {
	            throw new Error('y is not a number');
	        }

	        if (x > this.rows - 1 || x < 0) {
	            throw new BoundError('Row is out of bounds');
	        }

	        if (y > this.columns - 1 || y < 0) {
	            throw new BoundError('Column is out of bounds');
	        }

	    }

	    /**
	     * Find a value in the matrix at X, Y
	     * @param {int} x
	     * @param {int} y
	     * @returns {*}
	     * @private
	     */
	    __position_in_matrix (x, y) {

	        let realRow = x * this.columns;
	        return realRow + y;

	    }

	    /**
	     * Populate a matrix
	     *
	     * @example
	     *
	     * matrixBulk = new RedDress(3, 3);
	     * matrixBulk.bulkAdd([
	     *  ['0,0', '0,1', '0,2'],
	     *  ['1,0', '1,1', '1,2'],
	     *  ['2,0', '2,1', '2,2']
	     * ]);
	     *
	     * @param matrix
	     */
	    bulkSet (matrix) {

	        for (var i = 0, l = matrix.length; i < l; i += 1) {

	            var row = matrix[i];

	            for (var ii = 0, ll = row.length; ii < ll; ii += 1) {
	                this.set(row[ii], i, ii);
	            }

	        }

	    }

	    /**
	     * Add a new value to the matrix.
	     * @param {*} value - Value for the X, Y position
	     * @param {int} x - X coordinate in the matrix
	     * @param {int} y - Y coordinate in the matrix
	     * @param {boolean} withWalker - Returns a RedDressWalker if set to true
	     */
	    set (value, x, y, withWalker=false) {

	        this.__check_bounds(x, y);

	        let position = this.__position_in_matrix(x, y);
	        this[matrix][position] = value;

	        if (withWalker === true) {
	            return new RedDressWalker(x, y, this);
	        }

	    }

	    /**
	     * Find a value at X, Y
	     * @param {int} x
	     * @param {int} y
	     * @param {boolean} withWalker
	     * @returns {*}
	     */
	    find (x, y, withWalker=false) {

	        this.__check_bounds(x, y);

	        let position = this.__position_in_matrix(x, y);
	        let value = this[matrix][position];

	        if (withWalker === true) {
	            return new RedDressWalker(value, x, y, this);
	        } else {
	            return value;
	        }

	    }

	    getWalker (initialX, initialY) {
	        return new RedDressWalker(initialX, initialY, this);
	    }

	}

	exports.RedDress   = RedDress;
	exports.BoundError = BoundError;


/***/ },
/* 2 */
/***/ function(module, exports) {

	const states      = Symbol('states');
	const activeState = Symbol('activeState');
	const state       = Symbol('state');
	const step        = Symbol('step');
	const parent      = Symbol('parent');

	class AgentError extends Error {};

	class AgentState {
	    
	    constructor (agent, step) {
	        
	        this[parent] = agent;
	        this.step    = step;
	        
	        this.step.bind(this);
	        
	    }
	    
	    setState (state) {
	        this[parent].setState(state);
	    }
	    
	}

	class Agent {
	    
	    constructor () {
	        
	        this[states]      = {};
	        this[activeState] = null;
	        
	    }
	    
	    addState (key, step, isActive = false) {
	        
	        this[states][key] = new AgentState(this, step);
	        
	        if (isActive === true) {
	            this[activeState] = key;
	        }
	           
	    }
	    
	    get state () {
	        return this[activeState]
	    }
	    
	    setState (newState) {
	        
	        this[activeState] = newState;
	        
	    }
	    
	    step () {
	        
	        this[states][this[activeState]].step()
	        
	    }
	    
	}

	exports.Agent = Agent;

/***/ }
/******/ ]);