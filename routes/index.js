const express = require('express'); // express 임포트
const app = express(); // app생성
const port = 3000;

const { User } = require('./models/User');

const config = require('./config/key');

const bodyParser = require("body-parser"); //body-parser 사용

app.use(bodyParser.urlencoded({ extended: true })); //application/x-www-form-urlencoded 로 된 데이터를 분석해서 가져올 수 있게 한다
app.use(bodyParser.json()); //application/json 타입으로 된 데이터를 분석해서 가져올 수 있게 한다 -> json형식으로 파싱

app.get('/', function (req, res) {
  res.send('hello world!!');
});

app.post("/register", (req, res) => {
    const user = new User(req.body);
    user.save((err, userInfo) => {
        //MongoDB에서 오는 Method, 정보들이 User model에 저장
        //저장 할 때 err가 있다면 client에 err가 있다고 전달 -> 전달을 할 때 json 형식으로 전달
        if (err) return res.json({ success: false, err })
        // 성공했을시에는 status 200 -> json 형식으로 정보 전달
        return res.status(200).json({
            success: true,
            userInfo,
        })
    })
})

app.listen(port, () => console.log(`${port}포트입니다.`));

// 몽구스 연결
const mongoose = require('mongoose');
mongoose
    .connect(config.mongoURI, {
          // useNewUrlPaser: true,
          // useUnifiedTofology: true,
          // useCreateIndex: true,
          // useFindAndModify: false,
    })
    .then(() => console.log('MongoDB conected'))
    .catch((err) => {
      console.log(err);
    });