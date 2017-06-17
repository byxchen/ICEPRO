ICEProject
# ICEPRO

# How to run

Go to Math_Chat/chatRoom-master/public/app/js/app.js

Find your IP address

Replace $rootScope.baseUrl and $socketProvider.setConnectionUrl to your own IP (don't remove https:// etc.)

cd Math_Chat/chatRoom-master/
(You might need to install node and bower)
npm install
bower install
node app.js

Navigate to 
localhost:8000
or 
your-ip:8000

Things that work in this older version:
- Nickname
- Background color of avatars
- Photo attachments
- Camera attachments
- Photo viewing downloading/etc.
- MathJax sending
- Normal chatroom functionality 
- BETA Emoji keyboard

Things that are buggy in this older version:
- Nicknames sometimes go off-screen (fixed)
- Emoji keyboard isn't on the bottom (fixed)
- The editor isn't linked to the chat (fixed)
