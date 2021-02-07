const { shell } = require('electron')
const applescript = require('applescript');

const scripts = `to randomChars(theSize)
set theList to {"0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"}
set theResult to "" as string

repeat with theIndex from 1 to theSize
  set theChar to some item of theList
  set theResult to theResult & theChar
end repeat

return theResult
end randomChars

to currentMAC()
return do shell script "ifconfig en0 ether | grep ether | cut -f2 -d' '"
end currentMAC

set previousMAC to currentMAC()

set interface to "en0"

repeat while previousMAC is equal to currentMAC()
set mac to randomChars(2) & ":" & randomChars(2) & ":" & randomChars(2) & ":" & randomChars(2) & ":" & randomChars(2) & ":" & randomChars(2)
do shell script "sudo ifconfig en0 ether " & mac & " > /dev/null" with administrator privileges
end repeat

set query to "MAC address of " & interface & " is " & mac`


const exec = (script) => applescript.execString(script, (err, rtn) => {
  if (err) {
    // Something went wrong!
  }
  if (Array.isArray(rtn)) {
    for (const songName of rtn) {
      console.log(songName);
    }
  }
});

window.exports = {
  'spoof': {
    mode: 'list',
    args: {
      enter: (action, callbackSetList) => {
        callbackSetList([
          {
             title: '修改MAC地址',
             description: '修改MAC地址',
          },
        ])
     },
      select: (action) => {
        window.utools.hideMainWindow()
        exec(scripts)
        window.utools.outPlugin()
      }
    }
  }
}