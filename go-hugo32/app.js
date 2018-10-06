const fs = require('fs');
const process = require('process');
let pathVal = '/Users/prashan-5380/Home/web/zohobooks/workspace/zohobooks_website/content/';


function getDirListing(pathVal) {
  let filesMap = [];
  let fileMap = fs.readdirSync(pathVal, (err, files) => {
    files.forEach(fileName => {
      filesMap.push(fileName);
    });
    return filesMap;
  });
  return fileMap;
}

function derivedTypePath(pathVal) {
  let derivedPath = pathVal.substr(pathVal.indexOf('content/') + 8, pathVal.length);
  let typePath = 'type: ' + '"' + derivedPath + 'index/' + '"' + '\n';
  return typePath;
}
function derivedURLPath(pathVal) {
  return 'url: ' + '"' + pathVal.substr(pathVal.indexOf('content/') + 8, pathVal.length) + '"' + '\n';
}

function createIndexFolder(pathVal, isModified, modifiedContent) {
  let pathVals = pathVal + 'index/';
  if (!fs.existsSync(pathVals)) {
    fs.mkdirSync(pathVals);
  }
  let fd = fs.openSync(pathVals + 'index.md', 'w+');
  if (!isModified) {
    let derivedPath = derivedTypePath(pathVals);
    let url = derivedURLPath(pathVals);
    fs.writeFileSync(fd, Buffer.from('---\n' + url + '---'));
    fs.closeSync(fd);
    // console.log('modifed succesfully 1');
  } else {
    let buffer = new Buffer(modifiedContent);
    // console.log(modifiedContent);
    fs.writeFileSync(fd, buffer);
    fs.closeSync(fd);
    // console.log(modifiedContent);
    // console.log('modifed succesfully 2');
  }
}

function removeIndexFiles(pathVal) {
  let modifiedContent = '';
  let ishtml = 'index.html';
  let removedIndexFile;
  let insideContent;
  let isModified;

  if (fs.existsSync(pathVal + 'index.md')) {
    ishtml = 'index.md';
  }
  try {
    insideContent = fs.readFileSync(pathVal + ishtml).toString()+'\n';
    // console.log(insideContent);
    modifiedContent = modifyContent(insideContent, pathVal);
    isModified = true;
    // console.log(pathVal + ishtml, 'is deleted');
    fs.unlinkSync(pathVal+ishtml)
  } catch(err) {
    isModified = false;
    console.log(err);
  }
  // console.log(modifiedContent);
  createIndexFolder(pathVal, isModified, modifiedContent);
  // console.log(ishtml);
  // console.log(insideContent);
}
function modifyContent(content, pathVal) {
  let lines = [];
  eachLine = '';
  checkForUrl = 0;
  checkForType = 0;
  let menuLine = -1;
  // content.forEach((letter) => {
  //   eachLine+=letter;
  //   if (letter === '\n') {
  //     lines.push(eachLine);
  //     eachLine = '';
  //   }
  // });
  for (let i = 0; i < content.length; i++) {
    eachLine+= content[i];
    if (content[i] === '\n') {
      lines.push(eachLine);
      eachLine = '';
    }
  }
  for (let i = 0; i < lines.length; i++) {
    if(lines[i].includes('menu')) {
      menuLine = i;
    }
    if (lines[i].includes('type:')) {
      checkForType = i;
    }
    if (lines[i].includes('url:')) {
      checkForUrl = i;
      if (menuLine > checkForUrl) {
        lines[i] = derivedURLPath(pathVal);
      }
    }
  }
  if (checkForUrl === 0) {
    lines[checkForType] += derivedURLPath(pathVal);
  }
  // console.log(lines.join(''));
  // console.log(lines);
  return lines.join('');
}



function checkDirectory(pathVal) {
  if (fs.existsSync(pathVal)){
    if (fs.statSync(pathVal).isDirectory()) {
      dirs = getDirListing(pathVal);
      // console.log(dirs);
      let indexHTML = dirs.includes('index.html');
      let indexMD = dirs.includes('index.md');
      if ((indexHTML || indexMD) && dirs.length !== 1){
        // console.log('index.html or index.md is present', dirs.length);
        removeIndexFiles(pathVal);
      }
    }
  }
}

function mainFunction(pathVal) {
  let directories = getDirListing(pathVal);
  // console.log(pathVal);
  checkDirectory(pathVal);
  directories = getDirListing(pathVal);
  for (let i = 0; i < directories.length; i++) {
    let subPath = pathVal + directories[i] + '/';
    if (fs.existsSync(subPath)) {
      if (fs.statSync(subPath).isDirectory() && subPath.substr((subPath.length - 6), subPath.length) != 'index/') {
        // console.log(subPath);
        mainFunction(subPath);
      }
    }
  }
}
mainFunction(pathVal);
