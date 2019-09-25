/**
 * New script file
 */


"use strict"

/**
 * @param {org.iot.semcomp.icmc.PartidaDoAnimal} PartidaDoAnimal
 * @transaction
 */
 async function onPartidaAnimal(partidaAnimal){
    
    
    if(partidaAnimal.animal.movStatus !== 'NA_FAZENDA'){
         throw new Error('Animal ja esta em transito');
     }
   
     partidaAnimal.animal.movStatus = 'EM_TRANSITO';
     const an = await getAssetRegistry('org.iot.semcomp.icmc.Animal');
     await an.update(partidaAnimal.animal);
   

    const container = partidaAnimal.container;
    container.status = true;
   	const to = partidaAnimal.to;

     if(to.animais){
         to.animais.push(partidaAnimal.animal);
       	 container.animais = to.animais;
     }
     else{
         to.animais = [partidaAnimal.animal];
       	 container.animais = [partidaAnimal.animal];
     }

     const br = await getAssetRegistry('org.iot.semcomp.icmc.Business');
     await br.update(to);
   
   	const ctr = await getAssetRegistry('org.iot.semcomp.icmc.Container');
    await ctr.update(container);
 }


/**
 * @param {org.iot.semcomp.icmc.ChegadaDoAnimal} ChegadaDoAnimal
 * @transaction
 */
 async function onChegadaDoAnimal(chegadaAnimal){
   
   const animal = chegadaAnimal.animal;
   
   if(chegadaAnimal.animal.movStatus == 'NA_FAZENDA'){
     	throw new Error('Animal ja esta alocado');
   }
   
   chegadaAnimal.animal.movStatus = 'NA_FAZENDA';
   
   chegadaAnimal.animal.proprietario = chegadaAnimal.to.proprietario;
   
   chegadaAnimal.animal.localizacao = chegadaAnimal.chegadaFazenda;
   
   const ar = await getAssetRegistry('org.iot.semcomp.icmc.Animal');
   await ar.update(animal);
   
   chegadaAnimal.to.animais = chegadaAnimal.to.animais.filter(function(animal){
            return animal.animalId !== chegadaAnimal.animal.animalId;
    });
           
    const br = await getAssetRegistry('org.iot.semcomp.icmc.Business');
   	await br.update(chegadaAnimal.to);
   
 }

/**
* @param {org.iot.semcomp.icmc.LerStatusContainer} LerStatusContainer
* @transaction
*/

async function onLerStatusContainer(lerStatusContainer){
 	
  const container = lerStatusContainer.container;
  
  container.geoCode = lerStatusContainer.geoCode;
  container.temperatura = lerStatusContainer.temperatura;
  
  return getAssetRegistry('org.iot.semcomp.icmc.Container')
  	.then(function(registry){
    	return registry.update(lerStatusContainer.container);
  }).then(function(){
    	var event = getFactory().newEvent(
          	'org.iot.semcomp.icmc',
          	'ContainerStatus'
          );
    
    	if(lerStatusContainer.temperatura >= 45){
          event.message = 'Temperatura elevada';
        }else if(container.temperatura < 45 && container.temperatura >= 18){
          event.message = 'Temperatura ideal';
        }else{
          event.message = 'Temperatura abaixo do ideal';
        }
    
    	event.geoCode = lerStatusContainer.geoCode;
    	event.temperatura = lerStatusContainer.temperatura;
    
    	emit(event);
  });
  
  	
}

