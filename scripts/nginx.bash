if [ -z "$PID" ]; then
    ./nginx/sbin/nginx -c conf/nginx.conf
else
    ./nginx/sbin/nginx -c conf/nginx.conf -s stop
fi
