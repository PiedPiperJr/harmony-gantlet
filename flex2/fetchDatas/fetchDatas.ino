const int flexPins[] = {A0, A1, A2, A3, A4}; // Broches des flex sensors
int flexValues[5]; // Tableau pour stocker les valeurs des capteurs
int dataset[50][5]; // Stockage de 50 échantillons pour 5 capteurs

void setup() {
  Serial.begin(9600);
  for (int i=0; i<5; ++i)
  {
    pinMode(flexPins[i], INPUT);  
  }
  
}

void loop() {
    for (int i = 0; i < 5; i++) {
        flexValues[i] = analogRead(flexPins[i]);
    }
    
    // Envoyer les données au PC pour les enregistrer ou les analyser
    Serial.print("Échantillon : ");
    for (int i = 0; i < 5; i++) {
        Serial.print(flexValues[i]);
        Serial.print(' ');
        Serial.print("\t");
    }
    Serial.println();
    delay(500); // Collecte des échantillons toutes les 500ms
}
