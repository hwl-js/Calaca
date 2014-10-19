/*
 * Calaca - Search UI for Elasticsearch
 * https://github.com/romansanchez/Calaca
 * http://romansanchez.me
 * @rooomansanchez
 * 
 * v1.1.0
 * MIT License
 */

/* Service to Elasticsearch */
Calaca.factory('calacaService', ['$q', 'esFactory', '$location', function($q, elasticsearch, $location){

    //Set defaults if host and port aren't configured
    var esHost = (host.length > 0 ) ? host : $location.host();
    var esPort = (port.length > 0 ) ? port : 9200;

    var client = elasticsearch({ host: esHost + ":" + esPort });

    var search = function(term, mode, offset){

        var deferred = $q.defer();

        client.search({
                "index": indexName,
                "type": docType,
                "body": {
                    "size": maxResultsSize,
                    "from": offset,
                    "query": {
                        "match": {
                            "_all": term
                        }
                    }
                }
        }).then(function(result) {
                var i = 0, hitsIn, hitsOut = [];
                hitsIn = (result.hits || {}).hits || [];
                for(;i < hitsIn.length; i++){
                    hitsOut.push(hitsIn[i]._source);
                }
                deferred.resolve({ timeTook: result.took, hitsCount: result.hits.total, hits: hitsOut });
        }, deferred.reject);

        return deferred.promise;
    };

    return {
        "search": search
    };

    }]
);