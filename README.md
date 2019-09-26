# Minicurso Blockchain e Internet das Coisas SEMCOM 22 - ICMC/USP 


## Pré-requisitos

* **Docker-ce** -> sudo apt-get install docker-ce
* **Docker-compose** -> sudo apt-get install docker-compose
* **NPM** -> sudo apt-get install npm
* **Hyperledger Composer** -> npm install composer-cli@0.19
* **Hyperledger Composer Rest** -> npm install composer-rest@0.19
* **Yo** -> npm install yo@0.19
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
- **AnimalSaindo:** fazenda
- **AnimalEntrando:** fazenda
- **iotInteracao:** logs[], animais (abstract)
- **iotCria** container
- **iotStatus** container

#### Query


#### Permissions


## Construindo a rede

#### CTO:

##### Definições básicas:

```
enum AnimalType{
  o SHEEP
  o COW
  o PIG
  o CHICKEN
}
```
```
enum MovementStatus{
  o IN_FIELD  /** no campo */
  o IN_TRANSIT /** Sendo transportado */
}
```

```
/** tipo de producao que o anima esta associado */
enum ProductionType{
  o MEAT
  o WOOL /** Lã */
  o DAIRY /** Leite */
  o BREEADING /** Reprodução */
  o OTHER
}
```

##### Participants:

```
abstract participant User identified by cpf {
  o String cpf
  o String firstname
  o String lastname
  o String email
}
```

```
participant Farmer extends User{
  o String address1
  o String address2
  o String county 
  o String postcode
  --> Business business optional /** tipo do negocio */
}
```

```
participant Regulator extends User {

}
```

##### Assets:

```
asset Field identified by fieldId {
  o String fieldId
  o String name
  --> Business business
}
```

```
asset Animal identified by animalId {
  o String animalId
  o AnimalType species
  o MovementStatus movementStatus
  o ProductionType prodType
  --> Field location optional
  --> Farmer owner
}
```


```
asset Container identified by containerId{
  o String containerId
  o Animal[] animais
  o String geo-code
  o Double temperatura
  o Boolean status
}
```

```
/** A Business asset which is owned by a Farmer, is related to a list of fields and has a list of incoming animals. */
asset Business identified by sbi{
  o String sbi /** Single Business Identifier */
  o String address1
  o String address2
  o String county
  o String postcode
  --> Farmer owner
  --> Animal[] animals optional
}
```
##### Transaction:

```
abstract transaction AnimalMovement {
  o String[] logs optional
  --> Animal animal
  --> Business from
  --> Business to
}
```

```
/** Saida dos animais para outra fazenda */
transaction AnimalMovementDeparture extends AnimalMovement {
  --> Field fromField
}
```

```
/** Entrada de animais de outra fazenda */
transaction AnimalMovementArrival extends AnimalMovement{
  --> Field arrivalField 
}
```
- **iotInteracao:** logs[], animais (abstract)
- **iotCria** container
- **iotStatus** container
```
abstract transaction ContainerAction{
  o String[] logs
  --> Animal[] animais
}
```

```
transaction iotNew extends ContainerAction{
  --> Container container
}
```

```
transaction iotStatus extends ContainerAction{
  --> Container container
}
```

```
transaction SetupDemo {
  o String detail
}
```

## Modelagem do IoT

