# KamaiiTV
## A web application for content creators who want to share their live video content
I wanted to build this project to create a platform for smaller communities, which are often neglected by twitch.
# Live Link
https://kamaii.tv
# Technologies used
* Front-End client constructed with <b>React</b>
* RTMP Streaming using <b>NGINX</b> RTMP Module
* Backend API using <b>Express</b>
* Real time messaging using <b>socket.io</b>
* Backend Database utilizing <b>PostgreSQL</b>
* Image resizing and processing using <b>Sharp</b>
* DASH Protocol video consumption using <b>Shaka Player React</b>
# Features
* Live streaming to the browser
* Chatting with users aside the stream
* Uploading Profile Pictures
* Streaming to your channel using OBS
* Custom chat colors

## Chatting using socket.io
https://user-images.githubusercontent.com/16251746/134731396-bf0614a7-7929-4bf3-957b-4143002f9534.mp4

## Streaming using OBS
https://user-images.githubusercontent.com/16251746/134732084-e21ffe70-3fe8-4b0d-9e82-622b09c688a4.mp4

# Stretch Features
* Moderate your channel by banning users and moderating users
* Edit your profile using markdown
* Bot API to chat, and perform administrative actions
# Dependencies
* Tested on Debian 10 and Ubuntu  19.04
* A domain name and SSL Certificates installed by certbot
See https://certbot.eff.org/lets-encrypt/debianbuster-other
# Getting Started
* Setup free SSL certificates using certbot (see link above for debian buster)
* Clone the repository from GitHub into a users home directory (kamaii)
* Modify nginx.example.conf to match your domain name and your username
* Set dash path to /server/public/live
* do `npm run setup` to setup NGINX with custom RTMP Module
* Wait for compile to finish
* Change permissions of /server/public/live so that the user running express can read it e.g.
`chmod -R 777 /server/public/live`
* Do `npm run start` as a user with sudo permissions, or setup your own startup script to run NGINX as root, and express as your user.
