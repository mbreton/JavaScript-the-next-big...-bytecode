class Animal
  constructor: (@name)->

class Pet extends Animal
  construtor: (@owner, name) ->
    super name

cat = new Pet "Rex", "Garfield"

if cat instanceof Pet
  console.log "#{cat.name} is a Pet"