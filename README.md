# musixise 稀客
it's a historic music live experience, with minimum network consumption, premium sound feedback, and ~zero timing latency to the audience.
# musixise-api-server
api接口项目


# musixise-io-server
socket-io项目


# musixise-m-node
普通用户听众客户端


# musixise-www-node
音乐人用户采集客户端


# 项目开启方法
musixise-io-server,musixise-m-node,musixise-www-node基于node,打开项目指令cd dir -> npm start


# host文件配置 
127.0.0.1		localhost
255.255.255.255	broadcasthost
::1				localhost
fe80::1%lo0		localhost

127.0.0.1 www.musixise.com   #艺人PC端    e.g. http://www.musixise.com:3000/stage/ff(无反向代理)http://www.musixise.com/stage/ff(有反向代理)
127.0.0.1 m.musixise.com     #普通用户H5端    e.g. http://m.musixise.com:3001/stage/ff
127.0.0.1 io.musixise.com    #socketio server    e.g. not necessary though, http://io.musixise.com:3002
127.0.0.1 api.musixise.com   #api server

# 反向代理基于nginx，nginx host文件具体配置:
server {
    listen        80;
    server_name   www.musixise.com;
    root          html;
    #access_log    /Users/ziwen/Documents/musixise/musixise-www-server/npm-debug;
    location / {
        proxy_pass      http://127.0.0.1:3000;
        proxy_set_header Host $http_host;
        proxy_set_header X-Forward-For $remote_addr;
    }
}

server {
    listen        80;
    server_name   m.musixise.com;
    root          html;
    #access_log    /Users/ziwen/Documents/musixise/musixise-m-server/npm-debug;
    location / {
        proxy_pass      http://127.0.0.1:3001;
        proxy_set_header Host $http_host;
        proxy_set_header X-Forward-For $remote_addr;
    }
}

server {
    listen        80;
    server_name   io.musixise.com;
    root          html;
    #access_log    /Users/ziwen/Documents/musixise/musixise-io-server/npm-debug;
    location / {
        proxy_pass      http://127.0.0.1:3002;
        proxy_set_header Host $http_host;
        proxy_set_header X-Forward-For $remote_addr;
    }
}

# MIDI配置
有MIDI乐器直接插入并正常配置
如果没有midi乐器，可临时下载VMPK, 在edit下面选择Midi Connections, MIDI In Driver选择Network， MIDI OUT Driver选择CoreMIDI，Output MIDI Connection 选择 IAC Driver Bus
