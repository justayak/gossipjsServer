/**
 * Created by Julian on 12/11/14.
 */
var cors = "http://localhost:8000";
var GossipBroker = require("./gossipjs").Broker({port:9000, debug:true, bootstrapPort:9001,cors:cors});
