import React, { useState } from "react";
import { SafeAreaView, ScrollView, View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { createAthlete, finalizeAthlete, generateInitialOffers } from "@craque/game-engine";
import type { Athlete, ClubOffer } from "@craque/shared";

export default function App() {
  const [name, setName] = useState("Novo Craque");
  const [athlete, setAthlete] = useState<Athlete | null>(null);
  const [offers, setOffers] = useState<ClubOffer[]>([]);

  function generate() {
    const player = finalizeAthlete(createAthlete({
      name, nationality: "BR", age: 17, position: "ST", origin: "regional_promise"
    }));
    setAthlete(player);
    setOffers(generateInitialOffers(player));
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light"/>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.brand}>CRAQUE DO JOGO</Text>
        <Text style={styles.tagline}>SUA CARREIRA. SEU LEGADO.</Text>
        <Text style={styles.eyebrow}>MODO CARREIRA / NOVA JORNADA</Text>
        <Text style={styles.title}>TODO CRAQUE COMEÇA COM UMA OPORTUNIDADE.</Text>
        <Text style={styles.description}>Crie seu atleta e descubra quais clubes estão dispostos a apostar no seu futuro.</Text>

        <View style={styles.panel}>
          <Text style={styles.label}>NOME DO JOGADOR</Text>
          <TextInput value={name} onChangeText={setName} style={styles.input} placeholderTextColor="#718078"/>
          <Text style={styles.hint}>Protótipo mobile: atleta brasileiro, 17 anos, atacante e promessa regional.</Text>
          <Pressable style={styles.button} onPress={generate}>
            <Text style={styles.buttonText}>GERAR PROPOSTAS ↗</Text>
          </Pressable>
        </View>

        {athlete && <View style={styles.panel}>
          <Text style={styles.eyebrow}>SEU ATLETA</Text>
          <Text style={styles.playerName}>{athlete.name}</Text>
          <Text style={styles.description}>ATACANTE • {athlete.age} ANOS • BRASIL</Text>
          <Text style={styles.overall}>{athlete.overall} OVR</Text>
          <Text style={styles.label}>POTENCIAL ESTIMADO: {athlete.potential}</Text>
          <Text style={[styles.eyebrow, {marginTop: 24}]}>SUAS TRÊS PROPOSTAS</Text>
          {offers.map((offer, index) => <View key={offer.club.id} style={styles.offer}>
            <Text style={styles.offerIndex}>0{index + 1}</Text>
            <View style={{flex: 1}}>
              <Text style={styles.club}>{offer.club.name}</Text>
              <Text style={styles.description}>{offer.club.country} • {offer.role}</Text>
            </View>
            <Text style={styles.salary}>R$ {offer.estimatedSalary.toLocaleString("pt-BR")}</Text>
          </View>)}
        </View>}
        <Text style={styles.footer}>BUILD 0.1.0 • DESENVOLVIMENTO</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0b1010" },
  container: { padding: 22, paddingBottom: 40 },
  brand: { color: "#f2f4ee", fontSize: 19, fontWeight: "900", letterSpacing: 2 },
  tagline: { color: "#87938e", fontSize: 9, letterSpacing: 2, marginTop: 4 },
  eyebrow: { color: "#c8f169", fontSize: 10, fontWeight: "800", letterSpacing: 2, marginTop: 35 },
  title: { color: "#f2f4ee", fontSize: 38, lineHeight: 40, fontWeight: "900", marginTop: 14 },
  description: { color: "#aeb8b1", fontSize: 12, lineHeight: 19, marginTop: 8 },
  panel: { backgroundColor: "#131b1a", borderColor: "#293532", borderWidth: 1, borderRadius: 5, padding: 18, marginTop: 24 },
  label: { color: "#c8f169", fontSize: 10, fontWeight: "800", letterSpacing: 1, marginTop: 15 },
  input: { color: "#f2f4ee", backgroundColor: "#0d1412", borderWidth: 1, borderColor: "#34423b", padding: 13, borderRadius: 3, marginTop: 8 },
  hint: { color: "#87938e", fontSize: 10, lineHeight: 16, marginTop: 12 },
  button: { backgroundColor: "#c8f169", padding: 16, borderRadius: 3, marginTop: 18, alignItems: "center" },
  buttonText: { color: "#11180f", fontSize: 13, fontWeight: "900", letterSpacing: 1 },
  playerName: { color: "#f2f4ee", fontSize: 28, fontWeight: "900", marginTop: 12 },
  overall: { color: "#c8f169", fontSize: 38, fontWeight: "900", marginTop: 12 },
  offer: { borderTopWidth: 1, borderTopColor: "#293532", paddingVertical: 14, flexDirection: "row", alignItems: "center", gap: 12 },
  offerIndex: { color: "#718078", fontSize: 16, fontWeight: "800" },
  club: { color: "#f2f4ee", fontSize: 13, fontWeight: "800" },
  salary: { color: "#c8f169", fontSize: 10, fontWeight: "700" },
  footer: { color: "#65736b", fontSize: 9, letterSpacing: 1.5, textAlign: "center", marginTop: 30 }
});
