const bunyan = require('bunyan');
const bformat = require('bunyan-format');

/**
 *
 * @param opts
 * @param opts.name { string } name of your logger
 * @param opts.stream // optional override
 * @param opts.level { }
 * @returns {Logger}
 */
const logger = (opts) => {
	//todo: options for color
	const formatOut = bformat({ outputMode: 'short', levelInString: true });

	return bunyan.createLogger({ name: opts.name, stream: formatOut, level: 'debug' });
};

module.exports = { logger };
