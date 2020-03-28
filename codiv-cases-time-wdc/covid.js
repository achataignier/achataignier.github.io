(function () {
    var myConnector = tableau.makeConnector();

    
    myConnector.getSchema = function (schemaCallback) {
        var cols = [{
            id: "country",
            alias: "Country",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "date",
            alias: "Date",
            dataType: tableau.dataTypeEnum.date
        }, {
            id: "confirmed",
            alias: "Confirmed",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "death",
            alias: "Death",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "deltaconfirmed",
            alias: "Delta confirmed",
            dataType: tableau.dataTypeEnum.int
        }];
    
        var tableSchema = {
            id: "covidCasesTime",
            alias: "Covid cases per country vs time",
            columns: cols
        };
    
        schemaCallback([tableSchema]);
    };

    myConnector.getData = function (table, doneCallback) {

        $.ajax({
            type: "GET",
            url: "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/web-data/data/cases_time.csv",
            dataType: "text",
            success: function(data) {
                var data = $.csv.toArrays(data);

                tableData = [];

                for (var i = 1, len = data.length; i < len; i++) {

                    var parsed_date = data[i][1].split('/');

                    var day = parsed_date[1];
                    if (day.length<2) day = '0'+day;

                    var month = parsed_date[0];
                    if (month.length<2) month = '0'+month;

                    var year = parsed_date[2];
                    if (year.length<2) year = '0'+year;
                    year = '20'+year;

                    tableData.push({
                        "country":          data[i][0],
                        "date":             day +'/'+ month +'/'+ year,
                        "confirmed":        data[i][2],
                        "death":            data[i][3],
                        "deltaconfirmed":   data[i][6]
                    });
                }

                table.appendRows(tableData);
                doneCallback();
            }
         });
    };

    tableau.registerConnector(myConnector);
})();

$(document).ready(function () {
    $("#submitButton").click(function () {
    
        tableau.connectionName = "Covid cases per country vs time";
        tableau.submit();
    });
});
