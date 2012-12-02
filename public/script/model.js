function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

var App = App || {};

App.storyId = undefined;

App.Card = Backbone.Model.extend({
	urlRoot:"", //restful api
	defaults: {
		cardTitle: " ",
		cardContent: " ",
		cardId: guidGenerator(),
    iconType: "edit",
		editable: false
	},
	initialize: function(spec) {
		this.on("change:highlight", "toggleHighlight", this);
		this.on("change:content", "updateContent", this);
		this.on("error", function(model, error) {
        console.log(error);
		});
	},
	validate: function(attribs) {
	}
});

App.Attr = Backbone.Model.extend({
	urlRoot:"", //restful api
	defaults: {
		attrId: guidGenerator(),
		attrTitle: "",
        attrValue: [0, 0],
		editable: false
	},
	initialize: function(spec) {
		this.on("change:highlight", "toggleHighlight", this);
		this.on("change:content", "updateContent", this);
		this.on("error", function(model, error) {
			console.log(error);
		});
	},
	validate: function(attribs) {
	}
});

/*
App.Comment= Backbone.Model.extend({
	urlRoot:"", //restful api
	defaults: {
        comment: "Add Your Comment Now!" 
	},
	initialize: function(spec) {
		this.on("change:highlight", "toggleHighlight", this);
		this.on("change:content", "updateContent", this);
		this.on("error", function(model, error) {
			console.log(error);
		});
	},
	validate: function(attribs) {
	}
});
*/

var attrCollection = Backbone.Collection.extend({
    model: App.Attr
});

var cardCollection = Backbone.Collection.extend({
	model: App.Card
});

//Collection for Interacting with
App.Attrs = new attrCollection();
App.Column1 = new cardCollection();
App.Column2 = new cardCollection();
App.Column3 = new cardCollection();
App.Cols = [App.Column1, App.Column2, App.Column3];

//Attr View
App.AttrView = Backbone.View.extend({
	tagName: 'div',
	className: 'attr',
	template: _.template(Template.attributeTemplate),
	events: {
	},
	render: function(event) {
		console.log("App.AttrView Render");
		//this.$el.attr('id', this.model.get('cardId'));
		this.$el.html(this.template(this.model.toJSON()));

		/*
		if (this.model.get('cardType') == "videoCard") {
			this.$el.find('.card-header').hide();
		}
		*/
		return this;
	},
	initialize: function(model) {
        this.model = model;
		console.log("App.AttrView initialize");
	}
});

/*
//Comment View
App.CommentView= Backbone.View.extend({
	tagName: 'div',
	className: 'comment',
	template: _.template(Template.commentTemplate),
	events: {
	},
	render: function(event) {
		console.log("App.CommentView Render");
		//this.$el.attr('id', this.model.get('cardId'));
		this.$el.html(this.template(this.model.toJSON()));

		if (this.model.get('cardType') == "videoCard") {
			this.$el.find('.card-header').hide();
		}
		return this;
	},
	initialize: function(card) {
		console.log("App.CommentView initialize");
	}
}); */

//Card view
App.CardView = Backbone.View.extend({
	tagName: 'div',
	className: 'card',
	template: _.template(Template.cardTemplate),
	events: {
	},
	render: function(event) {
		console.log("App.CardView Render");
		//this.model.get('iconType'));
        
		this.$el.html(this.template(this.model.toJSON()));
        this.$el.attr('cid', this.model.cid);

		console.log(this.model.get('iconType') == 'edit');
        if (this.model.get('iconType') == 'edit') {
            this.$el.find('.btnedit').click(startEditBtn);
        }
        else {
            this.$el.addClass('attrStyle');
            this.$el.find('.btnplus').click(startAttrBtn);
        }

		/*
		if (this.model.get('cardType') == "videoCard") {
			this.$el.find('.card-header').hide();
		}
		*/
		return this;
	},
	initialize: function(card) {
        this.model = card;
		console.log("App.CardView initialize");
		//this.$el.addClass(card.model.get('iconType'));
		this.model.on('change', this.render, this);
	}
});

//The overall container
var BaseColView = Backbone.View.extend({
	el: 'undefined',
	collection: 'undefined',
	events: {
		'change':'render'
	},
	initialize: function() {
		console.log(this.$el);
		console.log(this.collection);

		this.collection.on('add', this.addOne, this);
	},
	render: function() {
		console.log("App.Col render");

		if (collection.length) {
			console.log(collection.length);
		}
		else {
			//this.$el.hide(); //hide the view
		}
	},
	addOne: function(card) {
		var card = new App.CardView(card);
		this.$el.append(card.render().el);
	},
	addAll: function() {
		this.$el.html('');
		collection.each(this.addOne, this);
	}
});

App.Col1View = BaseColView.extend({
	el: '#col1',
	collection: App.Column1
});

App.Col2View = BaseColView.extend({
	el: '#col2',
	collection: App.Column2
});

App.Col3View = BaseColView.extend({
	el: '#col3',
	collection: App.Column3
});

//Utility Functions
App.CurrentColIndex = 0; //index to current col
App.NextCol = function() {
	var nextCol = App.Cols[App.CurrentColIndex];
	App.CurrentColIndex = (App.CurrentColIndex+1)%App.Cols.length;
	return nextCol;
}
