/**
 * Create and export confriguration variables
 */

//Container for all the environments
var environments = {};

//staging (defalut) environment
environments.staging ={
   'httpPort': 3000,
   'httpsPort': 3001,
   'envName': 'staging',
   'hashingSecret':'thisIsASecret'
};

//Production environment
environments.production ={
   'httpPort': 5000,
   'httpsPort':5001,
   'envName': 'production',
   'hashingSecret':'thisIsAlsoASecret'
};

// Determine which enviroment was passed as command-line argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check wheater currentEnviroment variable is present in environments or not if not then default to staging.
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment]: environments.staging;

//Export the module

module.exports = environmentToExport;