moduleLoader.imports('myModule', ['module1', 'module2'], function (module1, module2) {
	
	console.log('myModule dependencies are ' + module1.name() + ' and ' + module2.name());

	return {

		'dependencies': function () {
		
			console.log('myModule dependencies are ' + module1.name() + ' and ' + module2.name());

		}

	}

});