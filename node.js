/**
 * Created by Julian on 17/10/14.
 */
var cors = "http://85.25.215.113";
cors = "http://localhost:8000";
var GossipBroker = require("./gossipjs").Broker({port:9000, debug:true, bootstrapPort:9001,cors:cors});
//GossipBroker.debug('hallo');
