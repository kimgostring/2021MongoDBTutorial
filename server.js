const express = require('express'); 
const app = express();
const mongoose = require('mongoose');
const config = require('./config');

const port = 3000;
const users = [];

const server = async () => {
    try {
        // DB가 먼저 연결된 뒤 요청 받아야 함 (mongoose 연결 완료된 뒤 포트 수신 해야 함)
        await mongoose.connect(config.MONGO_URL, 
            // 설정 객체 (옵션), mongoose 연결 시마다 뜨는 DeprecationWarning 제거해줌
            { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('MongoDB connected');
        
        // body parser
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
    } catch (err) {
        console.log(err);
    }
};

server();