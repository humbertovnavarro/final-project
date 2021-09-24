# KamaiiTV
## A web application for content creators who want to share their live video content
I wanted to build this project to create a platform for smaller communities, which are often neglected by twitch.
# Live Link
https://kamaii.tv
# Technologies used
NGINX, Express, socket.io, PostgreSQL, Sharp, Shaka Player
# Features
* Live streaming to the browser
* Chatting with users aside the stream
* Uploading Profile Pictures
* Streaming to your channel using OBS

# Stretch Features
* Moderate your channel by banning users and moderating users
* Edit your profile using markdown
* Bot API to chat, and perform administrative actions
# Dependencies
A domain name and SSL Certificates installed by certbot
See https://certbot.eff.org/lets-encrypt/debianbuster-other
# Getting Started
* Clone the repository from GitHub into a users home directory (kamaii)
* Modify nginx.example.conf to match your domain name and your username
* do `npm run setup` to setup NGINX with custom RTMP Module
* Wait for compile to finish
* Change permissions of /server/public/live so that the user running express can access it 
`chmod -R 777 /server/public/live`
* Do `npm run start` as a user with sudo permissions, or setup your own startup script to run NGINX as root, and express as your user.
