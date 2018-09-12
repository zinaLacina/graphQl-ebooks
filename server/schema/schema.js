const graphql = require('graphql');

const Book = require('../models/book');
const Author = require('../models/author');

const _ = require("lodash");

const {
	GraphQLObjectType,GraphQLString,
	 GraphQLSchema, GraphQLID,
	 GraphQLInt,
	 GraphQLList,
	 GraphQLNonNull
	} = graphql;

//book dummie
const books = [
	{name: 'My first book',id:'1',genre:"sexism",authorId:"1"},
	{name: 'My second book',id:'2',genre:"sport",authorId:"2"},
	{name: 'My third book',id:'3',genre:"Essie",authorId:"1"}
];
//author dummie
const authors = [
	{name: 'Zina lacina',id:'1',age:30},
	{name: 'Rouamba',id:'2',age:45},
	{name: 'Amal',id:'3',age:20}
];


const BookType = new GraphQLObjectType({
	name: 'Book',
	fields:()=>({
		id:{type: GraphQLID},
		name:{type: GraphQLString},
		genre:{type: GraphQLString},
		author:{
			type: AuthorType,
			resolve(parent,args){
				//console.log(parent);
				//return _.find(authors,{id:parent.authorId});
				return Author.findById(parent.authorId);
			}
		}
	})
});

// Author
const AuthorType = new GraphQLObjectType({
	name: 'Author',
	fields:()=>({
		id:{type: GraphQLID},
		name:{type: GraphQLString},
		age:{type: GraphQLInt},
		books:{
			type: new GraphQLList(BookType),
			resolve(parent,args){
				//return _.filter(books,{authorId:parent.id})
				return Book.find({authorId:parent.id});
			}
		}
	})
});



const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields:{
		book:{
			type: BookType,
			args:{ id: {type: GraphQLID}},
			resolve(parent,args){
				//Code to get data from db/other source
				//return _.find(books,{id:args.id});
				return Book.findById(args.id);
			}
		},
		author:{
			type: AuthorType,
			args:{ id: {type: GraphQLID}},
			resolve(parent,args){
				//Code to get data from db/other source
				//return _.find(authors,{id:args.id});
				return Author.findById(args.id);
			}
		},
		books:{
			type: new GraphQLList(BookType),
			resolve(parent,args){
				return Book.find({});
			}
		},
		authors:{
			type:new GraphQLList(AuthorType),
			resolve(parent,args){
				return Author.find({});
			}
		}
	}
});

const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields:{
		addAuthor:{
			type: AuthorType,
			args:{
				name:{ type: new GraphQLNonNull(GraphQLString) },
				age: { type : new GraphQLNonNull(GraphQLInt)}
			},
			resolve(parent,args){
				let author = new Author({
					name:args.name,
					age:args.age
				});
				return author.save();
			}
		},
		addBook:{
			type:BookType,
			args:{
				name: {type: new GraphQLNonNull(GraphQLString)},
				genre: {type: new GraphQLNonNull(GraphQLString)},
				authorId:{type: new GraphQLNonNull(GraphQLID)},
			},
			resolve(parent,args){
				let book = new Book({
					name: args.name,
					genre: args.genre,
					authorId: args.authorId
				});
				return book.save();
			}
		}
	}
});


module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
});
