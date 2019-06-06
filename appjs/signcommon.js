var signCommon = {};
var fontlib = require('./fontlib');
module.exports = signCommon;

signCommon.LoadArrays = function(con)
{
    // colors
    con.query("SELECT id,name,value FROM colors ORDER BY ID;",function(err,result,fields){
        if(err)
        {
            throw err;
        }
        // load the default first
        // no zero based ID's in the db
        signCommon.signColors = [{"id":0,"value":0,"name":"NONE","color":"#FFFFFF"}];
        var count = 1;
        for(var i in result)
        {
            signCommon.signColors[count] = {};
            signCommon.signColors[count].id = result[i].id;
            signCommon.signColors[count].name = result[i].name;
            signCommon.signColors[count].value = result[i].value;
            count++;
        }
    });

    // shapes
    con.query("SELECT * FROM signshape ORDER BY ID;",function(err,result,fields){
        if(err)
        {
            throw err;
        }
        // value and ID are synonymous here
        signCommon.signShapes = [{"id":0,"name":"CHOOSE","value":0,"corners":null}];
        var count = 1;
        for(var i in result)
        {
            signCommon.signShapes[count] = {};
            signCommon.signShapes[count].id = result[i].id;
            signCommon.signShapes[count].name = result[i].name;
            signCommon.signShapes[count].value = result[i].id;
            signCommon.signShapes[count].corners = result[i].cornersJson;
            count++;
        }
    });

    // border types
    con.query("SELECT * FROM bordertype ORDER BY ID;",function(err,result,fields){
        if(err)
        {
            throw err;
        }
        signCommon.borderType = [{"id":0,"name":"NONE","value":0}];
        var count = 1;
        for(var i in result)
        {
            signCommon.borderType[count] = {};
            signCommon.borderType[count].id = result[i].id;
            signCommon.borderType[count].name = result[i].name;
            signCommon.borderType[count].value = result[i].id;
            count++;
        }
    });

    con.query("SELECT * FROM dividertype ORDER BY ID;",function(err,result,fields){
        if(err)
        {
            throw err;
        }
        signCommon.dividerType = [{"id":0,"name":"NONE","value":0}];
        var count = 1;
        for(var i in result)
        {
            signCommon.dividerType[count] = {};
            signCommon.dividerType[count].id = result[i].id;
            signCommon.dividerType[count].name = result[i].name;
            signCommon.dividerType[count].value = result[i].id;
            count++;
        }
    });

    con.query("SELECT * FROM shapeobject ORDER BY ID;",function(err,result,fields){
        if(err)
        {
            throw err;
        }
        signCommon.shapeObject = [{"id":0,"name":"NONE","value":0}];
        var count = 1;
        for(var i in result)
        {
            signCommon.shapeObject[count] = {};
            signCommon.shapeObject[count].id = result[i].id;
            signCommon.shapeObject[count].name = result[i].name;
            signCommon.shapeObject[count].value = result[i].id;
            count++;
        }
    });

    con.query("SELECT id,name FROM symbolcategory WHERE isSubCategory = false ORDER BY ID;",function(err,result,fields){
        if(err)
        {
            throw err;
        }
        signCommon.symbolCategory = [{"id":0,"name":"NONE","value":0}];
        var count = 1;
        for(var i in result)
        {
            signCommon.symbolCategory[count] = {};
            signCommon.symbolCategory[count].id = result[i].id;
            signCommon.symbolCategory[count].name = result[i].name;
            signCommon.symbolCategory[count].value = result[i].id;
            count++;
        }
    });

    con.query("SELECT id,name,fkCategory,fkSubCategory,width,height,bFill,CONVERT(data USING utf8) as data FROM symbol ORDER BY fkCategory,name;",function(err,result,fields){
        if(err)
        {
            throw err;
        }
        signCommon.symbols = [];
        signCommon.symbols[0] = {};
        var count = 0;
        var cat = 0;
        for(var i in result)
        {
            if(cat != result[i].fkCategory)
            {
                cat = result[i].fkCategory;
                signCommon.symbols[cat] = {};
                signCommon.symbols[cat].category = cat;
                signCommon.symbols[cat].items = [];
                count = 0;
            }
            signCommon.symbols[cat].items[count] = {};
            signCommon.symbols[cat].items[count].id = result[i].id;
            signCommon.symbols[cat].items[count].name = result[i].name;
            signCommon.symbols[cat].items[count].value = count;
            signCommon.symbols[cat].items[count].width = result[i].width;
            signCommon.symbols[cat].items[count].height = result[i].height;
            signCommon.symbols[cat].items[count].bFill = result[i].bFill;
            signCommon.symbols[cat].items[count].data = result[i].data;
            count++;
        }
    });

    this.UpdateSignList(con);
}
signCommon.UpdateSignList = function(con)
{
    con.query("SELECT id,name FROM autosign ORDER BY name;",function(err,result,fields){
        if(err)
        {
            throw err;
        }
        signCommon.signList = [{"id":0,"name":"New Sign","value":0}];
        var count = 1;
        for(var i in result)
        {
            signCommon.signList[count] = {};
            signCommon.signList[count].id = result[i].id;
            signCommon.signList[count].name = result[i].name;
            signCommon.signList[count].value = result[i].id;
            count++;
        }
    });
}
signCommon.findSymbolByIdx = function(cat,idx)
{
    return signCommon.symbols[cat].items[idx];
}
/*signCommon.signColors = [];
var signColors = [
    {"name":"NONE","value":"#FFFFFF","Pantone":"White","CMYK":"0 0 0 0","RGB":"100 100 100"},
    {"name":"White","value":"#EEEEEE","Pantone":"White","CMYK":"0 0 0 0","RGB":"100 100 100"},
    {"name":"Black","value":"#000000","Pantone":"Black","CMYK":"0 0 0 255","RGB":"0 0 0"},
    {"name":"Blue","value":"#002F6C","Pantone":"294","CMYK":"100 69 7 30","RGB":"0 47 108"},
    {"name":"Brown","value":"#693F23","Pantone":"294","CMYK":"24 79 100 73","RGB":"105 63 35"},
    {"name":"Green","value":"#006747","Pantone":"294","CMYK":"93 10 75 43","RGB":"0 103 71"},
    {"name":"Orange","value":"#E57200","Pantone":"294","CMYK":"0 66 100 0","RGB":"229 114 0"},
    {"name":"Pink","value":"#DF4661","Pantone":"294","CMYK":"0 82 37 0","RGB":"223 70 97"},
    {"name":"Purple","value":"#6D2077","Pantone":"294","CMYK":"67 100 4 5","RGB":"109 32 119"},
    {"name":"Red","value":"#A6192E","Pantone":"294","CMYK":"7 100 82 26","RGB":"166 25 46"},
    {"name":"Yellow","value":"#FFCD00","Pantone":"294","CMYK":"0 14 100 0","RGB":"255 205 0"},
    {"name":"Yellow-Green","value":"#C4D600","Pantone":"294","CMYK":"28 0 100 0","RGB":"196 214 0"}
];*/

