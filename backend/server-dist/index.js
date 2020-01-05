/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./graphql/schema.js":
/*!***************************!*\
  !*** ./graphql/schema.js ***!
  \***************************/
/*! exports provided: typeDefs, resolvers */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"typeDefs\", function() { return typeDefs; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"resolvers\", function() { return resolvers; });\n/* harmony import */ var _list_ListModel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../list/ListModel */ \"./list/ListModel.js\");\n/* harmony import */ var apollo_server_express__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! apollo-server-express */ \"apollo-server-express\");\n/* harmony import */ var apollo_server_express__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(apollo_server_express__WEBPACK_IMPORTED_MODULE_1__);\n// import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLSchema, GraphQLID, GraphQLNonNull } from 'graphql';\n// import _ from 'lodash';\n// import ListType from '../list/ListType';\n\n\nconst typeDefs = apollo_server_express__WEBPACK_IMPORTED_MODULE_1__[\"gql\"]`\n  input ListInput {\n    name: String\n    data: Boolean\n  }\n  \n  type List {\n    id: ID\n    data: String\n  }\n  \n  type Query {\n    lists: [List]\n    lists(id: ID, name: String): List\n  }\n  \n  type Mutation {\n    addList(input: ListInput): List\n    updateList(id: ID, input: ListInput): List\n    removeList(id: ID): List\n  }\n`;\nconst resolvers = {\n  Query: {\n    list: (parent, args) => {\n      const {\n        id,\n        name\n      } = args;\n      return id ? _list_ListModel__WEBPACK_IMPORTED_MODULE_0__[\"default\"].findById(id) : _list_ListModel__WEBPACK_IMPORTED_MODULE_0__[\"default\"].findOne({\n        name\n      });\n    },\n    lists: () => _list_ListModel__WEBPACK_IMPORTED_MODULE_0__[\"default\"].find({})\n  },\n  Mutation: {\n    addList: (parent, args) => {\n      return _list_ListModel__WEBPACK_IMPORTED_MODULE_0__[\"default\"].create(args.input);\n    },\n    updateList: (parent, args) => {\n      const {\n        id,\n        input\n      } = args;\n      return _list_ListModel__WEBPACK_IMPORTED_MODULE_0__[\"default\"].findByIdAndUpdate(id, {\n        $set: input\n      }, {\n        new: true\n      });\n    },\n    removeList: (parent, args) => {\n      return _list_ListModel__WEBPACK_IMPORTED_MODULE_0__[\"default\"].findOneAndRemove({\n        _id: args.id\n      });\n    }\n  }\n};\n\n//# sourceURL=webpack:///./graphql/schema.js?");

/***/ }),

/***/ "./list/ListController.js":
/*!********************************!*\
  !*** ./list/ListController.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _ListModel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ListModel */ \"./list/ListModel.js\");\n\n\nconst ListController = () => ({\n  getList: (parent, args) => {\n    try {\n      return args.id ? _ListModel__WEBPACK_IMPORTED_MODULE_0__[\"default\"].findById(args.id) : _ListModel__WEBPACK_IMPORTED_MODULE_0__[\"default\"].findOne({\n        name: args.name\n      });\n    } catch (error) {\n      throw new Error(`List with id ${args.id} could not be retrieved`);\n    }\n  },\n  getLists: async () => {\n    try {\n      return await _ListModel__WEBPACK_IMPORTED_MODULE_0__[\"default\"].find({});\n    } catch (error) {\n      throw new Error('Lists could not be retrieved');\n    }\n  },\n  addList: async (parent, args) => {\n    try {\n      const newList = _ListModel__WEBPACK_IMPORTED_MODULE_0__[\"default\"].create(args.input);\n      return {\n        message: `New List created with id ${newList.id}`\n      };\n    } catch (error) {\n      throw new Error('List could not be added');\n    }\n  },\n  updateList: async (parent, args) => {\n    try {\n      return await _ListModel__WEBPACK_IMPORTED_MODULE_0__[\"default\"].findByIdAndUpdate(args.id, {\n        $set: args.input\n      }, {\n        new: true\n      });\n    } catch (error) {\n      throw new Error('List could not be updated');\n    }\n  },\n  removeList: async (parent, args) => {\n    try {\n      return await _ListModel__WEBPACK_IMPORTED_MODULE_0__[\"default\"].findOneAndRemove({\n        _id: args.id\n      });\n    } catch (error) {\n      throw new Error('List could not be updated');\n    }\n  }\n});\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (ListController);\n\n//# sourceURL=webpack:///./list/ListController.js?");

