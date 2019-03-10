import "../stylesheets/app.css";

import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

import metacoin_artifacts from '../../build/contracts/MetaCoin.json'

var MetaCoin = contract(metacoin_artifacts);

var accounts;
var account;
var currMes = "";

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

      // var block = web3.eth.getBlock("latest");
      // console.log("gasLimit: " + block.gasLimit);

      accounts = accs;
      account = accounts[0];

      var balance_element = document.getElementById("account");
      balance_element.value = account;
      
      self.getMessage();
    });
  },

  getMessage: function() {
    var self = this;
    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getMessage.call(account, {from: account});
    }).then(function(value) {
      // value+= ',12-Daya-add,34-Roshan Sodhi-rem'
      if (value != 'none'){
        currMes = value;
        var nHTML = "";
        var toDoItems = [];
        toDoItems = value.split(',');
        toDoItems.forEach(function(item) {
          if (item!='')
          {
            nHTML += '<ul id="outer">'
            var nsh = item.split('-');
            if (nsh[2]=="add")
              nHTML += 

          '<div class="input-group">'
              +'<div class="input-group-prepend">'
                +'<span class="input-group-text" style="width: 35px;">+</span>'
              +'</div>'
              +'<li class="form-control">' + nsh[1] + ' sent <span id="green">'+nsh[0]+'</span> ETH to your account' + '</li>'              
            +'</div>';


            else
          nHTML +=
          '<div class="input-group">'
              +'<div class="input-group-prepend">'
                +'<span class="input-group-text" style="width: 35px;">-</span>'
              +'</div>'
              +'<li class="form-control"><span id="red">' + nsh[0] + '</span> ETH sent to '+nsh[1] + '</li>'              
            +'</div>';


               
            nHTML += '</ul>'
          }
        });
        document.getElementById("item-list").innerHTML = '<ul>' + nHTML + '</ul>'
      }
      else{
        document.getElementById("item-list").innerHTML = '<ul id="outer"><li>None<li></ul>'
      }


    }).catch(function(e) {
      console.log(e);
      // self.setStatus("Error getting message; see log.");
    });
  },

  setStatus: function(message) {
    alert(message);
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
      // self.setStatus("Error getting balance; see log.");
    });
  },

  sendCoin: function() {
    var self = this;
    // self.getMessage();

    var amount = parseInt(document.getElementById("amount").value);
    var receiver = document.getElementById("receiver").value;
    var firstNameS = document.getElementById("firstNameS").value;
    var lastNameS = document.getElementById("lastNameS").value;
    var firstNameR = document.getElementById("firstNameR").value;
    var lastNameR = document.getElementById("lastNameR").value;

    console.log(account);
    console.log(receiver);
    console.log(amount);
    console.log(firstNameS);
    console.log(firstNameR);

    var meta;
    var meta1;
    
    MetaCoin.deployed().then(function(instance) {
      meta1 = instance;
      return meta1.getMessage.call(receiver, {from: account});
    }).then(function(value) {
       
            MetaCoin.deployed().then(function(instance1) {
            meta = instance1;
            return meta.sendCoin(receiver, amount, value+','+amount+'-'+firstNameS+' '+lastNameS+'-'+'add,',currMes+','+amount+'-'+firstNameR+' '+lastNameR+'-'+'rem,', {from: account});
      
          }).then(function() {
    
            self.setStatus("Transaction Successful!");
            // location.reload();
            self.getMessage();

    
          }).catch(function(e) {
    
            console.log(e);
            self.setStatus("Transaction Failed!, see log.");
    
          });
    
    }).catch(function(e) {
      console.log(e);
      // self.setStatus("Transaction Failed!; see log.");
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
