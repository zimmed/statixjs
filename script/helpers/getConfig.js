const fs = require('fs');
const process = require('process');
const { resolve } = require('path');

const SCHEMA = {
  name: { type: 'string', default: 'Untitled Website', warn: true },
  shortName: { type: 'string', optional: true },
  domain: { type: 'string', default: 'localhost', warn: true },
  language: { type: 'string', default: 'en' },
  region: { type: 'string', default: 'US' },
  description: { type: 'string', default: 'An untitled statixjs website.', warn: true },
  scripts: {
    type: 'array',
    default: [],
    schema: {
      type: 'object',
      schema: {
        src: { type: 'string' },
        type: { type: 'string', optional: true },
        head: { type: 'boolean', optional: true },
        async: { type: 'boolean', optional: true },
      },
    },
  },
  icons: {
    type: 'array',
    default: [],
    warn: true,
    schema: {
      type: 'object',
      schema: {
        src: { type: 'string' },
        rel: { type: 'string', optional: true },
        sizes: { type: 'string', optional: true },
        type: { type: 'string', optional: true },
      },
    },
  },
  styles: { type: 'array', default: [], schema: { type: 'string' } },
  theme: {
    type: 'object',
    schema: {
      breakpoints: {
        type: 'object',
        schema: {
          xs: { type: 'number', default: 0 },
          sm: { type: 'number', default: 576 },
          md: { type: 'number', default: 768 },
          lg: { type: 'number', default: 992 },
          xl: { type: 'number', default: 1200 },
          xxl: { type: 'number', default: 1400 },
        },
      },
      palette: {
        type: 'object',
        warn: true,
        schema: {
          fg: { type: 'string', default: '#333' },
          bg: { type: 'string', default: '#DDD' },
          fgHighlight: { type: 'string', default: '#000' },
          bgHighlight: { type: 'string', default: '#FFF' },
          link: { type: 'string', default: '#004080' },
          linkHover: { type: 'string', default: '#0080C0' },
        },
      },
      font: {
        type: 'object',
        warn: true,
        schema: {
          heading: { type: 'string', default: 'serif' },
          body: { type: 'string', default: 'sans-serif' },
        },
      },
    },
  },
  buildOptions: {
    type: 'object',
    schema: {
      srcPath: { type: 'string', default: 'src' },
      assetsPath: { type: 'string', default: 'assets' },
      buildPath: { type: 'string', default: 'build' },
      websitePath: { type: 'string', default: 'public_html' },
      manifest: { type: 'boolean', optional: true },
      bundleStyles: { type: 'boolean', optional: true },
    },
  },
  devServerOptions: {
    type: 'object',
    schema: {
      port: { type: 'number', default: 3000 },
    },
  },
};

function validateSchema(
  { type = 'any', warn, default: def, optional, schema } = {},
  value,
  field = '',
  verbose = false
) {
  if (type === 'any' || type === '*') return value;
  if (type === 'array') {
    if (!value) {
      if (warn && verbose) console.warn(`No "${field}" specified... using default`);
      return def;
    }
    if (!Array.isArray(value)) throw new Error(`Type mismatch: expected Array at "${field}".`);
    if (value?.length && schema)
      return value.map((v, i) => validateSchema(schema, v, `${field}[${i}]`, verbose));
    return value;
  }
  if (type === 'object') {
    if (!value) {
      if (warn && verbose) console.warn(`No "${field}" specified... using default`);
      return typeof def === 'undefined' && schema
        ? validateObjectSchema(schema, {}, field, verbose)
        : def;
    }
    if (typeof value !== 'object') throw new Error(`Type mismatch: expected Object at "${field}".`);
    if (schema) return validateObjectSchema(schema, value, field, verbose);
    return value;
  }
  if (
    type === typeof value ||
    ((typeof def !== 'undefined' || optional) && typeof value === 'undefined')
  ) {
    if (typeof value === 'undefined') {
      if (warn && verbose) console.warn(`No "${field}" specified... using default`);
      return def;
    }
    return value;
  }
  if (typeof value === 'undefined') {
    throw new Error(`Required field not defined for "${field}"`);
  }
  throw new Error(`Type mismatch: expected ${type} but got ${typeof value} at "${field}"`);
}

function validateObjectSchema(schema, obj, field = '', verbose) {
  const out = {};

  Object.keys(schema).forEach((key) => {
    out[key] = validateSchema(
      schema[key],
      obj[key],
      [field, key].filter(Boolean).join('.'),
      verbose
    );
  });
  return out;
}

function validateConfig(cfg, verbose) {
  return validateObjectSchema(SCHEMA, cfg, verbose);
}

module.exports = function getConfig(verbose = false) {
  let SITE = null;

  try {
    SITE = fs.readFileSync(resolve(process.cwd(), 'siteconfig.json'), 'utf8').toString();
    if (!SITE) throw new Error(`No siteconfig.json in project root!`);
  } catch (e) {
    throw e;
  }

  try {
    SITE = JSON.parse(SITE);
  } catch (e) {
    throw new Error(`siteconfig.json is not valid JSON format: ${e?.message || e}`);
  }

  try {
    SITE = validateConfig(SITE, verbose);
  } catch (e) {
    throw new Error(`Invalid siteconfig.json: ${e?.message || e}`);
  }

  return SITE;
};
