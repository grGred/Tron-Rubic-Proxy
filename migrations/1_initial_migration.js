// var Migrations = artifacts.require("./Migrations.sol");
//
// module.exports = function(deployer) {
//   deployer.deploy(Migrations);
// };
var RubicProxy = artifacts.require("./RubicProxy.sol");

module.exports = function(deployer) {
  deployer.deploy(RubicProxy, 15371844928, 0, ['TFHc9qsQCiepyyUQynnVVrQwMxZ37Fi15N'], [],[],[]);
};