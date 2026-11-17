import React, { useMemo, useState } from "react";
import { SafeAreaView, ScrollView, View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { createAthlete, finalizeAthlete, generateInitialOffers, getArchetypesForPosition } from "@craque/game-engine";
import type { Athlete, ClubOffer, CareerOrigin, Position, Nationality, PreferredFoot, ArchetypeId } from "@craque/shared";

const positions: {value: Position; label: string}[] = [
  {value:"GK",label:"Goleiro"},{value:"CB",label:"Zagueiro"},{value:"LB",label:"Lat. esquerdo"},{value:"RB",label:"Lat. direito"},
  {value:"CDM",label:"Volante"},{value:"CM",label:"Meio-campo"},{value:"CAM",label:"Meia ofensivo"},{value:"LW",label:"Ponta esq."},{value:"RW",label:"Ponta dir."},{value:"ST",label:"Atacante"}
];
const origins: {value: CareerOrigin; label: string}[] = [
  {value:"academy_prospect",label:"Revelação da base"},{value:"regional_promise",label:"Promessa regional"},
  {value:"unknown_bet",label:"Aposta desconhecida"},{value:"international_gem",label:"Joia internacional"}
];
const nationalities: {value: Nationality; label: string}[] = [
  {value:"BR",label:"Brasil"},{value:"AR",label:"Argentina"},{value:"MX",label:"México"},{value:"OTHER",label:"Outra"}
];
const attrLabels: Record<string,string> = {
  finishing:"Finalização",passing:"Passe",dribbling:"Drible",ballControl:"Controle",crossing:"Cruzamento",marking:"Marcação",
  speed:"Velocidade",acceleration:"Aceleração",strength:"Força",stamina:"Resistência",agility:"Agilidade",vision:"Visão",
  composure:"Frieza",positioning:"Posicionamento",decisionMaking:"Decisão",leadership:"Liderança",reflexes:"Reflexos",
  elasticity:"Elasticidade",rushingOut:"Saída do gol",distribution:"Reposição"
};

function Choice<T extends string>({label, value, options, onChange}: {label:string;value:T;options:{value:T;label:string}[];onChange:(v:T)=>void}) {
  return <View style={{marginTop:16}}><Text style={styles.label}>{label}</Text><View style={styles.choices}>{options.map(o=><Pressable key={o.value} onPress={()=>onChange(o.value)} style={[styles.choice,value===o.value&&styles.choiceActive]}><Text style={[styles.choiceText,value===o.value&&styles.choiceTextActive]}>{o.label}</Text></Pressable>)}</View></View>;
}

export default function App() {
  const [name,setName]=useState("Novo Craque");
  const [age,setAge]=useState("17");
  const [nationality,setNationality]=useState<Nationality>("BR");
  const [height,setHeight]=useState("178");
  const [weight,setWeight]=useState("72");
  const [foot,setFoot]=useState<PreferredFoot>("right");
  const [position,setPosition]=useState<Position>("ST");
  const [origin,setOrigin]=useState<CareerOrigin>("regional_promise");
  const [archetype,setArchetype]=useState<ArchetypeId>("st_poacher");
  const [athlete,setAthlete]=useState<Athlete|null>(null);
  const [offers,setOffers]=useState<ClubOffer[]>([]);
  const [error,setError]=useState("");
  const archetypes=useMemo(()=>getArchetypesForPosition(position),[position]);

  function generate() {
    try {
      const player=finalizeAthlete(createAthlete({name,nationality,age:Number(age),heightCm:Number(height),weightKg:Number(weight),position,origin,preferredFoot:foot,archetype}));
      setAthlete(player);setOffers(generateInitialOffers(player));setError("");
    } catch(e) { setError(e instanceof Error?e.message:"Não foi possível criar o atleta."); }
  }

  return <SafeAreaView style={styles.safe}><StatusBar style="light"/><ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.brand}>CRAQUE DO JOGO</Text><Text style={styles.tagline}>SUA CARREIRA. SEU LEGADO.</Text>
    <Text style={styles.eyebrow}>MODO CARREIRA / NOVA JORNADA</Text><Text style={styles.title}>TODO CRAQUE COMEÇA COM UMA OPORTUNIDADE.</Text>
    <Text style={styles.description}>Crie seu atleta e descubra quais clubes estão dispostos a apostar no seu futuro.</Text>
    <View style={styles.panel}>
      <Text style={styles.panelTitle}>01 / IDENTIDADE</Text>
      <Text style={styles.label}>NOME DO JOGADOR</Text><TextInput value={name} onChangeText={setName} maxLength={32} style={styles.input}/>
      <Choice label="IDADE" value={age} options={[{value:"16",label:"16 anos"},{value:"17",label:"17 anos"},{value:"18",label:"18 anos"}]} onChange={setAge}/>
      <Choice label="NACIONALIDADE" value={nationality} options={nationalities} onChange={setNationality}/>
      <View style={styles.twoCols}><View style={{flex:1}}><Text style={styles.label}>ALTURA (CM)</Text><TextInput value={height} onChangeText={setHeight} keyboardType="numeric" style={styles.input}/></View><View style={{flex:1}}><Text style={styles.label}>PESO (KG)</Text><TextInput value={weight} onChangeText={setWeight} keyboardType="numeric" style={styles.input}/></View></View>
      <Choice label="PÉ DOMINANTE" value={foot} options={[{value:"right",label:"Direito"},{value:"left",label:"Esquerdo"},{value:"both",label:"Ambidestro"}]} onChange={setFoot}/>
      <Choice label="POSIÇÃO" value={position} options={positions} onChange={v=>{setPosition(v);setArchetype(getArchetypesForPosition(v)[0].id);}}/>
      <Choice label="ORIGEM DA CARREIRA" value={origin} options={origins} onChange={setOrigin}/>
      <Choice label="ARQUÉTIPO" value={archetype} options={archetypes.map(a=>({value:a.id,label:a.name}))} onChange={setArchetype}/>
      <Text style={styles.hint}>{archetypes.find(a=>a.id===archetype)?.description}</Text>
      {error!==""&&<Text style={styles.error}>{error}</Text>}
      <Pressable style={styles.button} onPress={generate}><Text style={styles.buttonText}>GERAR PROPOSTAS ↗</Text></Pressable>
    </View>
    {athlete&&<View style={styles.panel}>
      <Text style={styles.eyebrow}>SEU ATLETA</Text><Text style={styles.playerName}>{athlete.name}</Text>
      <Text style={styles.description}>{positions.find(p=>p.value===athlete.position)?.label.toUpperCase()} • {athlete.age} ANOS • {athlete.overall} OVR</Text>
      <Text style={styles.label}>POTENCIAL ESTIMADO: {athlete.potential}</Text>
      <Text style={[styles.eyebrow,{marginTop:25}]}>ATRIBUTOS</Text>
      <View style={styles.attributeGrid}>{Object.entries(athlete.attributes).map(([key,value])=><View key={key} style={styles.attribute}><Text style={styles.attributeName}>{attrLabels[key]??key}</Text><Text style={styles.attributeValue}>{value}</Text></View>)}</View>
      <Text style={[styles.eyebrow,{marginTop:25}]}>SUAS TRÊS PROPOSTAS</Text>
      {offers.map((offer,i)=><View key={offer.club.id} style={styles.offer}><Text style={styles.offerIndex}>0{i+1}</Text><View style={{flex:1}}><Text style={styles.club}>{offer.club.name}</Text><Text style={styles.description}>{offer.club.country} • {offer.role}</Text></View><Text style={styles.salary}>R$ {offer.estimatedSalary.toLocaleString("pt-BR")}</Text></View>)}
    </View>}
    <Text style={styles.footer}>BUILD 0.2.0 • DESENVOLVIMENTO</Text>
  </ScrollView></SafeAreaView>;
}

