/**
 * Created by kras on 27.12.16.
 */
'use strict';

function ReportMetaRepository() {

  /**
   * Method initializes the repository, loading metadata.
   * returns promise to pass control to caller code
   *
   * @returns {Promise}
   */
  this.init = function () {
    return this._init();
  };

  /**
   * Method returns a data mine of the namespace
   *
   * @param {String} [namespace] - namespace
   * @returns {DataMine[]}
   */
  this.getDataMines = function (namespace) {
    return this._getDataMines(namespace);
  };

  /**
   * Method returns a data mine corresponding to the name
   *
   * @param {String} name - node code
   * @param {String} [namespace] - namespace
   * @returns {DataMine | null}
   */
  this.getDataMine = function (name, namespace) {
    return this._getDataMine(name, namespace);
  };

  this.getNavigationNodes = function (parent, namespace) {
    return this._getNavigationNodes(parent, namespace);
  };

  this.getNavigationNode = function (code, namespace) {
    return this._getNavigationNode(code, namespace);
  };
}

module.exports = ReportMetaRepository;
