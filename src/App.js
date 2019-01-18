import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state =
    {
        link: "",

        link_template: "",
        curl: ""
    };
    this.oauth_state = guid();
    this.oauth_callback_url = window.location.origin + "/oauth_callback";
    this.anchor_element = React.createRef();
    // https://docs.microsoft.com/en-us/graph/auth-overview
    this.templates =
    {
        "": "",
        "office365-implicit":
            "https://login.microsoftonline.com/${this.state.tenant_id}/oauth2/v2.0/authorize" +
            "?response_type=token" +
            "&client_id=${this.state.client_id}" +
            "&redirect_uri=${escape(this.oauth_callback_url)}" +
            "&scope=${escape(this.state.scope)}" +
            "&state=${this.oauth_state}" +
            "&nonce=${guid()}" +
            "&response_mode=fragment",
        "office365-id-token":
            "https://login.microsoftonline.com/${this.state.tenant_id}/oauth2/v2.0/authorize" +
            "?response_type=id_token+code" +
            "&client_id=${this.state.client_id}" +
            "&redirect_uri=${escape(this.oauth_callback_url)}" +
            "&scope=${escape(this.state.scope)}" +
            "&state=${this.oauth_state}" +
            "&nonce=${guid()}" +
            "&response_mode=fragment",
        "office365-auth-token":
            "https://login.microsoftonline.com/${this.state.tenant_id}/oauth2/v2.0/token" +
            "?grant_type=authorization_code" +
            "&client_id=${this.state.client_id}" +
            "&code=${this.state.code}" +
            "&redirect_uri=${escape(this.oauth_callback_url)}",
    }
  }

  createStateSetter(statePropName, mapper) {
    return (e) => {
        const toSet = {};
        toSet[statePropName] = mapper ? mapper[e.target.value] : e.target.value;
        this.setState(toSet);
    };
  }

  render() {
    return (
      <div className="App" style={{width: "100%"}}>
        <p>(1) Use the following OAuth redirect URL when registering your app:</p>
        <input readOnly value={this.oauth_callback_url} style={{width: "50%"}} />
        <p>(2) Either paste the OAuth auth URL template here:</p>
        <input value={this.state.link_template} style={{width: "50%"}} onChange={this.createStateSetter("link_template")} />
        <p>Or, choose one of the following templates ...</p>
        <select style={{width: "50%"}} onChange={this.createStateSetter("link_template", this.templates)}>
            <option value=""></option>
            <option value="office365-implicit">Office 365 Implicit Flow</option>
            <option value="office365-id-token">Office 365 Id Token</option>
            <option value="office365-auth-token">Office 365 Auth Token</option>
        </select>
        <p>... and enter the appropriate values for your app:</p>
        <input value={this.state.client_id} style={{width: "50%"}} onChange={this.createStateSetter("client_id")} />
        <input value={this.state.scope} style={{width: "50%"}} onChange={this.createStateSetter("scope")}  />
        <input value={this.state.tenant_id} style={{width: "50%"}} onChange={this.createStateSetter("tenant_id")}  />
        <input value={this.state.code} style={{width: "50%"}} onChange={this.createStateSetter("code")}  />
        <p>(3) Then click the link for a GET request, or copy the CURL command line for POST:</p>
        <p><a ref={this.anchor_element} target="_blank" rel="noreferrer noopener" href={this.state.link}>{this.state.link}</a></p>
        <input readOnly value={this.state.curl} style={{width: "50%"}} />
      </div>
    );
  }

  componentDidUpdate(prevProps, prevState) {
    let shouldRecalculate = false;
    for (let k of Object.keys(this.state)) {
        if (k == "link" || k == "curl") {
            continue;
        }
        if (prevState[k] !== this.state[k]) {
            shouldRecalculate = true;
            break;
        }
    }
    if (shouldRecalculate) {
        this.calculateLink();
    }
  }

  calculateLink() {
    // 8c819b71-e8a9-4906-b861-9f165aa19ec0
    // openid+profile+https://outlook.office.com/MailboxSettings.ReadWrite&
    const link = eval ("`" + this.state.link_template + "`");
    let curl = "";
    let match = /(.*)[?](.*)/.exec(link);
    if (match) {
        curl = "curl \"" + match[1] + "\" -X POST --data-raw \"" + match[2] + "\" -v -H \"Content-Type: application/x-www-form-urlencoded\"";
    }
    this.setState({ link, curl });
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
