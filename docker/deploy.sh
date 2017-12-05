#docker run --env GETH_RPC=http://192.168.1.2:8545 --name test -d test

#!/bin/bash
useradd explorer
apt-get update
apt-get install -y git curl tar zutils mongodb nginx sudo wget nano
service mongodb start

#Geth
wget -O /opt/geth_linux https://github.com/shaftsh/shaft/releases/download/1.0/geth_linux
chmod +x /opt/geth_linux
mkdir /opt/geth_datadir
chown explorer:explorer /opt/geth_datadir

#NodeJS
cd /tmp
curl -o node.tar.xz https://nodejs.org/dist/latest-v9.x/node-v9.2.0-linux-x64.tar.xz
tar -C /usr/local --strip-components 1 -xf node.tar.xz
rm node.tar.xz
cd /opt
git clone https://github.com/shaftsh/explorer
cd explorer
npm install
chown -R explorer:explorer /opt
exit 0