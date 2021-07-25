const mongoose = require('mongoose');

// User라는 데이터는 어떤 key/value를 가지는지, 필수인지 등의 정보 
// DB 업데이트 전, 이 정보를 통해 mongoose가 형식에 맞는지 확인해 줌
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    name: {
        first: { type: String, required: true },
        last: { type: String }
    },
    age: Number,
    email: String
}, { timestamps: true });

// MongoDB compass _MONGOSH에서의 db처럼 User 이용할 수 있음 (DB의 CRUD 작업 가능)
const User = mongoose.model('user', UserSchema);
module.exports = { User };