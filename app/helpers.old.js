const _ = require('lodash');
const axios = require("axios");
const cheerio = require("cheerio");

/**
 * Compose function arguments starting from right to left
 * to an overall function and returns the overall function
 */
const compose = (...fns) => arg => {
	return _.flattenDeep(fns).reduceRight(async (current, fn) => {
		if (_.isFunction(fn)) return fn(await current);
		throw new TypeError("compose() expects only functions as parameters.");
	}, arg);
};

/**
 * Handles the request(Promise) when it is fulfilled
 * and sends a JSON response to the HTTP response stream(res).
 */
const sendResponse = res => async request => {
	return await request
		.then(data => res.json({ status: "success", data }))
		.catch(({ message = "Request failed.", status: code = 500 }) =>
			res.status(code).json({ status: "failure", code, message })
		);
};

/**
 * Loads the html string returned for the given URL
 * and sends a Cheerio parser instance of the loaded HTML
 */
const fetchHtmlFromURL = async url => {
	return await axios
		.get(url)
		.then(response => cheerio.load(response.data))
		.catch(error => {
			error.status = (error.response && error.response.status) || 500;
			throw error;
		});
};

/**
 * Fetches attributes of meta tags using the Cheerio parser instance
 * and returns an array of the values
 */
const extractMetaAttribute = $ => name => {
	const elems = $(`meta[name='${name}'], meta[property='${name}']`).toArray();
	const fetchAttr = attr => ({ attribs }) => attribs[attr] || null;
	return (attr = "content") => elems.map(fetchAttr(attr)).filter(val => !_.isNull(val));
};

/**
 * Extracts meta attributes as listed in the attrsMapping object
 * and returns an object with all the attribute:value pairs
 */
const extractMetaAttributesReducer = attrsMapping => $ => {
	const reducer = (final, key) => {
		const regex = new RegExp(`^(${key})(\\*)?$`);
		const [, finalKey, multiple] = key.match(regex);
		const attrs = extractMetaAttribute($)(attrsMapping[key])();

		return { ...final, [finalKey]: multiple ? attrs : attrs[0] };
	};

	return _.uniq(Object.keys(attrsMapping)).reduce(reducer, {});
};

module.exports = {
	compose,
	sendResponse,
	fetchHtmlFromURL,
	extractMetaAttribute,
	extractMetaAttributesReducer
};
