#!/bin/bash
mkdir nginx
prefix=`realpath nginx`
nginxPath='nginx-1.20.1'
nginxTar='nginx-1.20.1.tar.gz'
rtmpTar='v1.2.2.tar.gz'
rtmpPath='nginx-rtmp-module-1.2.2'
sudo apt update
sudo apt install build-essential -y
sudo apt install libpcre3-dev -y
sudo apt install libpcre3 -y
sudo apt install zlib1g-dev -y
sudo apt install zlib1g -y
sudo apt install libssl-dev -y
sudo apt install libssl -y
sudo apt install  wget -y
wget https://github.com/arut/nginx-rtmp-module/archive/refs/tags/v1.2.2.tar.gz -nc
wget http://nginx.org/download/nginx-1.20.1.tar.gz -nc
tar -xvzf $rtmpTar
tar -xvzf $nginxTar
rm $rtmpTar
rm $nginxTar
cd nginx-1.20.1
./configure --prefix=$prefix --with-http_ssl_module --add-module=../$rtmpPath
make -j 1
make install
cd ..
rm -rf $rtmpPath
rm -rf $nginxPath
cp nginx.example.conf nginx/conf/nginx.conf
