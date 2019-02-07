const mysql = require("mysql");
const cTable = require('console.table');
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Choice11518:)",
  database: "bamazon_db"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log('Welcome to Bamazon! Take a look at our products available below!')
  afterConnection();


});
function afterConnection() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity)
    }
    start();
  });
};
function start() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
  inquirer
    .prompt([
      {
      name: "productId",
      type: "input",
      message: "What's the ID of the item that you would like to purchase today?"
    },
      {
        name: "quantity",
        type: "input",
        message: "How many would you like to purchase today?"
      }
    ])
    .then(function (answer) {
      
      let productName;
      for (let j = 0; j < res.length; j++){
        if(res[j].item_id === parseInt(answer.productId)){
          productName = res[j];
        }
      }
      connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        if (productName.stock_quantity <= answer.quantity) {
          console.log(`Whoops!!! Looks like we don't have enough in stock, try a lesser quantity`)
          connection.end();
        } else {
          connection.query(
            "UPDATE products SET ? WHERE ?", 
            [{
            stock_quantity: productName.stock_quantity - answer.quantity
          },
          {
            item_ID: parseInt(answer.productId)
          }

          ],
            function (err) {
              if (err) throw err;
              console.log("You've bought: " + productName.product_name)
              console.log("Quantity: " + answer.quantity + " with a total of $" + ((productName.price * answer.quantity).toFixed(2)))
            
            connection.end()
          })
          }
      });
    });
  })
};



