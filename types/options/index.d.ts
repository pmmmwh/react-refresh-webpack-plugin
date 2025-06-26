/**
 * Sets a constant default value for the property when it is undefined.
 * @template T
 * @template {keyof T} Property
 * @param {T} object An object.
 * @param {Property} property A property of the provided object.
 * @param {T[Property]} [defaultValue] The default value to set for the property.
 * @returns {T[Property]} The defaulted property value.
 */
export function d<T, Property extends keyof T>(
  object: T,
  property: Property,
  defaultValue?: T[Property]
): T[Property];
/**
 * Resolves the value for a nested object option.
 * @template T
 * @template {keyof T} Property
 * @param {T} object An object.
 * @param {Property} property A property of the provided object.
 * @param {function(T[Property] | undefined): T[Property]} fn The handler to resolve the property's value.
 * @returns {T[Property]} The resolved option value.
 */
export function n<T, Property extends keyof T>(
  object: T,
  property: Property,
  fn: (arg0: T[Property] | undefined) => T[Property]
): T[Property];
