import 'dart:isolate';

longRunningCalculation() {
  port.receive((msg, replyTo) {
    if (msg == 'go') {
      // do long calculation
      replyTo.send(result);
    }
  });
}

main() {
  SendPort sendPort = spawnFunction(longRunningCalculation);
  sendPort.call('go').then((result) => print('Result is $result'));

  // continue to respond to input events while long calculation is running
}