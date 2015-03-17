var jewel =(function() {

	var scriptQueue= [],
		numResourcesLoaded=0,
		numResources=0,
		executeRunning=false;

	function executeScriptQueue(){
		var next= scriptQueue[0],first, script;
		if (next && next.loaded) {
			executeRunning = true;

			// remove first element in the queue;
			scriptQueue.shift();
			first=document.getElementsByTagName("script")[0];
			script=document.createElement("script");
			script.onLoad=function(){
				if(next.callback) {
					next.callback();
				}
				//try to execute more scripts
				executeScriptQueue();
			};
			script.src= next.src;
			first.parentNode.insertBefore(script, first);			
		} else {
			executeRunning=false;
		}
	}

	function load (src, callback) {
		var image, queueEntry;
		numResources++;

		// add this resource to the execution queue
		queueEntry= {
			src: src,
			callback: callback,
			loaded: false
		};
		scriptQueue.push(queueEntry);

		image= new Image();
		image.onLoad= image.onerror= function() {
			numResourcesLoaded++;
			queueEntry.loaded= true;
			if (!executeRunning) {
				executeScriptQueue();
			}
		};
		image.src= src;
		console.log("loaded.")
	}

	function setup () {
		console.log("Setup.");
	}

	return {
		load: load,
		setup: setup
	};

})();