/***/ }),

/***/ "./list/ListModel.js":
/*!***************************!*\
  !*** ./list/ListModel.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _ListSchema__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ListSchema */ \"./list/ListSchema.js\");\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.model('List', _ListSchema__WEBPACK_IMPORTED_MODULE_1__[\"default\"]));\n\n//# sourceURL=webpack:///./list/ListModel.js?");

/***/ }),

/***/ "./list/ListSchema.js":
/*!****************************!*\
  !*** ./list/ListSchema.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\nconst ListSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0__[\"Schema\"]({\n  name: {\n    type: String,\n    required: true,\n    unique: true\n  },\n  data: [String]\n}, {\n  collection: 'app.list'\n});\n/* harmony default export */ __webpack_exports__[\"default\"] = (ListSchema);\n\n//# sourceURL=webpack:///./list/ListSchema.js?");

/***/ }),

/***/ "./list/index.js":
/*!***********************!*\
  !*** ./list/index.js ***!
  \***********************/
/*! exports provided: ListController */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _ListController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ListController */ \"./list/ListController.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"ListController\", function() { return _ListController__WEBPACK_IMPORTED_MODULE_0__[\"default\"]; });\n\n\n\n\n//# sourceURL=webpack:///./list/index.js?");

/***/ }),

/***/ "./server/index.js":
/*!*************************!*\
  !*** ./server/index.js ***!
  \*************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var apollo_server_express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! apollo-server-express */ \"apollo-server-express\");\n/* harmony import */ var apollo_server_express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(apollo_server_express__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _graphql_schema__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../graphql/schema */ \"./graphql/schema.js\");\n/* harmony import */ var _list__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../list */ \"./list/index.js\");\n\n\n\n\n\nconst basePort = 3000; // Note you don't have to use any particular http server, but\n// we're using Express in this example\n\nconst app = new express__WEBPACK_IMPORTED_MODULE_1___default.a();\nconst server = new apollo_server_express__WEBPACK_IMPORTED_MODULE_0__[\"ApolloServer\"]({\n  typeDefs: _graphql_schema__WEBPACK_IMPORTED_MODULE_3__[\"typeDefs\"],\n  resolvers: _graphql_schema__WEBPACK_IMPORTED_MODULE_3__[\"resolvers\"],\n  context: ({\n    req\n  }) => {\n    return {\n      controllers: {\n        List: _list__WEBPACK_IMPORTED_MODULE_4__[\"ListController\"]\n      }\n    };\n  },\n  formatError: error => {\n    throw Error(error.message); // TODO: https://medium.com/@estrada9166/return-custom-errors-with-status-code-on-graphql-45fca360852\n  }\n});\nserver.applyMiddleware({\n  app,\n  path: '/graphql'\n});\napp.listen(basePort, () => console.log( // eslint-disable-line no-console\n`app Server is now running on http://localhost:${basePort}`)); // TODO Move to database file\n\nmongoose__WEBPACK_IMPORTED_MODULE_2___default.a.connect('mongodb://admin:admin01@ds255463.mlab.com:55463/football-app');\nmongoose__WEBPACK_IMPORTED_MODULE_2___default.a.connection.once('open', () => {\n  console.log('Database connected');\n});\n\n//# sourceURL=webpack:///./server/index.js?");

/***/ }),

/***/ 0:
/*!*******************************!*\
  !*** multi ./server/index.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__(/*! ./server/index.js */\"./server/index.js\");\n\n\n//# sourceURL=webpack:///multi_./server/index.js?");

/***/ }),

/***/ "apollo-server-express":
/*!****************************************!*\
  !*** external "apollo-server-express" ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"apollo-server-express\");\n\n//# sourceURL=webpack:///external_%22apollo-server-express%22?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");\n\n//# sourceURL=webpack:///external_%22express%22?");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"mongoose\");\n\n//# sourceURL=webpack:///external_%22mongoose%22?");

/***/ })

/******/ });