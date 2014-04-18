import 'dart:html';

main() {
  HttpRequest.getString('/bunnies.json')//
    .then((response) => parse(response)) // returns a Future
    .then((object) => storeObject(object)) // returns a Future
    .catchError((e) => recover(e));
}