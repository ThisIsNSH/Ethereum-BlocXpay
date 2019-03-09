import "../stylesheets/app.css";

import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

import metacoin_artifacts from '../../build/contracts/MetaCoin.json'

// (0) 0x415ae415b6df2be92820afb183993974625f4664
// (1) 0xce763813246a7d11ad75f2beb1760aea8b8287fa
// (2) 0x545b4b80f4445be35fabb98f4c6334522a210d31
// (3) 0xa801182638b122c6439d2e077f84ec18234b95d1
// (4) 0x6964123fbecda68ce48241c10bef582f2d994097
// (5) 0x31760b301189c46a2e437205bde862172c45d75a
// (6) 0xd80e4c4ce54366d8f3ab969d51853be7674f2db3
// (7) 0xee412aa73d32fcff84cbf4efb79d5ae06b2d05e7
// (8) 0xc78c7930d69d555a3d6e1e0ea038aad4ad026681
// (9) 0x463b080d3e3d78e9b252240ea8017c3e9f8bf0c2

var MetaCoin = contract(metacoin_artifacts);

var accounts;
var account;

window.App = {
  start: function() {
    var self = this;

    MetaCoin.setProvider(web3.currentProvider);

    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[1];

      self.getMessage();
      self.refreshBalance();
    });
  },

  getMessage: function() {
    var self = this;
    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getMessage.call(account, {from: account});
    }).then(function(value) {
      var status = document.getElementById("messageField");
      status.innerHTML = value.valueOf();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting balance; see log.");
    });
  },

  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },
  
  refreshBalance: function() {
    var self = this;
    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getBalance.call(account, {from: account});
    }).then(function(value) {
      var balance_element = document.getElementById("balance");
      balance_element.innerHTML = value.valueOf();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting balance; see log.");
    });
  },

  sendCoin: function() {
    var self = this;
    var amount = parseInt(document.getElementById("amount").value);
    var receiver = document.getElementById("receiver").value;
    var message = document.getElementById("message").value;
    this.setStatus("Initiating transaction... (please wait)");
    console.log(message);
    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.sendCoin(receiver, amount, message, {from: account});
    }).then(function() {
      self.setStatus("Transaction complete!");
      self.refreshBalance();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error sending coin; see log.");
    });
  }
};

window.addEventListener('load', function() {
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();
});
