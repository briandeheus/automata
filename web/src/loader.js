var redDress = require('reddress');
var Agent    = require('lib/agent').Agent;

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