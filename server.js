const http  = require('http');
const fs    = require('fs');
const sudo  = require('sudo-js');
const formidable = require('formidable');


const password = "pwd";

var NumberOfFiles = 0;
var FilesReceived = 0;

sudo.setPassword(password);

// Reading the file that has to be displayed
fs.readFile('./index.html', function(err, data) {
    if (err){
        throw err;
    }
    htmlFile = data;
});

fs.readFile('./styles.css', function(err, data) {
    if (err){
        throw err;
    }
    cssFile = data;
});

fs.readFile('./upload.js', function(err, data) {
    if (err){
        throw err;
    }
    javascriptFile = data;
});

// Server creation
var server = http.createServer(function(req, res) {

  // GET methode -> User wants something (html, css, etc..)
    if(req.method === "GET") {
        // Serves different pages depending on what whants the client
        switch (req.url) {
            case "/upload.js" :
                res.writeHead(200, {"Content-Type": "application/js"});
                res.write(javascriptFile);
                res.end();
                break;
            case "/styles.css" :
                res.writeHead(200, {"Content-Type": "text/css"});
                res.write(cssFile);
                res.end();
                break;
            case "/" :
                res.writeHead(200, {"Content-Type": "text/html"});
                res.write(htmlFile);
                res.end();
                break;
            default :
                break;
    }
    // POST METHOD when user want to send something
    } else if(req.method === "POST") {
    // CHECK IF USER WANTS TO UPLOAD
        if (req.url === "/upload") {
            if(req.headers['numberoffiles']){
                NumberOfFiles = req.headers['numberoffiles'];
                console.log("Unmounting USB to upload new files..");
                UnmoutUSB();
            }
            else{
                var form = new formidable.IncomingForm();

                form.parse(req, function (err, fields, files) {
                    if(err) throw err;
    
                    console.log("Uploading " + files.file.name);
    
                    fs.readFile(files.file.path, function(err, data){
                        if(err) throw err;

                        var fileName = files.file.name;
                        var directory = '/mnt/usb_share/';

                        fs.writeFile(directory + fileName, data, function(err){
                            if(err) throw err;  
                            console.log('File ' + fileName + ' was successfully saved.');
                        });
                        
                    });
                    FilesReceived++; 
                    if(FilesReceived == NumberOfFiles){
                        console.log("Mounting USB back..");  
                        MountUSB();
                        FilesReceived = 0;
                        NumberOfFiles = 0;
                    }   
                });
            }   
        }
    }
});
server.listen(8081);

console.log('Server running at http://localhost:8081/');

function MountUSB(){
    // Bash command to remount the USB
    var command = ['modprobe', 'g_mass_storage', 'file=/piusb.bin', 'stall=0', 'ro=1'];
    sudo.exec(command, function(err, pid, result){
        console.log(result);
    });
}

function UnmoutUSB(){
    // Bash command to unmount the USB
    var command = ['modprobe', '-r', 'g_mass_storage'];
    sudo.exec(command, function(err, pid, result){
        console.log(result);
    });
}
