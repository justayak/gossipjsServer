/**
 * Created by julian on 17/10/14.
 */

var PeerServer = require('peer').PeerServer;
var Essz = require("./essz")
var http = require("http");

/**
 *
 * @param options
 * @returns {GossipBroker}
 * @constructor
 */
function GossipBroker(options){
    if (! (this instanceof GossipBroker)) return new GossipBroker(options);
    if (typeof options === 'undefined') throw "GossipBroker needs options-parameter";
    if (! ('port' in options)) throw "GossipBroker options need to specify a port";
    if (! ('bootstrapPort' in options)) throw "GossipBroker options need to specify a bootstrapPort";
    if (! ('cors' in options)) throw "GossipBroker options need CORS";
    this._debug = 'debug' in options && options.debug;
    var server = new PeerServer({port:options.port, path: '/b'});
    var self = this;
    this.debug('Gossip broker on port ' + options.port);
    this.connectedNodes = new Essz.HashList();

    http.createServer(function (req, res) {
        console.log("http input!" + req.url);

        res.writeHead(200, {
            'Access-Control-Allow-Origin' : options.cors,
            'Access-Control-Allow-Credentials' : 'true',
            'Content-Type': 'text/plain'
        });
        var sample = self.connectedNodes.sample(2);
        var result = "[";
        for (var i = 0; i < sample.length; i++){
            result += sample[i];
            if (i < (sample.length - 1)){
                result += ",";
            }
        }
        result += "]";
        res.end(result);
    }).listen(options.bootstrapPort);
    this.debug("Http bootstrap server on port " + options.bootstrapPort);

    server.on('connection', function(id){
        self.debug("connect: " + id);
        self.connectedNodes.put(id,id);
    });
    server.on('disconnect', function (id) {
        self.debug("disconnect:" + id);
        self.connectedNodes.remove(id);
    });
};

/**
 *
 * @param msg
 */
GossipBroker.prototype.debug = function(msg){
    if (this._debug) {
        console.log('[gossipjs][' + new Date().toISOString().substr(12) + ']' + msg);
    }
};

module.exports = {
    Broker : GossipBroker
}