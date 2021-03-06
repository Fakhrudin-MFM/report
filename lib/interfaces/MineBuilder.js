/**
 * Created by krasilneg on 29.12.16.
 */
'use stict';

function MineBuilder() {
  /**
   * Method to obtain information about the latest data mine assembly
   * @param {String} mine
   * @param {String} name
   * @param {String} [namespace]
   * @returns {Promise}
   */
  this.sourceInfo = function (mine, name, namespace) {
    return this._sourceInfo(mine, name, namespace);
  };

  /** Data mine assembly method
   * @param {String} mine
   * @param {{}} source
   * @param {{}} [options]
   * @param {String} [options.namespace]
   * @returns {Promise}
   */
  this.buildSource = function (mine, source, options) {
    return this._buildSource(mine, source, options || {});
  };
}

module.exports = MineBuilder;
