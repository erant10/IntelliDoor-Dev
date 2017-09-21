
module.exports = {

    parseSqlOutput(output) {
        var jsonArray = []
        output.forEach(function (columns) {
            var rowObject ={};
            columns.forEach(function(column) {
                rowObject[column.metadata.colName] = column.value;
            });
            jsonArray.push(rowObject)
        });
        return jsonArray
    }

}