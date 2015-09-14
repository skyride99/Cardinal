/** @jsx React.DOM */
var React    = require('react'),
    d3       = require('d3');


var D3Legend = React.createClass({

  propTypes: {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    colors: React.PropTypes.array.isRequired,
    data: React.PropTypes.array.isRequired,
  },

  render: function() {
    var color = this.props.colors,
        data = this.props.data,
        elements = data.map(function(item, i){
          return (
                <LegendElement color={color} xpos="30" ypos={50+i*20} data={item.name} key={i} ikey={i}/>
              )
          });

    return(
      <svg className="legend" width={this.props.width} height={this.props.height}>{elements}</svg>
    );
  }
});

var LegendElement = React.createClass({
  render: function() {
    var position =  "translate(" + this.props.xpos + "," + this.props.ypos + ")";
    return (
      <g transform={position}>
      <circle r="7" fill={this.props.color[this.props.ikey]}></circle>
      <text x="15" y="9">{this.props.data}</text>
      </g>
    );
  }
});

var Sector = React.createClass({
  getInitialState: function() {
    return {text: '', opacity:'arc'};
  },
  render: function() {
    var outerRadius = this.props.options.outerRadius || this.props.width/2.2,
        innerRadius = this.props.options.innerRadius || 0,
        arc = d3.svg.arc()
        .outerRadius(outerRadius)
        .innerRadius(innerRadius),
        data = this.props.data,
        center = "translate(" + arc.centroid(data) + ")",
        percentCenter = "translate(0,3)",
        color = this.props.colors;

    return (
      <g onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut} onClick={this.onClick}>
      <path className={this.state.opacity} fill={color[this.props.ikey]} d={arc(this.props.data)}></path>
      <text fill="white" transform={center} textAnchor="middle" fontSize="15px">{data.value}</text>
      <text fill={color[this.props.ikey]} stroke={color} fontSize="15px" transform={percentCenter} textAnchor="middle">{this.state.text}</text>
      </g>
    );
  },

  onMouseOver: function() {
    this.setState({text: '', opacity:'arc-hover'});
    var percent = (this.props.data.value/this.props.total)*100;
    percent = percent.toFixed(1);
    this.setState({text: percent + " %"});
  },
  onMouseOut: function() {
    this.setState({text: '', opacity:'arc'});
  },
  onClick: function() {
    alert("You clicked "+this.props.name);
  }
});

var DataSeries = React.createClass({
  propTypes: {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    color: React.PropTypes.array,
    data: React.PropTypes.array.isRequired,
  },
  render: function() {
    var options = this.props.options;
    var color = this.props.colors;
    var data = this.props.data;
    var width = this.props.width;
    var height = this.props.height;
    var pie = d3.layout.pie();
    var result = data.map(function(item){
      return item.count;
    })
    var names = data.map(function(item){
      return item.name;
    })
    var sum = result.reduce(function(memo, num){ return memo + num; }, 0);
    var position = "translate(" + (width)/2 + "," + (height)/2 + ")";
    var bars = (pie(result)).map(function(point, i) {
      return (
        <Sector data={point} ikey={i} key={i} name={names[i]} colors={color} total=
        {sum} width={width} height={height} options={options}/>
      )
    });

    return (
      <g transform={position}>{bars}</g>
    );
  }
});

var D3Chart = React.createClass({
  propTypes: {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    children: React.PropTypes.node,
  },
  render: function() {
    return (
      <svg width={this.props.width} height={this.props.height}>
      {this.props.children}</svg>
    );
  }
});

var Donut = React.createClass({

  getDefaultProps: function() {
    return {
      options:{
        width: 300,
        height: 350,
        outerRadius: 140,
        innerRadius: 0,
        title: 'All Open: ',
        legend: true
      },
      //sample data
      data : [
      {name: "In Underwriting", count: 10},
      {name: "In Queue", count: 20},
      {name: "In Process", count: 5},
      {name: "In Peer Review", count: 42},
      {name: "In Final Audit", count: 29},
      {name: "Mailed", count: 11}
      ]
    };
  },

  componentWillMount: function() {
    //transition, but not working yet :(
     d3.select('path')
    .transition()
    .delay(function (d, i) {
      //if (d.data.data === 0) return 0;
      return i * 50;
    })
    .duration(function (d, i) {
      //if (d.data.data === 0) return 0;
      return 50;
    })
    .tween('d', function(d) {
      var i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
      return function (t) {
        d.endAngle = i(t);
        return arc(d);
      }
    });
  },

  render: function() {
    var colors = ['#FD9827', '#DA3B21', '#3669C9', '#1D9524', '#971497'];
    return (
      <div>
      <h4> {this.props.options.title} </h4>
      <D3Chart width={this.props.options.width} height={this.props.options.height}>
      <DataSeries data={this.props.data} colors={colors} width=
        {this.props.options.width} height={this.props.options.height} options={this.props.options || {}}/>
      </D3Chart>
      <D3Legend data={this.props.data} colors={colors} width={this.props.options.width - 100} height={this.props.options.height} />
      </div>
    );
  }
});


module.exports = Donut;
