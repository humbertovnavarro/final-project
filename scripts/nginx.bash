#!/bin/bash
./nginx/sbin/nginx -c conf/nginx.conf -s stop
./nginx/sbin/nginx -c conf/nginx.conf