const styles=StyleSheet.create({
 safe:{flex:1,backgroundColor:"#0b1010"},container:{padding:22,paddingBottom:40},brand:{color:"#f2f4ee",fontSize:19,fontWeight:"900",letterSpacing:2},
 tagline:{color:"#87938e",fontSize:9,letterSpacing:2,marginTop:4},eyebrow:{color:"#c8f169",fontSize:10,fontWeight:"800",letterSpacing:2,marginTop:30},
 title:{color:"#f2f4ee",fontSize:36,lineHeight:39,fontWeight:"900",marginTop:14},description:{color:"#aeb8b1",fontSize:12,lineHeight:19,marginTop:8},
 panel:{backgroundColor:"#131b1a",borderColor:"#293532",borderWidth:1,borderRadius:5,padding:18,marginTop:24},panelTitle:{color:"#c8f169",fontSize:10,fontWeight:"800",letterSpacing:2},
 label:{color:"#c2cbc4",fontSize:10,fontWeight:"800",letterSpacing:1,marginTop:15},input:{color:"#f2f4ee",backgroundColor:"#0d1412",borderWidth:1,borderColor:"#34423b",padding:12,borderRadius:3,marginTop:8},
 choices:{flexDirection:"row",flexWrap:"wrap",gap:7,marginTop:8},choice:{borderWidth:1,borderColor:"#34423b",backgroundColor:"#0d1412",paddingVertical:9,paddingHorizontal:10,borderRadius:3},choiceActive:{borderColor:"#c8f169",backgroundColor:"#1e332b"},
 choiceText:{color:"#aeb8b1",fontSize:11},choiceTextActive:{color:"#c8f169",fontWeight:"800"},twoCols:{flexDirection:"row",gap:12},hint:{color:"#87938e",fontSize:10,lineHeight:16,marginTop:12},
 button:{backgroundColor:"#c8f169",padding:16,borderRadius:3,marginTop:18,alignItems:"center"},buttonText:{color:"#11180f",fontSize:13,fontWeight:"900",letterSpacing:1},
 error:{color:"#ff9c91",fontSize:11,marginTop:12},playerName:{color:"#f2f4ee",fontSize:28,fontWeight:"900",marginTop:12},attributeGrid:{flexDirection:"row",flexWrap:"wrap",gap:8,marginTop:12},
 attribute:{width:"30%",backgroundColor:"#0d1412",padding:9,borderRadius:3},attributeName:{color:"#87938e",fontSize:9},attributeValue:{color:"#c8f169",fontSize:17,fontWeight:"900",marginTop:3},
 offer:{borderTopWidth:1,borderTopColor:"#293532",paddingVertical:14,flexDirection:"row",alignItems:"center",gap:12},offerIndex:{color:"#718078",fontSize:16,fontWeight:"800"},
 club:{color:"#f2f4ee",fontSize:13,fontWeight:"800"},salary:{color:"#c8f169",fontSize:10,fontWeight:"700"},footer:{color:"#65736b",fontSize:9,letterSpacing:1.5,textAlign:"center",marginTop:30}
});
