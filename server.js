const express = require('express'); 
const app = express();
const port = 3000;

const users = [];

app.use(express.json());

// method : get, endpoint : /users, function(req, res) : 콜백, /users에 접근 시 실행되는 함수
// req : client -> server로 넘어온 request body, header, URL 등 정보
// res : servr -> client로 리턴된 모든 정보
app.get('/users', function(req, res) {  
    // res.send 함수를 통해 client로 리턴할 정보 넘길 수 있음
    res.send({ users: users });
});

app.post('/users', function(req, res) {
    // JS 문법, 배열에 새 원소 추가할 때 사용 
    users.push({ name: req.body.name, age: req.body.age });
    // 중복 send 방지 위해 리턴해주는 것이 좋음 
    res.send({ success: true });
})

app.listen(port, function () {
    console.log(`server listening on port ${port}`);
});