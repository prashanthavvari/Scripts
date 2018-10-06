import re
import urllib2

def getBrokenLinks():
    for x in urls:
        url = x.strip()
        if x[:4] != 'http':
            url = globalURL + x
        try:
            if ('host' in url or 'localhost' in url):
                if choice != 1 and url[:5] != 'http:':
                    urllib2.urlopen((url.strip()).strip('\n'))
                else:
                    urllib2.urlopen((url.strip()).strip('\n'))

        except urllib2.HTTPError, e:
            print str(e.code) + ' 1 error ' + url

        except urllib2.URLError, e:
            print str(e.args) + ' URL error ' + url

print "(1)File input or (2)Manual Input"
file_manual = int(raw_input())
if file_manual == 2:
    print "Give url list each seperated by ','."
    urlist = raw_input().split(',')
else:
    print "Give the exact File Path"
    filePath = raw_input()
    file = open(filePath, 'r+').read()
    urlist = file.split(',')
    print urlist

print "Enter the relative number:\n1->Development\n2->Localhost\n3->IDC"
choice = int(raw_input())
if choice == 1:
    print "Please enter port no"
    port = raw_input()
    globalURL = 'http://localhost:' + port
elif choice == 2:
    globalURL = "https://localhost.com/"
else:
    globalURL = "https://host.com/"
for url in urlist:
    url = (url.strip()).strip('\n')
    website = urllib2.urlopen(url)
    html = website.read()
    urls = re.findall(r'href=[\'"]?([^\'" >]+)', html)
    getBrokenLinks()
