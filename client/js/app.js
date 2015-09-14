/** @jsx React.DOM */
var React    = window.React = require('react'), // assign it to winow for react chrome extension
    Header   = require('./header'),
    Donut      = require('./donuts.js'),
    Blah = require('./test.js'),
    App;

    var data = [
    {name: "In Underwriting", count: 10},
    {name: "In Queue", count: 20},
    {name: "In Process", count: 5},
    {name: "In Peer Review", count: 42},
    {name: "In Final Audit", count: 29},
    {name: "Mailed", count: 11}
    ];

    var options = {
      title: 'All Open: '
    };

App = React.createClass({
  render: function () {
      return <div>
          <Header/>
          <Donut />
      </div>;
  }
});

App.start = function () {
  React.render(<App/>, document.getElementById('app'));
};

module.exports = window.App = App;
