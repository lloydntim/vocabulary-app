!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=4)}([function(e,t){e.exports=require("mongoose")},function(e,t){e.exports=require("apollo-server-express")},function(e,t){e.exports=require("express")},function(e,t){e.exports=require("node-xlsx")},function(e,t,n){e.exports=n(5)},function(e,t,n){"use strict";n.r(t);var r=n(1),o=n(2),i=n.n(o),s=n(0),a=n.n(s);var u=new s.Schema({name:{type:String,required:!0,unique:!0},data:[String]},{collection:"list"}),d=a.a.model("List",u),c=n(3),l=n.n(c);const p=(e,t)=>{const{id:n,name:r}=t;return n?d.findById(n):d.findOne({name:r})},f=()=>d.find({}),m=(e,t)=>t.input.file.then(e=>(e.createReadStream().on("data",e=>{const n=l.a.parse(e);d.create({name:t.input.name,data:n.data})}).on("end",()=>{console.log("CSV file successfully processed")}),e)).catch(e=>{console.log("error",e)}),g=(e,t)=>{const{id:n,input:r}=t;return d.findByIdAndUpdate(n,{$set:r},{new:!0})},y=(e,t)=>d.findOneAndRemove({_id:t.id});const L=r.gql`
  input ListInput {
    name: String
    file: Upload
  }
  
  type List {
    id: ID
    name: String
  }
  
  type Query {
    getList(id: ID, name: String) : List
    getLists: [List]
  }
  
  type Mutation {
    addList(input: ListInput): List
    updateList(id: ID, input: ListInput): List
    removeList(id: ID): List
  }
`,v={Query:{getList:p,getLists:f},Mutation:{addList:m,updateList:g,removeList:y}},b=new i.a;new r.ApolloServer({typeDefs:L,resolvers:v,formatError:e=>{throw Error(e.message)}}).applyMiddleware({app:b,path:"/graphql"}),b.listen(3e3,()=>console.log("app Server is now running on http://localhost:3000")),a.a.connect("mongodb://admin:admin12@ds259738.mlab.com:59738/heroku_1283rdnq"),a.a.connection.once("open",()=>{console.log("Database connected")})}]);