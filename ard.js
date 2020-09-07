var express = require('express');
var http = require('http');
var xlsx = require('xlsx');
var app = express();
var path = require('path');
 
var book = xlsx.readFile('orgn.xlsx');
var FWSname = book.SheetNames[0];
var FWS = book.Sheets[FWSname];

var server = http.createServer(app);
server.listen(3000);

var td = new Date();
 
// 시리얼 포트 설정
// COM6 : 아두이노가 연결된 포트
var serialPort  = require('serialport');
// 아래 ####은 본인 아두이노의 시리얼 포트에 맞게 경로 입력하기
var com3 = new serialPort('COM3',{
    baudRate : 9600,
    // defaults for Arduino serial communication
    dataBits : 8,
    parity : 'none',
    stopBits: 1,
    flowControl: false
})
com3.on('open', function () {
    console.log('open serial communication');
})
 
 
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
 
app.get('/',function(req,res) {
    res.render(__dirname + '/views/controller.ejs', {tas: '12345'});
})

var na = new Array();
var nn = new Array();
var nt = new Array();

app.get('/test.ejs',function(req,res) {
    res.render(__dirname + '/views/test.ejs', {tad: na, taf: nn, tat: nt});
});

var hsa = '0';

app.get('/controller/:id',function(req,res){
    console.log(req.params.id);
    com3.write(req.params.id);
    
    let hours = td.getHours();

    hsa = req.params.id;

    if(hsa == 'On'){     
        na.push(1);
        nn.push("On");
        nt.push(hours);
        // i = i+1;       
    }else if(hsa == 'Off'){
        na.push(0);
        nn.push("Off");
        nt.push(hours);
    }
    console.log(na);
    console.log(nn);
    console.log(nt);
    console.log(hsa);

    var ard_result = xlsx.utils.json_to_sheet([
        {A: req.params.id, hours}
    ], {header: ['A'], skipHeader:true});
    ard_result["!cols"]=[{wpx: 10}];
    xlsx.utils.book_append_sheet(book, ard_result, "ard_result" )
    
    res.status(200).send('LED Controll OK!!');
})

xlsx.writeFile(book, 'export.xlsx');