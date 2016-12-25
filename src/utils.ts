

export class Utils {
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