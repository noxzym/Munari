//~~~~~~~~~~~~~~~~~~~~~~~~~~PACKAGE REQUIREMENT CODE IN HERE~~~~~~~~~~~~~~~~~~~~~~~~~\\
const Munari = require('./structures/MunariClient');
const client = new Munari({
  dblapi: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc0MDExMjM1MzQ4MzU1NDg1OCIsImJvdCI6dHJ1ZSwiaWF0IjoxNjA1NDk5OTc3fQ.0S6h9gpQg77c0mLRqLC4vc4zgduENIBrPlXzkRtDF24',
  boatsapi: '2bo3CkMT7P6CNxx7IBQrO5haxlOsSPazT8ExCCKAvUVxzuW8bKlsJqw3JH6yDd40B39zmNIGS4uV4SgVY3w54fIaiRiA0mJkMzlNlkCFCKvxoL4mtI1ABWvRfmpnUDrj8RutB2rjA7Uv9rVp9k9wt4G9VCr',
  alexapi: '93jQYsGpTm_Jz44_fxV2VlsL9t6Uk36zfHq3buCb',
  ytapiL: "AIzaSyAeoZxsotVd1HdcqG8KXAIzS_O8FxQbel0",
  spcid: "1403b5f83a244f70ba0e2bcc6892aac2",
  spcs: "d2d1d2e3e2a0480dab57dc279b61634f",
  sessionid: "14643228375:pBgARot5BdWf0b:3",
  prefix: 'm!'
});

["command"].forEach(handler => {
  require(`./structures/${handler}`)(client);
});
["events"].forEach(handler => {
  require(`./structures/${handler}`)(client);
});

client.start()