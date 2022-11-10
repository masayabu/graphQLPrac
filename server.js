const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// スキーマ定義
const schema = buildSchema(`
    type Query{
        rollDice(numDice: Int!, numSides: Int): [Int]
    }
`);

//リゾルバ関数
const root = {
    rollDice:({numDice, numSides}) => {
        let output =[];
        for(var i = 0; i < numDice; i++){
            output.push(1 + Math.floor(Math.random()*(numSides ||6)));
        }
        return output;
    }
    // quoteOfTheDay:()=>{
    //     return Math.random() < 0.5 ? 'Take it easy':'Salvation lies within';
    // },
    // random:() => {
    //     return Math.random();
    // },
    // rollThreeDice:() =>{
    //     return[1,2,3].map((_) => 1 + Math.floor(Math.random() * 6));
    // },
    
    //hello: ()=> {
    //    return 'Hello world!';
    //},
};

const app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');
