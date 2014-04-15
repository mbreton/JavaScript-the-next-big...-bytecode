abstract class Animal {
  var name = "";

  Animal();
  Animal.fromName(this.name);
}

class Pet extends Animal {
  var owner = "";
}