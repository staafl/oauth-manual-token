import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = { link: "", clientId: "clientId", scope: "scope", link_option: "" };
    this.oauth_state = guid();
    this.oauth_callback_url = window.location.href + "oauth_callback";
    this.anchor_element = React.createRef();
  }
  
  createStateSetter(statePropName) {
    return (e) => {
        const toSet = {};
        toSet[statePropName] = e.target.value;
        this.setState(toSet);
    };
  }
  
  render() {
    return (
      <div className="App" style={{width: "100%"}}>
        <p>Use the following OAuth authentication URL when registering your app:</p>
        <input readOnly value={this.oauth_callback_url} style={{width: "50%"}} />
        <p>If creating the callback URL manually, use the following state GUID:</p>
        <input readOnly value={this.oauth_state} style={{width: "50%"}} />
        <p>Or, choose one of the following templates ...</p>
        <select style={{width: "50%"}} onChange={this.createStateSetter("link_option")}>
            <option value=""></option>
            <option value="office365">Office 365</option>
        </select>
        <p>... enter your app's client ID and desired token scope ...</p>
        <input value={this.state.clientId} style={{width: "50%"}} onChange={this.createStateSetter("clientId")} />
        <input value={this.state.scope} style={{width: "50%"}} onChange={this.createStateSetter("scope")}  />
        <p>...and click on the following link:</p>
        <p><a ref={this.anchor_element} target="_blank" rel="noreferrer noopener" href={this.state.link}>{this.state.link}</a></p>
      </div>
    );
  }
  
  componentDidUpdate(prevProps, prevState) {
    if (prevState.clientId != this.state.clientId ||
        prevState.scope != this.state.scope ||
        prevState.link_option != this.state.link_option) {
        this.calculateLink();
    }
  }
  
  calculateLink() {
    let link = "";
    // 8c819b71-e8a9-4906-b861-9f165aa19ec0
    // openid+profile+https://outlook.office.com/MailboxSettings.ReadWrite&
    if (this.state.link_option === "office365") {
        link =
            "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?response_type=id_token+token" +
            `&client_id=${this.state.clientId}` +
            `&redirect_uri=${escape(this.oauth_callback_url)}` +
            `&scope=${this.state.scope}` +
            `&state=${this.oauth_state}` +
            `&nonce=${guid()}` +
            "&response_mode=fragment" ;
    }
    this.setState({ link });
  }
}

function guid() {
  var buf = new Uint16Array(8);
  window.crypto.getRandomValues(buf);
  function s4(num) {
    var ret = num.toString(16);
    while (ret.length < 4) {
      ret = '0' + ret;
    }
    return ret;
  }
  return s4(buf[0]) + s4(buf[1]) + '-' + s4(buf[2]) + '-' + s4(buf[3]) + '-' +
    s4(buf[4]) + '-' + s4(buf[5]) + s4(buf[6]) + s4(buf[7]);
}

export default App;
