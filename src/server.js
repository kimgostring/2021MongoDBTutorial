const express = require('express'); 
const app = express();
const mongoose = require('mongoose');
const config = require('./config');
const { User } = require('./models/User');

const port = 3000;

const server = async () => {
    try {
        // DB가 먼저 연결된 뒤 요청 받아야 함 (mongoose 연결 완료된 뒤 포트 수신 해야 함)
        await mongoose.connect(config.MONGO_URL, 
            // 설정 객체 (옵션), mongoose 연결 시마다 뜨는 DeprecationWarning 제거해줌
            { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
        console.log('MongoDB connected');
        
        // body parser
        app.use(express.json());

        // 모든 유저를 배열로 불러오는 API
        app.get('/users', async (req, res) => {  
            try {
                const users = await User.find();
                res.status(200).send({ success: true, users });
            } catch(err) {
                return res.status(500).send( { err: err.message });
            }
        });

        // 특정 유저를 불러오는 API
        app.get('/users/:userId', async (req, res) => {
            try {
                const { userId } = req.params;
                if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ err: 'invalid user id.' })

                const user = await User.findOne({ _id: userId });
                res.status(200).send({ success: true, user })
            } catch(err) {
                return res.status(500).send( { err: err.message });
            }
        });

        // 특정 유저를 삭제하는 API
        app.delete('/users/:userId', async (req, res) => {
            try {
                const { userId } = req.params;
                if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ err: 'invalid user id.' })

                // deleteOne() : 검색된 유저 불러오지 않고 바로 삭제, 유저 정보 필요 없는 경우 더 효율적
                // findOneAndDelete() : 삭제한 문서 리턴, 일치하는 것이 없는 경우 null 리턴
                const user = await User.findOneAndDelete({ _id: userId });
                res.status(200).send({ success: true, user })
            } catch(err) {
                return res.status(500).send( { err: err.message });
            }
        });

        app.post('/users', async (req, res) => {
            try {
                // 구조 분해 할당
                let { username, name } = req.body;
                    // 아래와 동일한 구문
                    // let username = req.body.username
                    // let name = req.body.name
                // required: true인 username, name.first가 제대로 들어왔는지 확인
                if (!username) return res.status(400).send({ err: 'username is required. '});
                if (!name || !name.first) return res.status(400).send({ err: 'first name is required.' });

                const user = new User(req.body); // 유저 문서 인스턴스를 mongoose로 생성
                await user.save(); // mongoose에서 제공하는 함수를 통해 해당 문서를 DB에 저장
                res.status(200).send({ success: true, user });  
            } catch(err) {
                return res.status(500).send({ err : err.message }); // server error
                // err.message, 오류 발생 스택 부분은 빼고 오류 메세지만 보낼 수 있음
            }
        })

        app.listen(port, () => {
            console.log(`server listening on port ${port}`);
        });
    } catch (err) {
        console.log(err);
    }
};

server();