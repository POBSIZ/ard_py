var express = require('express');
var http = require('http');
var xlsx = require('xlsx');
var Excel = require('exceljs');
var app = express();
var path = require('path');
var server = http.createServer(app);
var port = 2393
server.listen(port);

console.log('sever is open at '+ port);

// 시리얼 포트 설정
// COM6 : 아두이노가 연결된 포트
// var serialPort  = require('serialport');
// // 아래 ####은 본인 아두이노의 시리얼 포트에 맞게 경로 입력하기
// var com3 = new serialPort('COM3',{
//     baudRate : 9600,
//     // defaults for Arduino serial communication
//     dataBits : 8,
//     parity : 'none',
//     stopBits: 1,
//     flowControl: false
// })
// com3.on('open', function () {
//     console.log('open serial communication');
// })
 
 
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
 
app.get('/',function(req,res) {
    res.render(__dirname + '/views/controller.ejs', {tas: '12345'});
})

app.get('/main.css', (req, res)=>{
    res.sendFile(__dirname+'/views/main.css')
})

var na = new Array();
var nn = new Array();
var nt = new Array();
var hsa = '0';


var i = 1;
var book = xlsx.readFile('ORGN.xlsx');
var FWSname = book.SheetNames[0];
var FWS = book.Sheets[FWSname];
var ard_result;

// let Cell_time = FWS['A'+i];
// let Cell_switch = FWS['B'+i];

// var workbook = new Excel.Workbook();
// var worksheet = workbook.addWorksheet('test');
// var Cell_time = worksheet.getCell('A'+i).value;
// var Cell_switch = worksheet.getCell('B'+i).value;

app.get('/test.ejs',function(req,res) {
    res.render(__dirname + '/views/test.ejs', {tad: na, taf: nn, tat: nt});
});

app.get('/controller/:id',function(req,res){
    // com3.write(req.params.id);
    hsa = req.params.id;
    var td = new Date();
    let hours = td.getHours();
    let min = td.getMinutes();
    var time = hours+':'+min;

    if(hsa == 'O'){     
        na.push(1);
        nn.push("On");
        nt.push(time);   
    }else if(hsa == 'X'){
        na.push(0);
        nn.push("Off");
        nt.push(time);
    }else if(hsa == 'L'){ 
        nn.push("LCD");
        nt.push(time);        
    }else if(hsa == 'A'){ 
        nn.push("A");
        nt.push(time);
    }else if(hsa == 'B'){ 
        nn.push("B");
        nt.push(time);
    }else if(hsa == 'C'){ 
        nn.push("C");
        nt.push(time);
    }else if(hsa == 'D'){ 
        nn.push("D");
        nt.push(time);
    }

    console.log(nn);
    console.log(nt);
       
    // for(i=i; i<nn.length; i++){
    //     Cell_time = nt[i];
    //     Cell_switch = nn[i];
    // }
    // workbook.xlsx.writeFile('export.xlsx');
    

    ard_result = xlsx.utils.json_to_sheet([
        {A: req.params.id, time}
    ], {header: ['A'], skipHeader:true});
    ard_result["!cols"]=[{wpx: 10}];

    xlsx.utils.book_append_sheet(book, ard_result)//, FWSnam)
    // xlsx.writeFile(book, 'export.xlsx');
    
    res.status(200).send('LED Controll OK!!');
})

app.get('/saveExcel', function(req, res){
    xlsx.writeFile(book, 'export.xlsx');
});

app.get('/clear_arr', (req, res)=>{
    na = new Array();
    nn = new Array();
    nt = new Array();
    console.log("clear!")
})