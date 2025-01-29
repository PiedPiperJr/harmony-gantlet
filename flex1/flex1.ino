const int flexPins[] = {A0, A1, A2, A3, A4}; // Broches des 5 capteurs de flexion
const int numSensors = 5;

// Paramètres de calibration (à ajuster selon vos capteurs)
const float fixedResistance = 47000.0; // Résistance fixe en ohms
const float straightResistance[] = {25000.0, 25000.0, 25000.0, 25000.0, 25000.0}; 
const float bentResistance[] = {100000.0, 100000.0, 100000.0, 100000.0, 100000.0};
const float straightAngle = 0; // Angle en position droite
const float bentAngle = 90.0; // Angle en position pliée

void setup() {
  Serial.begin(9600); // Initialisation de la communication série
  
  // Configuration des broches en entrée
  for (int i = 0; i < numSensors; i++) {
    pinMode(flexPins[i], INPUT);
  }
}

void loop() {
  // Tableau pour stocker les angles de chaque capteur
  float angles[numSensors];
  
  // Lecture et calcul de l'angle pour chaque capteur
  for (int i = 0; i < numSensors; i++) {
    int flexValue = analogRead(flexPins[i]); // Lecture de la valeur analogique
    float voltage = flexValue * 5.0 / 1023.0; // Conversion en tension
    
    // Calcul de la résistance du capteur de flexion
    float flexResistance = fixedResistance * (5.0 / voltage - 1.0);
    
    // Conversion de la résistance en angle
    angles[i] = map(flexResistance, 
                    straightResistance[i], 
                    bentResistance[i], 
                    straightAngle, 
                    bentAngle);
  }
  
  // Affichage des angles
  Serial.print("Angles: ");
  for (int i = 0; i < numSensors; i++) {
    Serial.print(angles[i]);
    Serial.print(" ");
  }
  Serial.println(); // Nouvelle ligne
  
  delay(500); // Délai entre les lectures
}
