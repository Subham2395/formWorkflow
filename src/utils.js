import { omit, reverse, is, sortWith, prop, descend, ascend, findIndex, propEq } from "ramda";

export const uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
export const createData = (name, description, date, last_update, status) => {
  return { id: uuidv4(), name, description, date, last_update, status };
};
export const getHeaders = [
  "name",
  "description",
  "last updated",
  "created date",
];
const { NODE_ENV } = process.env;
export const noop = () => {};
export const isDev = NODE_ENV === "development" || NODE_ENV === "dev";
export const render = component => () => component;
export const isOnline = window.navigator.onLine;
export const getPath = name => {
  let pathMeta = {
    default: "/",
    root: "/",
    edit: "/",
    list: "/",
    add: "/"
  };
  if (name === "workflow") {
    return (pathMeta = {
      default: "/",
      root: "/workflow/new",
      edit: "/workflow/:uid?/:item/:version",
      list: "/workflow/list",
      add: "/workflow/new"
    });
  } else if (name === "element") {
    return (pathMeta = {
      default: "/",
      root: "/element",
      edit: "/element/edit",
      list: "/element/list",
      add: "/element/new"
    });
  }
  return pathMeta;
};
export function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}

export const toggleActiveStatus = item => (item === "active" ? true : false);

export const asyncDelay = ms => new Promise(res => setTimeout(res, ms));

/**
 * Ramda utils
 */
export const _omit = (key, data) => {
  return omit([...key], data);
}

export const _reverse = data => {
  return reverse(data);
}
export const _sortBy = (value, {
  type = 'ascend',
  key
}) => {
  const sortByKey = sortWith([
    type === 'descend' ? descend(prop(key)) : ascend(prop(key))
  ]);
  return sortByKey(value);
}
export const isArray = value => {
  return Array.isArray(value);
}
export const isNumber = value => {
  return is(Number, value);
}
export const isObject = value => {
  return is(Object, value);
}
export const isString = value => {
  return is(String, value);
}
export const _findIndex = (key, value, data) => {
  return findIndex(propEq(key, value))(data);
}


