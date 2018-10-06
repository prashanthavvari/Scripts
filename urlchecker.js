module.exports = function(){
  return function() {
    const fs = require('fs');
    const { execSync } = require('child_process');
    const { exec } = require('child_process');
    const publicFolder = process.cwd()+'/public/';
    const requestHTTP = require('sync-request');
    const htmlRegex = new RegExp('href='+ '"([^\\'+ '\'' + '\\"]+)', 'g');
    const { log } = console;
    const Set = require('Set');
    let failedURLS = '';
    let currentDir = process.cwd();
    let exclude = ['.DS_Store'];
    let urls = '';

    if(execSync('hugo')) {
      log('Hugo executed');
    }
    function formatURLS(content=[]) {
      if (content) {
        for (let i = 0; i < content.length; i++) {
          let url = content[i];
          url = url.slice(6, url.length) + '\n';
          urls += url;
        }
      }
    }
    function listURLS(file) {
      let content = fs.readFileSync(file).toString();
      let list = content.match(htmlRegex);
      formatURLS(list);
    }

    function getDirListing(pathVal) {
      let fileMap = fs.readdirSync(pathVal, (err, files) => {
        return files;
      });
      return fileMap;
    }
    function iterateFolders(pathVal) {
      let dirList = getDirListing(pathVal);
      for (let i = 0; i < dirList.length; i++) {
        let path = pathVal+dirList[i];
        if (!exclude.includes(dirList[i])) {
          if (fs.statSync(path).isDirectory()) {
            iterateFolders(path+'/');
          } else {
            listURLS(path);
          }
        }
      }
    }
    let params = process.argv[2];
    if(params) {
      let folders = process.argv[2].split(',');
      folders.forEach((folder) => iterateFolders(publicFolder+folder+'/'));
    } else {
      iterateFolders(publicFolder);
    }
    function skipPing(url) {
      if (currentDir.includes('host')) {
        return url.indexOf('/help/') === -1 && url.indexOf('/kb/') === -1;
      } else if (currentDir.includes('host')) {
        return url.indexOf('/help/') !== -1 || url.indexOf('/kb/') !== -1 || url.indexOf('/gst/') !== -1 || url.indexOf('/vat/') !== -1;
      }
    }

    function pingURLS(port) {

      port= port.trim();
      log('ping started');
      urls = new Set(urls.split('\n')).toArray();
      log( typeof (urls) );
      urls.forEach((url)=> {
        if (url.indexOf('http') === -1 && url.indexOf('/localhost')!==-1 && url.indexOf('..') === -1 && skipPing(url) && url.indexOf('.css') === -1 && url.indexOf('.js') === -1) {
          if (url[0] !== '/') {
            url = '/' + url;
          }
          let r = requestHTTP('GET', port+url);
          if (r.statusCode !== 200) {
            failedURLS+=url+'\n';
          }
        }
      });
      writeToFile();
    }
    function writeToFile() {
      let f = fs.openSync('urls.txt', 'w+');
      fs.writeFileSync(f, failedURLS);
      fs.closeSync(f);
      log('completed');
    }
    let ts = exec('hugo server');
    ts.stdout.on('data', (data) => {
      log(data);
      if(data.includes('Press Ctrl+C to stop')) {
        let x = data.indexOf('http://localhost:');
        log('Server started' + data.slice(x, x+21));
        pingURLS(data.slice(x, x+21));
        log('\nPress Ctrl+C to stop');
      }
    });
  };
};
