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