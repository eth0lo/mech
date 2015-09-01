var Backbone = require('./src/node');

var Test = Backbone.Model.extend({
	url: 'https://api.wuaki.tv/movies.json'
})

var test = new Test();
console.time('jquery')
test.fetch({
	success: function() {
        console.timeEnd('jquery')
		// console.log(test.toJSON())
	}
})
