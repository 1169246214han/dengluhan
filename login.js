/**
 * Created by lebovo on 2018/1/9.
 */
var mysql = require('mysql');
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var user = express.Router();

app.use(bodyParser.urlencoded({}));
app.use('/user',user)
//图片
app.use(multer({dest:'./images'}).any());

var pool = mysql.createPool({
    host:'127.0.0.1',
    user:'root',
    password:'1169246214h',

    port:3306
})


app.post('/images',function(req,res){
	var file = req.files[0]
	var oldname = file.filename
	var h = path.parse(file.originalname).ext
	var newname = file.filename+h
	fs.rename('./images/'+oldname,'./images/'+newname,function(err){
		if(err){
			console.log(err)
			return
		}
		res.send('/images/'+newname)
	})
})

//注册
user.post('/login',function(req,res){
    var user = req.body.user
    var pass = req.body.pass
    var img = req.body.img
    pool.getConnection(function(err,connection){
        if(err){
            console.log('connection::'+err)
            return
        }
        connection.query('select * from blog.logon where user=?',[user],function(err,data){
            if(err){
                console.log('mysql::'+err)
                return
            }
            if(data == ''){
                connection.query('insert into blog.logon(user,pass,img) values(?,?,?)',[user,pass,img],function(err,data){
                    if(err){
                        console.log('mysql::'+err)
                        return
                    }
                    res.send(data)
                })
            }else{
                res.send('用户名以存在')
            }

        })
    })

})

//登录
user.post('/login2',function(req,res){
    res.setHeader('Access-Control-Allow-Origin','*');
    var user = req.body.user;
    var pass = req.body.pass;
    pool.getConnection(function(err,connection){
        if(err){
            console.log('connection::'+err);
            return
        }
        connection.query('select * from blog.logon where user=?',[user],function(err,data){
            if(err){
                console.log('mysql::'+err)
                return
            }
            if(data == ''){
                res.send('用户名不存在')
            }else{
                if(data[0].pass == pass){
                    res.send('登录成功')
                }else{
                    res.send('用户名或密码不对')
                }
            }

        })
    })
})

//列表
user.post('/list',function(req,res){
    pool.getConnection(function(err,connection){
        if(err){
            console.log('connection：：'+err);
            return
        }
        var sql4 = 'select * from blog.list'
        connection.query(sql4,function(err,data){
            if(err){
                console.log('mysql：：'+err)
                return
            }
            res.send(data)
            connection.end()
        })
    })
})

//录入
user.post('/lu',function(req,res){
    var names = req.body.names
    var bookname = req.body.bookname
    var text = req.body.text
    var times = req.body.times

    pool.getConnection(function(err,connection){
        if(err){
            console.log('connection::'+err)
            return
        }
        connection.query('select * from blog.list where name=?',[names],function(err,data){
            if(err){
                console.log('mysql::'+err)
                return
            }
            if(data == ''){
                connection.query('insert into blog.list(name,bookname,text,time) values(?,?,?,?)',[names,bookname,text,times],function(err,data){
                    if(err){
                        console.log('mysql::'+err)
                        return
                    }
                    res.send(data)
                })
            }else{
                res.send('用户名以存在')
            }

        })
    })
})

//删除
user.get('/shan', function(req, res, next) {
    var uid=req.query.uid;
    pool.getConnection(function(err,connection) {
        if (err) {
            console.log('connection：：' + err);
            return
        }
        connection.query('DELETE FROM blog.list WHERE uid= ?',[uid], function (err,data) {
            res.header('Access-Control-Allow-Origin', "*");
            res.send('ok')
            connection.end()
        })
    })
});

//修改
user.get('/update',function(req,res){
    var uid = req.query.uid
    var name = req.query.name
    var bookname = req.query.bookname
    var text = req.query.text
    pool.getConnection(function(err,connection){
        if(err){
            console.log(err)
            return
        }
        var sql = 'update list set name=?,bookname=?,text=? where uid=?'
        connection.query(sql,[name,bookname,text],function(err,data){
            if(err){
                console.log('mysql::::::'+err)
                return
            }
            res.send('ok')
            connection.end()
        })
    })
})






app.use(express.static('./'))
app.listen(8000,function(){
    console.log('ok')
})