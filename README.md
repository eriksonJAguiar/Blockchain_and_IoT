# Minicurso Blockchain e Internet das Coisas SEMCOM 22 - ICMC/USP 


## Pré-requisitos

* **Componentes básicos** -> 
  ```
    curl -O https://hyperledger.github.io/composer/prereqs-ubuntu.sh
  ```
  ```
    chmod u+x prereqs-ubuntu.sh
   ```
   ```
    ./prereqs-ubuntu.sh
   ```
   
* **Hyperledger Composer** -> npm install -g composer-cli@0.20
* **Hyperledger Composer Rest** -> npm install -g composer-rest-server@0.20
* **Composer Generator** -> npm install -g generator-hyperledger-composer@0.20
* **Yo** -> npm install -g yo@0.20
* **Hyperledger Fabric** ->

  ```
    mkdir ~/fabric-dev-servers && cd ~/fabric-dev-servers
  ```

  ```
    curl -O https://raw.githubusercontent.com/hyperledger/composer-tools/master/packages/fabric-dev-servers/fabric-dev-servers.tar.gz
  ```

  ```
    tar -xvf fabric-dev-servers.tar.gz
  ```

  ```
    export FABRIC_VERSION=hlfv12
  ```

  ```
    ./downloadFabric.sh
  ```

  ```
    ./startFabric.sh
  ```

  ```
    ./createPeerAdminCard.sh
  ```

* **Composer playground** -> usar online [aqui](https://composer-playground.mybluemix.net/editor)

## Cenário de uso 

Rastreamento no transaporte de animais utilizando sensores e blockchain

## Modelagem 

Pensando na estrutra de organização do Hyperledger composer:

![Diagrama do Composer](https://hyperledger.github.io/composer/v0.19/assets/img/Composer-Diagram.svg)

Temos os seguintes componentes:

* CTO:
  - Asset
  - Participant
  - Transaction
* permission.acl
  - permission
* Query
  - Query Composer
* logic.js
  - Transaction logic
  
  No nosso projeto teremos:
  
 #### Participants:
 
- **Fazendeiro:**  cpf, nome, sobrenome, email, end1, end2, pais e cep  
- **Regulador:** cpf, nome, sobrenome, email

#### Asset:

- **Fazenda:** fazendaId, nome, Business
- **Animal:** animalId, especie, localizacao-status, tipo-producao, fazenda-alocado, fazendeiro-proprietario
- **Container** containerId, temperatura, animais, localizacao-gps, status
- **Business:** sbi, end1, end2, pais, cep, fazendeiro, animais

#### Transaction:

- **AnimalMovimento:** logs[], animal, business from, bussiness to (abstract)
- **PartidaDoAnimal:** fazenda
- **ChegadaAnimal:** fazenda
- **LerStatusContainer:** logs[], temperatura, container, geoCode

#### Event

- **ContainerStatus:** message, geoCode, temperatura



## Modelagem do IoT


### Executando 

