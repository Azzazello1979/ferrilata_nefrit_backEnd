let sha256 = require('sha256'); // npm install sha256

let reqdotBodydotPassword = 'Area51' // req.body.password
let salt = 'MindenSzipiSzuper' // PUT IT IN DOTENV FILE

const password = sha256(`${reqbodypassword}${salt}`) // HASH & SALT password

console.log(password);
const tryout = sha256(`${reqbodypassword}${salt}`)
console.log(password == tryout)