import { ApolloServer, gql } from "apollo-server";

const users = [
    {
      firstName: "GraphQL",
      lastName: "isCool",
      email: "GraphQL@isCool.com"
    },
  ];

// typeDefs tell the GraphQL server what data to expect
// Notice the gql tag, this converts your string into GraphQL strings that can be read by Apollo
const typeDefs = gql`
  # GraphQL enables us to create our own types
  # Notice the "User" type matches the shape of our "database" 
  type User {
    firstName: String!
    lastName: String!
    email: String!
  }
  type Query {
    hello: String!
    randomNumber: Int!
    # This query is going to return all the users in our array
    # Since our "database" is an array containing objects, we need to create a "User" type
    # Brackets around the type indicates the query is returning an array
    queryUsers: [User]!
  }
  # Mutations must be in their own type
  type Mutation {
    # We are creating a mutation called "addUser" that takes in 3 arguments
    # These arguments will be available to our resolver, which will push the new user to the "users" array
    # Notice that this mutation will return a single User, which will be the one that was created
    addUser(firstName:String!, lastName:String!, email:String!): User!
  }
`;
// the Query type outlines all the queries that can be called by the client
// hello and randomNumber are the names of the queries
// The exclamation mark (!) tells Apollo Server that a result is required

// Here, we define two queries, one returns a String and another returns a Int

// When a query is called a resolver with the same name is run
// The API returns whatever is returned by the resolver
// We are using arrow functions so the "return" keyword is not required
const resolvers = {
    Query: {
      hello: () => "Hello world!",
      randomNumber: () => Math.round(Math.random() * 10),
      // queryUsers simply returns our users array
      queryUsers: () => users,
    },
    // All mutation resolvers must be in the Mutation object; just like our typeDefs
    Mutation: {
      // Once again notice the name of the resolver matches what we defined in our typeDefs
      // The first argument to any resolver is the parent, which is not important to us here
      // The second argument, args, is an object containing all the arguments passed to the resolver
      addUser: (parent, args) => {
        users.push(args); // Push the new user to the users array
        return args; // Returns the arguments provided, this is the new user we just added
      },
    },
  };

// Create an instance of ApolloServer and pass in our typeDefs and resolvers
const server = new ApolloServer({
  // If the object key and value have the same name, you can omit the key
  typeDefs,
  resolvers,
});

// Start the server at port 8080
server.listen({ port: 8080 }).then(({ url }) => console.log(`GraphQL server running at ${url}`));