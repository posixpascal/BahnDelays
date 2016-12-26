/**
 * Utility class for various helpers
 * 
 * @export
 * @class Utils
 */
export class Utils {
    
    /**
     * Groups a 2d array into an array of multiple groups
     * 
     * @static
     * @param {any} list The initial 2d array
     * @param {any} size The size of each array
     * @returns A new array containing grouped arrays of given size
     * 
     * @memberOf Utils
     */
    static group(list, size) {
        const result = [];
        let index = 0;
        let groupList = [];
        list.forEach((item) => {
            groupList.push(item);
            if (index++ >= size){
                index = 0;
                result.push(groupList);
                groupList = [];
            }
        });
        if (groupList.length){
            result.push(groupList);
        }
        return result;
    } 
};