import 'dart:io';
import 'dart:async';

void printDailyNewsDigest() {
  File file = new File("dailyNewsDigest.txt");
  file.readAsString().then((content) => print(content)).catchError((error) => print("Sorry, no news today. Here's why:\n$error"));
}