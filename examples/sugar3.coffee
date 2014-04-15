#destructuring assignement
weatherReport = (location) ->
  # Make an Ajax request to fetch the weather...
  [location, 72, "Mostly Sunny"]

[city, temp, forecast] = weatherReport "Berkeley, CA"

#the strings become magic
sentence = "#{ 22 / 7 } is a decent approximation of π"
html = """
<strong>
    cup of coffeescript
</strong>
"""