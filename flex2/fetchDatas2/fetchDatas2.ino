#include "Wire.h"
#include <SoftwareSerial.h>

SoftwareSerial bluetoothSerial(10, 11);
const int flexPins[] = {A0, A1, A2, A3, A6};
const int MPU_ADDR = 0x68;

void setup() {
  bluetoothSerial.begin(9600);
  Wire.begin();
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(0x6B);
  Wire.write(0);
  Wire.endTransmission(true);
  
  for (int i = 0; i < 5; i++) {
    pinMode(flexPins[i], INPUT);
  }
}

void loop() {
  // Send flex sensor data
  for (int i = 0; i < 5; i++) {
    bluetoothSerial.print(analogRead(flexPins[i]));
    bluetoothSerial.print(";");
  }
  
  // Read MPU-6050
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(0x3B);
  Wire.endTransmission(false);
  Wire.requestFrom(MPU_ADDR, 12, true);
  
  // Send accelerometer data
  for (int i = 0; i < 3; i++) {
    int16_t value = Wire.read() << 8 | Wire.read();
    bluetoothSerial.print(value);
    bluetoothSerial.print(";");
  }
  
  // Send gyroscope data
  for (int i = 0; i < 3; i++) {
    int16_t value = Wire.read() << 8 | Wire.read();
    bluetoothSerial.print(value);
    if (i < 2) bluetoothSerial.print(";");
  }
  
  bluetoothSerial.println();
  delay(500);
}
