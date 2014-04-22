/**
 * Created by Ely on 4/21/2014.
 */
if (typeof context.sjl.namespace !== 'function') {
    /**
     * Takes a namespace string and fetches that location out from
     * an object/Map.  If the namespace doesn't exists it is created then
     * returned.
     * Example: namespace('hello.world.how.are.you.doing', obj) will
     * create/fetch within `obj`:
     * hello: { world: { how: { are: { you: { doing: {} } } } } }
     * @param ns_string {String} the namespace you wish to fetch
     * @param objToSearch {Object} object to search for namespace on
     * @param valueToSet {Object} optional, a value to set on the key
     *  (last key if key string (a.b.c.d = value))
     * @returns {Object}
     */
    context.sjl.namespace = function (ns_string, objToSearch, valueToSet) {
        var parts = ns_string.split('.'),
            parent = objToSearch,
            shouldSetValue = classOfIs(valueToSet, 'Undefined')
                ? false : true,
            i;

        for (i = 0; i < parts.length; i += 1) {
            if (classOfIs(parent[parts[i]], 'Undefined') && !shouldSetValue) {
                parent[parts[i]] = {};
            }
            else if (i === parts.length - 1 && shouldSetValue) {
                parent[parts[i]] = valueToSet;
            }
            parent = parent[parts[i]];
        }

        return parent;
    };
}