import os,sys
print 'Folder Path:'
pathVal = 'content/'

def derivedTypePath(pathVal):
    derivedPath = pathVal[pathVal.index('content/') + 8:]
    typePath = 'type: ' + '"' + derivedPath + 'index/' + '"' + '\n'
    return typePath

def derivedURLPath(pathVal):
    return 'url: ' + '"/' + pathVal[pathVal.index('content/') + 8:] + '"' + '\n'


def createIndexFolder(pathVal, isModified, modifiedContent):
    pathVal = pathVal+'index/'
    #print 'Creating index folder for', pathVal
    if not os.path.exists(pathVal):
        os.makedirs(pathVal)
    files = open(pathVal + 'index.md', 'w+')
    if not isModified:
        derivedPath = derivedTypePath(pathVal)
        url = derivedURLPath(pathVal)
        files.write('---\n' + url + '---')
        files.close()
    else:
        files.write(modifiedContent)
        files.close()


def modifyContent(content, pathVal):
    lines = []
    eachLine = ''
    checkForUrl = 0
    checkForType = 0
    content+= '\n'
    for letter in content:
        eachLine += letter
        if letter == '\n':
            lines.append(eachLine)
            eachLine = ''
    for index in range(len(lines)):
        if 'type:' in lines[index]:
            checkForType = index
            # lines[index] = derivedTypePath(pathVal)
            # break
        if 'url:' in lines[index]:
            checkForUrl = index
            urlIndex = lines[index].index('url')
            lines[index] = lines[index][:urlIndex] + derivedURLPath(pathVal)
    if checkForUrl == 0:
        lines[checkForType] += derivedURLPath(pathVal)
    return ''.join(lines)


def removeIndexFiles(pathVal):
    modifiedContent = ''
    ishtml = 'index.html'
    if os.path.exists(pathVal+'index.md'):
        ishtml = 'index.md'

    if os.path.exists(pathVal+ishtml):
        removedIndexFile = open(pathVal + ishtml, 'r+')
        insideContent = removedIndexFile.read()
        removedIndexFile.close()
        modifiedContent = modifyContent(insideContent, pathVal)
        isModified = True
        os.remove(pathVal + ishtml)
    else:
        isModified = False
    #print ishtml, 'file has been removed from', pathVal, '\n'
    createIndexFolder(pathVal, isModified, modifiedContent)

def checkDirectory(pathVal):
    if os.path.isdir(pathVal):
        directory = os.listdir(pathVal)
        #print 'Available directories for removing', directory
        if ('index.md' in directory or 'index.html' in directory) and len(directory) != 1:
            removeIndexFiles(pathVal)
        # elif len(directory) == 1:
        #     print 'No changes needed'
    else:
        print pathVal, 'is not a Directory, cannot be processed'

def mainFunction(pathVal):
    directories = os.listdir(pathVal)
    checkDirectory(pathVal)
    directories = os.listdir(pathVal)
    for x in directories:
        subPath = pathVal + x + '/'
        if os.path.isdir(subPath) and subPath[len(subPath)-6 : len(subPath)] != 'index/':
            mainFunction(subPath)

if os.path.exists(pathVal):
    mainFunction(pathVal)
    print 'Finished'
else:
    print 'Not a directory'
