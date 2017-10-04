
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
    },

    groupBy(xs, key) {
        return xs.reduce(function(rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    }

}