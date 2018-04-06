const {
	compose,
	fetchHtmlFromURL,
	extractMetaAttributesReducer
} = require('./helpers');

const SCOTCH_BASE = "https://scotch.io";

/**
 * Extract tutorials from a Scotch author's page using the Cheerio parser instance
 * and returns an array of the tutorial links
 */
const extractTutorials = $ => {
	return $("[data-type=post] a[href][data-src]").toArray().reduce((all, link) => {
		const { href } = link.attribs;
		const post = href ? `${SCOTCH_BASE}${href}` : null;
		// return /^\/tutorials\//.test(href) ? [...all, { post }] : all;
		return [...all, post];
	}, []);
};

/**
 * Extract the metadata for each Scotch tutorial
 * and returns a Promise of an array containing the hashes of tutorials' metadata
 */
const extractTutorialsMetadata = async tutorials => {
	const extractMetadata = extractMetaAttributesReducer({
		title: "og:title",
		url: "og:url",
		banner: "og:image",
		description: "og:description",
		type: "og:type",
		"tags*": "article_tags"
	});

	const metadataFetch = compose(extractMetadata, fetchHtmlFromURL);
	const fetchMap = post => metadataFetch(post).catch(error => ({}));

	return await Promise.all(tutorials.map(fetchMap));
};

/**
 * Fetches the Scotch tutorials with metadata for the given author
 */
const fetchAuthorTutorials = author => {
	const AUTHOR_URL = `${SCOTCH_BASE}/@${author.toLowerCase()}`;
	return compose(extractTutorialsMetadata, extractTutorials, fetchHtmlFromURL)(AUTHOR_URL);
};

module.exports = {
	extractTutorials,
	extractTutorialsMetadata,
	fetchAuthorTutorials,
};
