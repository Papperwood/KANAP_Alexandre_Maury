const item = { a : 1 ,b : 2 ,c : 3 }
// const {a,b,c} = item 
// console.log(a)
function f({a,b,c}){
    console.log(b)
}
f(item)