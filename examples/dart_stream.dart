query('textarea').onKeyPress
  .where((e) => e.keyCode >= 32 && e.keyCode <= 122)
  .map((e) => new String.fromCharCode(e.charCode))
  .listen((char) => print('You typed $char'));