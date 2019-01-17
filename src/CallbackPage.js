import React, { Component } from 'react';

class CallbackPage extends Component {
  constructor() {
    super();
  }
  
  render() {
    var hash = window.location.hash.substr(1);

    var result = hash.split('&').reduce(function (result, item) {
        var parts = item.split('=');
        result[parts[0]] = parts[1];
        return result;
    }, {});
    var divs =
        Object.keys(result).map((x) => 
        (
            <div>{`${x}: `}<input style={{width: "50%"}} value={result[x]}></input></div>
        ));
    return (
      <div>
        {divs}
      </div>
    );
  }
}
  
export default CallbackPage;
