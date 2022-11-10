const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// スキーマ定義
const schema = buildSchema(`
    type RandomDie {
        numSides: Int!
        rollOnce: Int!
        roll(numRolls: Int!): [Int]
    }
    type Query{
        getDie(numSides: Int): RandomDie
    }
`);

class RandomDie {
    constructor(numSides){
        this.numSides = numSides;
    }

    rollOnce(){
        return 1 + Math.floor(Math.random() * this.numSides);
    }

    roll({numRolls}){
        let output = [];
        for (var i = 0; i < numRolls; i++){
            output.push(this.rollOnce());
        }
        return output;
    }
}

//リゾルバ関数
const root = {
    getDie:({numSides}) => {
        return new RandomDie(numSides || 6);
    }
    // rollDice:({numDice, numSides}) => {
    //     let output =[];
    //     for(var i = 0; i < numDice; i++){
    //         output.push(1 + Math.floor(Math.random()*(numSides ||6)));
    //     }
    //     return output;
    // }
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


//test query　ここは、GraphQL 上記 endpointで打つところ
// query{
// 	getDie(numSides:3){
//     numSides
//     rollOnce
//     roll(numRolls:5)
//   }
// }