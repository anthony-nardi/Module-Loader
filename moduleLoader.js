moduleLoader = (function (window, document, undefined) {

	var returnObject, //api
		list = [],    //modules
		queue = [],   //loading modules
		pending = []; //pending modules (dependencies)

	var fn = function (modules) {
		
		for (var i = 0, modulesLength = modules.length; i < modulesLength; i += 1) {
			
			if (typeof list[modules[i]] === "undefined" && typeof pending[modules[i]] === "undefined") {
				load(modules[i] + ".js");
			}
			
		}

	};
	
	returnObject = function (modules) { return fn(modules) };

	var load = function (filename) {
	   
		var script = document.createElement("script");        
		script.src = filename;
		document.getElementsByTagName("head")[0].appendChild(script);
	
	}
	
	returnObject.list = list;
	returnObject.queue = queue;
	returnObject.pending = pending;
	
	returnObject.imports = function (name, dependencies, module) {
		
		var dependenciesLength = dependencies.length,
			availableDependencies = [],  //list of the dependencies that have already loaded
			loaded = undefined;

		if (list[name] === undefined) {
			
			pending[name] = true;
			
			if (dependenciesLength) {

				for (var i = 0; i < dependenciesLength; i += 1) {
					
					if (list[dependencies[i]] === undefined) {
						
						console.log(name + " waiting for " + dependencies[i])
						loaded = false;
						
						if (queue[dependencies[i]] === undefined) {
							queue[dependencies[i]] = [];
						}

						queue[dependencies[i]].push([name, dependencies, module]);
					}
				
				}

				if (loaded === false) {
					return;
				} else {

					pending[name] = false;

					list.push(name);

					list[name] = module.apply(null, dependencies);

					console.log(name +" loaded.")

					if (queue[name] && queue[name].length) {
						for (var i = 0, queueLength = queue[name].length; i < queueLength; i += 1) {
							returnObject.imports.apply(null, queue[name][i]);
						}
					}
				}

			} else {

				loaded = true;

				pending[name] = false;
				
				list.push(name);
				
				list[name] = module();
				
				console.log(name +" loaded.")
				
				if (queue[name] && queue[name].length) {
				
					for (var i = 0, queueLength = queue[name].length; i < queueLength; i += 1) {
						returnObject.imports.apply(null, queue[name][i]);
					}
				
				}
			}
		}
	};

	return returnObject;

}(window, window.document));

