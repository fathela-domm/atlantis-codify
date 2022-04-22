/**
 * @param date: date to check and validate whether today || tommorrow ||yesterday 
 */
export const validateDaysDate = (_date: string | Date) => {
    let date = new Date(_date).toDateString();
    /**
    * find out whether the date is today
     */
    /**
    * find out whether the date is yesterday
    */
    if (date === new Date(Date.now() - 86400000).toDateString()) {
        return "Yesterday";
    }

    else if (date === new Date().toDateString()) {
        return 'Today';
    }

    /**
    * find out whether the date is tomorrow
    */
    else if (date === new Date(Date.now() + 86400000).toDateString()) {
        return "Tomorrow";
    }
}

/**
    * @param arrayOfObjects: array to group
    * @param groupBy: field of type Date to group by
    * @returns grouped object array according to the field groupBy
    */
export const groupJSONData = (arrayOfObjects: any, groupBy: any) => {
    var objectWithGroupByDate: any = {};
    let i = 0;
    for (var key in arrayOfObjects) {
        var singleDataNode = new Date(arrayOfObjects[key][groupBy]).toDateString();
        if (!objectWithGroupByDate[singleDataNode]) {
            i++;
            objectWithGroupByDate[singleDataNode] = [];
        }
        objectWithGroupByDate[singleDataNode].push(arrayOfObjects[key]);
    }
    return objectWithGroupByDate;
}