/**
* @param {org.iot.semcomp.icmc.SetupDemo} SetupDemo
* @transaction
*/
async function SetupDemo(setupDemo){
  
  const factory = getFactory();
  const NS = 'org.iot.semcomp.icmc';
  
  const fazendeiros = [
  	factory.newResource(NS,'Fazendeiro','FAZENDEIRO_1'),
    factory.newResource(NS,'Fazendeiro','FAZENDEIRO_2')
  ];
  
  const business = [
  	factory.newResource(NS,'Business','BUSINESS_1'),
    factory.newResource(NS,'Business','BUSINESS_2')
  ];
  
  const fazendas = [
  	factory.newResource(NS,'Fazenda','FAZENDA_1'),
    factory.newResource(NS,'Fazenda','FAZENDA_2'),
    factory.newResource(NS,'Fazenda','FAZENDA_3'),
    factory.newResource(NS,'Fazenda','FAZENDA_4')
  ];
  
  const animais = [
  	factory.newResource(NS,'Animal','Animal_1'),
   	factory.newResource(NS,'Animal','Animal_2'),
    factory.newResource(NS,'Animal','Animal_3'),
    factory.newResource(NS,'Animal','Animal_4'),
    factory.newResource(NS,'Animal','Animal_5'),
    factory.newResource(NS,'Animal','Animal_6'),
    factory.newResource(NS,'Animal','Animal_7'),
    factory.newResource(NS,'Animal','Animal_8')
  ];
  
  const containers = [
     factory.newResource(NS,'Container','CONTAINER_1'),
     factory.newResource(NS,'Container','CONTAINER_2'),
     factory.newResource(NS,'Container','CONTAINER_3'),
   ];
  
  const regulador = factory.newResource(NS, 'Regulador', 'REGULADOR');
  regulador.cpf = '0192019201';
  regulador.nome = 'Ronie';
  regulador.sobrenome = 'Regulator';
  regulador.email = 'regulador@gmail.com';
  const regRegistry = await getParticipantRegistry(NS + '.Regulador');
  await regRegistry.addAll([regulador]);
  
  fazendeiros.forEach(function(farmer, index){
    const sbi = 'BUSINESS_'+farmer.getIdentifier().split('_')[1];
    farmer.cpf = '738327923';
    farmer.nome = 'A'+index;
    farmer.sobrenome = 'Z'+index;
    farmer.email = 'email'+farmer.nome+'@gmail.com';
    farmer.endereco1 = 'Rua '+farmer.sobrenome;
    farmer.endereco2 = 'Rua '+farmer.nome;
    farmer.cep = index+'23829'+index;
    farmer.pais = 'Brasil';
    farmer.business = factory.newResource(NS, 'Business', sbi);
  });
  
  const fazdRegistry = await getParticipantRegistry(NS + '.Fazendeiro');
  await fazdRegistry.addAll(fazendeiros);
  
  business.forEach(function(bs, index){
    const farmer = 'FARMER_' + (index+1);
    bs.endereco1 = 'Endereco'+index;
    bs.endereco2 = 'Endereco'+index;
    bs.cep = index+'1291201'+index;
    bs.pais = 'Brasil';
    bs.proprietario = factory.newRelationship(NS, 'Fazendeiro', farmer);
  });
  
  const bsRegistry = await getAssetRegistry(NS + '.Business');
  await bsRegistry.addAll(business);
  
  fazendas.forEach(function(fazenda, index){
  	const bs = 'BUSINESS_'+((index %2)+1);
    fazenda.nome = 'FAZENDA_'+(index+1);
    fazenda.business = factory.newRelationship(NS, 'Business', bs);
  });
  
  const fazRegistry = await getAssetRegistry(NS + '.Fazenda');
  await fazRegistry.addAll(fazendas);
  
  animais.forEach(function(animal, index){
    const fazenda = 'FAZENDA_'+((index%2)+1);
    const fazendeiro = 'FAZENDEIRO_'+((index%2)+1);
    animal.especie = 'VACA';
    animal.movStatus = 'NA_FAZENDA';
    animal.tipoProducao = 'CARNE';
    animal.localizacao = factory.newRelationship(NS, 'Fazenda', fazenda);
    animal.proprietario = factory.newRelationship(NS, 'Fazendeiro', fazendeiro);
  });
  
  const aniRegistry = await getAssetRegistry(NS + '.Animal');
  await aniRegistry.addAll(animais);
  
  containers.forEach(function(contr, index){
    contr.geoCode = '-10129012, 19201201';
    contr.temperatura = 27.0;
  });
  
  const ctrRegistry = await getAssetRegistry(NS + '.Container');
  await ctrRegistry.addAll(containers);
  
}

