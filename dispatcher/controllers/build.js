/**
 * Created by krasilneg on 29.12.16.
 */
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
'use strict';

var moduleName = require('../../module-name');
var di = require('core/di');

/**
 * @param {MineBuilder} builder
 * @param {DataMine} mine
 * @param {{}} src
 * @returns {Function}
 */
function buildPromise(builder, mine, src, req) {
  return function () {
    return builder.buildSource(mine.name(), src, {namespace: mine.namespace()})
      .then(() => {
        return new Promise((resolve) => {
            req.session.mineBuilds[mine.canonicalName()] = req.session.mineBuilds[mine.canonicalName()] + 1;
          req.session.save(() => resolve());
        });
      });
  };
}

/* jshint maxstatements: 50, maxcomplexity: 30 */
module.exports = function (req, res) {
  /**
   * @type {{reportMeta: ReportMetaRepository, settings: SettingsRepository, sysLog: Logger}}
   */
  var scope = di.context(moduleName);

  var mineName = req.params.mine.split('@');

  /**
   * @type {DataMine|null}
   */
  var mine = scope.reportMeta.getDataMine(
    mineName.length > 1 ? mineName[1] : mineName[0],
    mineName.length > 1 ? mineName[0] : null
  );

  if (!mine) {
    return res.sendStatus(404);
  }

  var builders = scope.settings.get(moduleName + '.mineBuilders') || {};

  if (!builders.hasOwnProperty(mine.namespace()) || !builders[mine.namespace()].hasOwnProperty(mine.name())) {
    scope.sysLog.error('Mine data source collectors are not configured "' + mine.name() + '"');
    return res.sendStatus(404);
  }

  builders = builders[mine.namespace()][mine.name()];

  var builder = null;

  req.session.mineBuilds = req.session.mineBuilds || {};
  req.session.mineBuilds[mine.canonicalName()] = 0;

  mine.sources().forEach(function (src) {
    if (!builders.hasOwnProperty(src.name)) {
      scope.sysLog.warn('Data source collector is not configured "' + mine.name() + '.' + src.name + '".');
      return;
    }

    /**
     * @type {MineBuilder}
     */
    var b = scope[builders[src.name]];
    if (!b) {
      scope.sysLog.warn('No collector for source found "' + mine.name() + '.' + src.name + '".');
      return;
    }

    if (!builder) {
      builder = buildPromise(b, mine, src, req)();
    } else {
      builder = builder.then(buildPromise(b, mine, src, req));
    }
  });

  if (builder) {
    builder
      .then(
        function () {
          scope.sysLog.log('Formed array of raw data for mine ' + mine.canonicalName());
        }
      )
      .catch(
        function (err) {
          req.session.mineBuilds[mine.canonicalName()] = mine.sources().length;
          scope.sysLog.error(err);
        }
      );
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
};