signCommon.GetColorFromIndex = function(idx)
{
    return signCommon.signColors[idx].value;
}

signCommon.GetColorCombo = function(id)
{
    var htm = '<select id="' + id + '">';
    for(var clr in signCommon.signColors)
    {
        htm += '<option value="' + signCommon.signColors[clr].value + '">' + signCommon.signColors[clr].name + '</option>';
    }
    htm += "</select>";
    return htm;
}

/*var borderType = [
    {"name":"None","value":0},
    {"name":"Line Border","value":1},
    {"name":"Inset Border","value":2}
];*/

signCommon.GetBordersCombo = function(id)
{
    var htm = '<select id="'+ id + '">';
    for(var i in signCommon.borderType)
    {
        htm += '<option value="' + signCommon.borderType[i].value + '">' + signCommon.borderType[i].name + '</option>';
    }
    htm += "</select>";
    return htm;
}

// var signShapes = [{"name":"CHOOSE","value":0},{"name":"Rectangle","value":1},{"name":"Diamond","value":2}];

signCommon.GetSignShapeCombo = function(id)
{
    var htm = '<select id="'+ id + '">';
    for(var i in signCommon.signShapes)
    {
        htm += '<option value="' + signCommon.signShapes[i].value + '">' + signCommon.signShapes[i].name + '</option>';
    }
    htm += "</select>";
    return htm;
}

signCommon.GetScaleFactor = function(curSize, desiredSize)
{
    return desiredSize/curSize;
}

