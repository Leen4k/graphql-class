import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import data from './_db.js';
import { typeDefs } from './schema.js';


const resolvers = {
    Query: {
        games() {
            return data.games
        },
        game(_,args) {
            return data.games.find(
                game => game.id === args.id
            )
        },
        reviews() {
            return data.reviews
        },
        review (_, args){
            return data.reviews.find(
                review => review.id === args.id
            )
        },
        authors() {
            return data.authors
        },
        author(_, args){
            return data.authors.find(
                author => author.id === args.id
            )
        }
    },
    Game : {
        reviews(parent){
            return data.reviews.filter(
               (r) => (
                r.game_id === parent.id
               ))
        }
    },
    Author : {
        reviews(parent){
            return data.reviews.filter(
                (r) => (
                 r.author_id === parent.id
                ))
        }
    },
    Review : {
        author(parent){
            return data.authors.find((a)=>(
                a.id === parent.author_id
            ))
        },
        game(parent){
            return data.games.find((g)=>(
                g.id === parent.game_id
            ))
        }
    },
    Mutation: {
        deleteGame(_,args){
            data.games = data.games.filter(
                (g) => (g.id !== args.id)
            )
            return data.games
        },
        addGame(_,args){
            let game = {...args.game, id:Math.floor(Math.random()*10000).toString()}
            data.games.push(game)
            return game
        },
        updateGame(_,args){
            data.games = data.games.map(
                (g) => {
                    if(g.id === args.id){
                        return {...g, ...args.edits}
                    }
                    return g
                }
            )
            return data.games.find((g)=>g.id === args.id)
        }
    }
}


const server = new ApolloServer({
    // type def are definition of different data that we wanna expose on the graph
    typeDefs,
    resolvers
    // resolvers 
})


const {url} = await startStandaloneServer(server, {
    listen: { port: 4000 }
})

console.log("server is running on port", 4000)