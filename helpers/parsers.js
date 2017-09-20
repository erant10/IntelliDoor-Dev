function parseSqlOutput(output, callback) {
    var jsonArray = []
    output.forEach(function (columns) {
        var rowObject ={};
        columns.forEach(function(column) {
            rowObject[column.metadata.colName] = column.value;
        });
        jsonArray.push(rowObject)
    });
    // call the callback function
    callback(null, jsonArray);

}