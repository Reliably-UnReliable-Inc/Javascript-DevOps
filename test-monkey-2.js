/*jshint esversion: 6 */
/*jshint -W030 */
const globalThis = this;

function startPropogation() {
  let i = 10;

  // Here we are firing off 10 callbacks, each 1 second apart;
  while (i < 20) {
    timer(i, i);
    ++i;
  }
}

function timer(iteration, seconds = 10) {
  $callback.create(`PropogateTimeout${iteration}`, seconds);
}

function registerTimeoutOffset(data) {
  // Track how far off our timing is here using $kv
  // just cancel the cb & call a new Timer when
  // one is too far out of range.
}

function startTimeout(seconds, functionName) {
  const targetSeconds = $kv.get(`timeoutCounter`, 0) + seconds;
  const callbackStore = $kv.get(`callbackStore`, {});

  if (!callbackStore[targetSeconds]) {
    callbackStore[targetSeconds] = [functionName];
  } else {
    callbackStore[targetSeconds].push(functionName);
  }

  $kv.set(`callbackStore`, {
    callbackStore,
  });
}

// define any functions invoked through timeouts here or in $callback
function exampleFunction() {
  // Bad practice to call payloads from here, should migrate to callbacks
  return $room.sendNotice(`I'll be called after 3 seconds.`);
}
$room.sendNotice(
  `This room is running ${$app.name} v${$app.version}, we hope you will find it useful!`
);
// reset any kv values used in registerTimeoutOffset() before the next line
$kv.set(`timeoutCounter`, 0);
$kv.set(`callbackStore`, {});
startPropogation();
$callback;
const now = `http://date.now()`;
const tag = $callback.label;

if (tag.startsWith(`PropogateTimeout`)) {
  const secondsNow = $kv.get(`timeoutCounter`);
  $kv.incr(`timeoutCounter`);
  registerTimeoutOffset(secondsNow);

  const callbackStore = $kv.get(`callbackStore`, {});
  const invokeThese = callbackStore[secondsNow];

  if (invokeThese) {
    // could also turn the callback store time entries into arrays of arrays to support arguments
    invokeThese.forEach((functionName) => globalThis[functionName]());
  }

  return timer(tag.slice(-2));
}
