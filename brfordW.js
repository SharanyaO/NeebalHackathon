var source = 1;
var destination = 5;
var predecessor = [0];
predecessor[source]=source;

function shortestPath(g, source) {

    g.vertexes.forEach(function(u) {
        u.dist = Infinity;
        u.prev = null;
    });

    source.dist = 0;

    for (var i = 0; i < g.vertexes.length-1; i++) {
        g.edges.forEach(function(e) {
            update(e);
        });
    }
    printGraph(g);
    var r= printResult(destination);
	return r; }

function update(e) {
    var u = e.from;
    var v = e.to;

    if (v.dist > u.dist + e.data) {
        v.dist = u.dist + e.data;
        v.prev = u;
        predecessor[v]=u;
    } 
}

var result = [[]];

function printResult(destination) {
    var str = '';
    debugger;
    for (var i = 0; i < result[0].length; i++) {
        for (var j = 0; j < result.length; j++) {
            str += result[i][j] + ' ';
        }
        console.log(str);
        str = '';
    }

    i=destination;
    p=0;
    while(predecessor[i]!=source)
    {
        temp =predecessor[i];
        route[p]= temp;
        i=temp;
    }
    console.log(route);
    console.log(result);
}

function printGraph(G) {
    var a = [];

    G.vertexes.forEach(function(u) {
        a.push(u.dist);
    });
    result.push(a);

    console.log('in printGraph: '+result); }

function Graph(options) {
    options = options || {};
    this.directed = (options.directed != null) ? options.directed : true;
    this.vertexes = [];
    this.edges = []; }

Graph.prototype.vertex = function(name) {
    var v = {
        adjacent: [],
        name: name.toString()
    };

    this.vertexes.push(v);

    return this; };

Graph.prototype.get = function(name) {
    return this.vertexes.filter(function(el) {
        return el.name === name.toString();
    })[0]; };

Graph.prototype.edge = function(a, b, w) {
    var that = this;

    connect(a, b, w);
    if (!this.directed) {
        connect(b, a, w);
    }

    function connect(a, b, data) {
        var u = that.vertexes.filter(function(el) {
            return el.name === a.toString();
        })[0];
        var v = that.vertexes.filter(function(el) {
            return el.name === b.toString();
        })[0];

        u.adjacent.push(v);
        that.edges.push({
            from: u,
            to: v,
            data: data
        });
    }

    return this; };


function main() {
    var g = new Graph();
    g.vertex("croma")
     .vertex("pantaloons")
     .vertex("starbucks")
     .vertex("trends")
     .vertex("walmart");

    g.edge("croma", "pantaloons", 10);
    g.edge("croma", "starbucks", 10);
    g.edge("croma", "walmart", 20);

    g.edge("pantaloons", "croma", 10);
    g.edge("pantaloons", "trends", 20);

    g.edge("starbucks", "croma", 10);
    g.edge("starbucks", "walmart", 10);

    g.edge("trends", "pantaloons", 20);
    g.edge("trends", "walmart", 10);

    g.edge("walmart", "croma", 20);
    g.edge("walmart", "starbucks", 10);
    g.edge("walmart", "trends", 10);

    var result = shortestPath(g, g.get(source));
    console.log(result);
    return result;
}
main();
//module.exports = main;