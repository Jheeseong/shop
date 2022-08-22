const express = require('express'); // express 임포트
const app = express(); // app생성
const port = 3000;
const cookieParser = require('cookie-parser')

const { User } = require('./models/User');

const { auth } = require('./middleware/auth');

const config = require('./config/key');

const bodyParser = require("body-parser"); //body-parser 사용

app.use(bodyParser.urlencoded({ extended: true })); //application/x-www-form-urlencoded 로 된 데이터를 분석해서 가져올 수 있게 한다
app.use(bodyParser.json()); //application/json 타입으로 된 데이터를 분석해서 가져올 수 있게 한다 -> json형식으로 파싱
app.use(cookieParser())

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

app.get('/', function (req, res) {
  res.send('hello world!!');
});

app.post("/api/users/register", (req, res) => {
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

app.post('/api/users/login',(req,res) =>{
    // 요청된 이메일을 DB에 있는지 확인
    User.findOne({email: req.body.email }, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }

        //요청된 이메일이 DB에 있다면 비밀번호가 맞는 비밀번호인지 확인

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})

            //비밀번호까지 맞다면 토큰 생성
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);

                //토큰을 쿠키, 로컬스토리지에 저장
                res.cookie("x_auth", user.token)
                    .status(200)
                    .json({loginSuccess: true, userId: user._id})
            })
        })
    })
})

app.get('/api/users/auth', auth , (req,res) => {

    // 여기까지 미들웨어를 통과했다는 것은 Authentication 이 true라는 말
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false: true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role
    })
})

app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id},
        { token: ""}
    , (err, user) => {
        if (err) return res.json({ success: false, err});
        return res.status(200).send({
            success: true
        })
        })
})