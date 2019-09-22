#!/bin/bash


curl -O https://hyperledger.github.io/composer/v0.19/prereqs-ubuntu.sh

chmod u+x prereqs-ubuntu.sh

./prereqs-ubuntu.sh

sudo apt-get install npm

npm install -g composer-cli@0.19

npm install -g composer-rest-server@0.19

npm install -g generator-hyperledger-composer@0.19

npm install -g yo

npm install -g composer-playground@0.19


mkdir ~/fabric-dev-servers && cd ~/fabric-dev-servers

curl -O https://raw.githubusercontent.com/hyperledger/composer-tools/master/packages/fabric-dev-servers/fabric-dev-servers.tar.gz

tar -xvf fabric-dev-servers.tar.gz

cd ~/fabric-dev-servers

export FABRIC_VERSION=hlfv11

./downloadFabric.sh

export FABRIC_VERSION=hlfv11
./startFabric.sh
./createPeerAdminCard.sh
