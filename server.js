const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// スキーマ定義
const schema = buildSchema(`
input MessageInput {
    content: String
    author: String
}

type Message {
    id: ID!
    content: String
    author: String
}

type Query {
    getMessage(id: ID!): Message
}

type Mutation {
    createMessage(input: MessageInput): Message
    updateMessage(id: ID!, input: MessageInput): Message
}
`);

class Message {
    constructor(id, {content,author}){
        this.id = id;
        this.content = content;
        this.author = author;
    }
}

// データ入れ物
let fakeDatabase = {};


// class RandomDie {
//     constructor(numSides){
//         this.numSides = numSides;
//     }

//     rollOnce(){
//         return 1 + Math.floor(Math.random() * this.numSides);
//     }

//     roll({numRolls}){
//         let output = [];
//         for (var i = 0; i < numRolls; i++){
//             output.push(this.rollOnce());
//         }
//         return output;
//     }
// }

//リゾルバ関数
const root = {
    getMessage:({id}) => {
        if(!fakeDatabase[id]){
            throw new Error('no message exists with id ' + id);
        }
        return new Message(id, fakeDatabase[id]);
    },
    createMessage:({input}) => {
        //ランダムID生成
        var id = require('crypto').randomBytes(10).toString('hex')

        fakeDatabase[id] = input;
        return new Message(id, input);
    },
    updateMessage: ({id, input}) => {
        if(!fakeDatabase[id]){
            throw new Error('no message exists with id ' + id);
        }
        
        //古いデータ置き換え
        fakeDatabase[id] = input;
        return new Message(id, input);
    },
    // getDie:({numSides}) => {
    //     return new RandomDie(numSides || 6);
    // }
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

// mutation{
//     createMessage(input:{
//       author:"Simmo"
//       content:"こんにちは！"
//     }){
//       id
//       author
//       content
//     }
//   }

//登録を確認
// query{
//     getMessage(id:"c2212d8b9869ce3a02a4")
//     {
//       id
//       author
//       content
//     }
//   }
