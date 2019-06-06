var common = require('./signcommon');
var svglib = require('./svglib');
var fontlib = require('./fontlib');
var borders = require('./borders');
var layout = require('./layout');
var allSymbols = null;
var arSymbolsHtm = null;
var arSymCategories = null;
var categoriesHtm = "";
var subCategoiresHtm = "";
//var symClickJava = "function OnSymbolClick(cat,id){}";

var signbuilder = {};
module.exports = signbuilder;

signbuilder.GetSignBase = function(sign)
{
    var newSign = borders.GetSignBase(sign.width,sign.height,sign.type,sign.shape);
    newSign.bgColor = sign.bgColor;
    newSign.textColor = sign.textColor;
    return newSign;
}

signbuilder.GetArrays = function()
{
    var items = {};
    items.signColors = common.signColors;
    items.signShapes = common.signShapes;
    items.borderType = common.borderType;
    items.dividerType = common.dividerType
    items.shapeObject = common.shapeObject;
    items.symbolCategory = common.symbolCategory;
    items.symbols = common.symbols;
    items.signList = common.signList;
    items.fonts = []; 
    for(var i = 0; i < fontlib.fonts.length; i++)
    {
        items.fonts[i] = {};
        items.fonts[i].id = i; // TODO: add fonts to database and get the ID from there (1 based)
        items.fonts[i].name = fontlib.fonts[i].name;
        items.fonts[i].value = i;
    }
    return JSON.stringify(items);
}

signbuilder.SaveSign = function(autosign, con,response)
{
    if(!("id" in autosign) || autosign.id <= 0)
    {
        con.query("INSERT INTO autosign (name,data) VALUES (?)", [[autosign.name,JSON.stringify(autosign)]],function(err,result){
            if(err)
            {
                //throw err;
                console.log("failed to insert record: " + err);
                response.end("-1");
                return;
            }
            response.end(String(result.insertId));
            common.UpdateSignList(con);
            return;
        });
    }else{
        con.query("UPDATE autosign SET ? WHERE ?",[{name: autosign.name, data: JSON.stringify(autosign)},{id: autosign.id}],function(err,result){
            if(err){
                //throw err;
                console.log("failed to update record");
                response.end(String("-1"));
            }
            response.end(String(autosign.id));
            return;
        });
    }
    //response.end("-1");
}

signbuilder.GetSignList = function(con)
{
    if(!("signList" in common) || common.signList.size == 0)
    {
        common.UpdateSignList(con);
    }
    return common.signList;
}

function GetSvgHeader(width, height)
{
    // xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
    return '<svg width="' + width + 'px" height="' + height + 'px" viewBox="0 0 '+ width +' '+ height +'" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">';
}

signbuilder.GetAutoSVG = function(autosign,sizeIdx)
{
    // sign from autosign
    var sign = this.SignDataFromAutosign(autosign, sizeIdx);
    //var svg = layout.SignDataToSVG(sign);
    // var desiredHeight = 300;
    // var maxWidth = 580;
    // var scaleFactor = common.GetScaleFactor(sign.height, desiredHeight);
    // if(sign.width*scaleFactor > maxWidth)
    // {
    //     scaleFactor = common.GetScaleFactor(sign.width, maxWidth);
    //     desiredHeight = sign.height * scaleFactor;
    // }
    return layout.SignDataToSVG(sign, 300,580);
    
    //return GetSvgHeader(sign.width*scaleFactor, sign.height*scaleFactor) + svglib.RenderSVG(svg, desiredHeight, 0,0) + "</svg>";
    //return this.GetSignSVG(sign);
}

signbuilder.GetSignSVG = function(signBase)
{
    signBase = borders.FillSignBase(signBase);
    var bgColor = common.GetColorFromIndex(signBase.bgColor);
    var textColor = common.GetColorFromIndex(signBase.textColor);
    var strSvg = GetSvgHeader(signBase);
	strSvg += '<path fill="' + (signBase.type <2?bgColor:textColor) + '" d="' + borders.GetRoundedPolySVG(signBase.edge) + '"/>';
	if(signBase.type > 0)
	{
		strSvg += '<path fill="' + (signBase.type == 1?textColor:bgColor) + '" d="' + borders.GetRoundedPolySVG(signBase.inset) + '"/>';
		if(signBase.type == 1)
		{
			strSvg += '<path fill="' + bgColor + '" d="' + borders.GetRoundedPolySVG(signBase.border) + '"/>';
		}
	}
	if("lines" in signBase)
	{
		for(var i in signBase.lines)
		{
			strSvg += '<path fill="' + textColor + '" d="';
			strSvg += fontlib.StringSVG(signBase.lines[i].text,signBase.lines[i].fontId,signBase.lines[i].size,signBase.lines[i].left,signBase.lines[i].top,signBase.lines[i].spacing);
			strSvg += '"/>';
		}
	}
	if("arrows" in signBase)
	{
		for(var i in signBase.arrows)
		{
			//signBase.arrows[i].height, singBase.arrows[i].length;
		}
    }
    strSvg += svglib.GetDoubleLRArrowData(300,50,0,150);
    
    strSvg += "</svg>";
	return strSvg;
}

signbuilder.GetCommonCombos = function()
{
    var combos = {};
    combos.bgColor = {};
    combos.bgColor.name = "cboBgColor";
    combos.bgColor.label = "Field Color";
    combos.bgColor.htm = common.GetColorCombo(combos.bgColor.name);
    
    combos.textColor = {};
    combos.textColor.name = "cboTextColor";
    combos.textColor.label = "Text Color";
    combos.textColor.htm = common.GetColorCombo(combos.textColor.name);

    combos.borders = {};
    combos.borders.name = "cboBorders";
    combos.borders.label = "Border Type";
    combos.borders.htm = common.GetBordersCombo(combos.borders.name);

    combos.signShape = {};
    combos.signShape.name = "cboSignShapes";
    combos.signShape.label = "Sign Shape";
    combos.signShape.htm = common.GetSignShapeCombo(combos.signShape.name);

    combos.fonts = {};
    combos.fonts.name = "cboFonts";
    combos.fonts.label = "Font:";
    combos.fonts.htm = fontlib.GetFontsCombo(combos.fonts.name);
    return (JSON.stringify(combos));
}

///////////////// SYMBOLS //////////////////////

function FillSymbolsHtm()
{
    if(arSymbolsHtm == null){
        arSymbolsHtm = [];
        var curCat = 0;
        var curStr = "";
        var catOpts = "";
        for(var i in allSymbols)
        {
            catOpts += "<option value='" + i + "'>"+allSymbols[i].catName+'</option>';
            curStr = "<div id='"+allSymbols[i].catName+"' style='width:350px;height:300px;overflow-y:scroll;'>";
            curStr += '<table>';
            var col = 0;
            for(var j in allSymbols[i].symbols)
            {
                if(col > 3)
                {
                    curStr += '</tr>'
                    col = 0;
                }
                if(col == 0)
                {
                    curStr += '<tr>';
                }
                curStr += "<td style='border:1px solid black;' onclick='OnSymbolClick(" + allSymbols[i].symbols[j].catId + ','+ allSymbols[i].symbols[j].id + ")'>";
                if(allSymbols[i].symbols[j].fill)
                {
                    curStr += "<svg width='72px' height='72px'><path fill='black' d='" + allSymbols[i].symbols[j].data + "'/></svg>";
                }else{
                    curStr += "<svg width='72px' height='72px'>" + allSymbols[i].symbols[j].data + '</svg>';
                }
                curStr += '</br>' + allSymbols[i].symbols[j].name + '</td>';
                col++;
            }
            arSymbolsHtm[i] = curStr + '</table></div>';
        }
    }
    return arSymbolsHtm;
}

signbuilder.LoadCategories = function(con)
{
    con.query("SELECT * FROM symbolcategory ORDER BY isSubCategory,ID;",function(err,result,fields){
        if(err)
        {
            throw err;
        }
        arSymCategories = [];
        categoriesHtm = '<select id="cboSymCategory" onchange="OnCategoryChange()">';
        subCategoiresHtm = '<select id="cboSymSubCategory" onchange="OnSubCategoryChange()">';
        for(var i in result)
        {
            arSymCategories[i] = {};
            arSymCategories[i].id = result[i].ID;
            arSymCategories[i].name = result[i].name;
            arSymCategories[i].isSubCategory = (result[i].isSubCategory == 1?true:false);
            if(arSymCategories[i].isSubCategory)
            {
                subCategoiresHtm += '<option value="'+arSymCategories[i].id+'">' + arSymCategories[i].name + '</option>';
            }else{
                categoriesHtm += '<option value="'+arSymCategories[i].id+'">' + arSymCategories[i].name + '</option>';
            }
        }
        categoriesHtm += '</select>';
        subCategoiresHtm += '</select>';
    });
}

signbuilder.LoadCommonArrays = function(con)
{
    common.LoadArrays(con);
}

signbuilder.GetCategoryHtm = function()
{
    return categoriesHtm;
}

signbuilder.getSubCategoryHtm = function()
{
    return subCategoiresHtm;
}

signbuilder.GetSymbolsHtm = function()
{
    return JSON.stringify(arSymbolsHtm);
}

signbuilder.LoadSymbols = function(con)
{
    con.query("SELECT symbol.ID,symbol.name,symbol.fkCategory,symbol.fkSubCategory,symbol.width,symbol.height,symbol.bFill,symbol.data,symbolcategory.name AS catName FROM symbol JOIN symbolcategory ON symbol.fkCategory = symbolcategory.ID ORDER BY symbol.fkCategory,symbol.fkSubCategory", function(err,result,fields){
        if (err){
            throw err;
        } 
        // ID,name,fkCategory,width,height,bFill,data
        //var str = '[';
        allSymbols = [];
        var curCat = -1;
        var category = 0;
        var curSymbol = 0;
        //var bFirst = true;
        for(var i in result)
        {
            if(category != result[i].fkCategory)
            {
                curCat++;
                category = result[i].fkCategory;
                allSymbols[curCat] = {};
                allSymbols[curCat].catId = category;
                allSymbols[curCat].catName = result[i].catName;
                allSymbols[curCat].symbols = [];
                bFirst = true;
                curSymbol = 0;
                //str += '{"catId":' + category + ',"catName":"' + result[i].catName + '","symbols":[';
            }
            
            //fontlib.GetModifiedPath(result[i].data, scale,transX,transY)
            allSymbols[curCat].symbols[curSymbol] = {};
            allSymbols[curCat].symbols[curSymbol].id = result[i].ID;
            allSymbols[curCat].symbols[curSymbol].name = result[i].name;
            allSymbols[curCat].symbols[curSymbol].catId = result[i].fkCategory;
            allSymbols[curCat].symbols[curSymbol].subCat = result[i].fkSubCategory;
            allSymbols[curCat].symbols[curSymbol].width = result[i].width;
            allSymbols[curCat].symbols[curSymbol].height = result[i].height;
            allSymbols[curCat].symbols[curSymbol].fill = result[i].bFill;
            allSymbols[curCat].symbols[curSymbol].data = result[i].data;
            curSymbol++;
            //str += '{"id":'+ result[i].ID +',"name":"'+result[i].name+'","subCat":'+result[i].fkSubCategory+',"width":'+result[i].width+',"height":'+result[i].height+',"fill":'+(result[i].bFill?'true':'false')+',"data":"'+result[i].data+'"}';
        }
        //str += "]}]";
        //res.end(str);
        FillSymbolsHtm();
    });
}


signbuilder.GetAllSignObjects = function()
{
    if(allSymbols == null){
        return "";   
    }
    if(arSymbolsHtm == null)
    {
        FillSymbolsHtm();
    }
    var htm = '<table id="tblDiv"><tr><td>' + categoriesHtm;
    htm += '</td></tr><tr><td><div id="divSymbols">' + arSymbolsHtm[0];
    htm += '</div></td></tr></table>';

    return htm;
}

signbuilder.GetRecSymbols = function()
{
    var htm = "";

    return htm;
}

signbuilder.SignDataFromAutosign = function(autoSign, sizeIdx)
{
    var signData = {};
    signData.width = Number(autoSign.sizes[sizeIdx].width);
    signData.height = Number(autoSign.sizes[sizeIdx].height);
    signData.borderType = Number(autoSign.borderType);
    signData.textColor = common.GetColorFromIndex(Number(autoSign.textColor));
    signData.fieldColor = common.GetColorFromIndex(Number(autoSign.fieldColor));
    var signWidth = signData.width;
    var signHeight = signData.height;
    if("shape" in autoSign)
    {
        signData.shape = Number(autoSign.shape);
        if(signData.shape == 2) // diamond
        {
            var mag = borders.Magnitude2D(signData.width,signData.height).toFixed(3);
            signData.previewWidth = mag;
            signData.previewHeight = mag;
            signWidth = mag;
            signHeight = mag;
        }
    }

    if("rad" in autoSign.sizes[sizeIdx] && Number(autoSign.sizes[sizeIdx].rad) > 0)
    {
        signData.radius = Number(autoSign.sizes[sizeIdx].rad);
    }else{
        signData.radius = borders.CalcRadius(signData.width, signData.height);
    }
    if("inset" in autoSign.sizes[sizeIdx] && Number(autoSign.sizes[sizeIdx].inset) > 0)
    {
        signData.inset = Number(autoSign.sizes[sizeIdx].inset);
    }else{
        signData.inset = borders.CalculateInset(signData.width, signData.height,(autoSign.borderType==2));
    }
    if("border" in autoSign.sizes[sizeIdx] && Number(autoSign.sizes[sizeIdx].border) > 0)
    {
        signData.borderWidth = Number(autoSign.sizes[sizeIdx].border);
    }else{
        signData.borderWidth = borders.CalcBorderWidth(signData.width, signData.height);
    }

    // divider types: 0 = horizontal, 1 = vertical
    // "pos" center position of the line
    // "w" line thickness
    // "l" length of line (optional, default is full length)
    // dividers:[{"type":0,"pos":2,"w":0.375,"l":2},{"type":1,"pos":2,"w":0.375}]
    // translate dividers into shapes
    if("dividers" in autoSign)
    {
        var arDividers = [];
        for(var divIdx = 0; divIdx < autoSign.dividers.length; divIdx++)
        {
            arDividers[divIdx] = {};
            arDividers[divIdx].type = Number(autoSign.dividers[divIdx].type);
            arDividers[divIdx].pos = Number(autoSign.sizes[sizeIdx].dividers[divIdx].pos);
            arDividers[divIdx].w = Number(autoSign.sizes[sizeIdx].dividers[divIdx].w);
        }
        signData.sections = borders.GetInsetSections(signData,arDividers);
    } // end dividers
    if("innerRad" in autoSign.sizes[sizeIdx])
    {
        signData.innerRadius = Number(autoSign.sizes[sizeIdx].innerRad);
    }
    
    //var arFontInfo = autoSign.sizes[sizeIdx].font.split(" ");
    signData.textSize = Number(autoSign.sizes[sizeIdx].fontSize); // Number(arFontInfo[0]);
    signData.fontId = Number(autoSign.sizes[sizeIdx].font); //GetFontIdFromChar(arFontInfo[1]);
    signData.lineSepSpace = ("lineSpace" in autoSign.sizes[sizeIdx] && autoSign.sizes[sizeIdx].lineSpace >=0)?Number(autoSign.sizes[sizeIdx].lineSpace):signData.textSize*0.75; // line separator spacing?
    signData.lines = [];
    signData.lineCount = autoSign.lines.length;
    var textAreaH = (autoSign.lines.length * signData.textSize) + (signData.lineSepSpace * (autoSign.lines.length-1));
    var curTop = (signHeight - textAreaH)/2;
    //var curFont = fontlib.GetSizedFont(signData.fontId, signData.textSize);
    var hCenter = signData.width/2;
    if("previewWidth" in signData)
    {
        hCenter = signData.previewWidth/2;
    }
    if(!("lines" in autoSign.sizes[sizeIdx]))
    {
        // if there are no overrides, make sure the object array exists anyhow
        autoSign.sizes[sizeIdx].lines = [];
        for(var i = 0; i < autoSign.lines.length; i++)
        {
            autoSign.sizes[sizeIdx].lines[i] = {};
        }
    }
    for(var i = 0; i < autoSign.lines.length; i++)
    {
        signData.lines[i] = {};
        signData.lines[i].text = autoSign.lines[i].text;
        if("top" in autoSign.sizes[sizeIdx].lines[i] && autoSign.sizes[sizeIdx].lines[i].top > 0)
        {
            signData.lines[i].top = Number(autoSign.sizes[sizeIdx].lines[i].top);
        }else{
            signData.lines[i].top = curTop;
        }
        if("left" in autoSign.sizes[sizeIdx].lines[i])
        {
            signData.lines[i].left = Number(autoSign.sizes[sizeIdx].lines[i].left);
        }else{
            signData.lines[i].left = -1;
        }
        signData.lines[i].center = autoSign.lines[i].center;
        if("spacing" in autoSign.sizes[sizeIdx].lines[i])
        {
            signData.lines[i].spacing = Number(autoSign.sizes[sizeIdx].lines[i].spacing);
        }else{
            signData.lines[i].spacing = 1;
        }
        if("fontSizeOverride" in autoSign.sizes[sizeIdx].lines[i] && autoSign.sizes[sizeIdx].lines[i].fontSizeOverride > 0)
        {
            signData.lines[i].textSize = Number(autoSign.sizes[sizeIdx].lines[i].fontSizeOverride);
        }else{
            signData.lines[i].textSize = Number(signData.textSize);
        }
        if("fontOverride" in autoSign.sizes[sizeIdx].lines[i] && autoSign.sizes[sizeIdx].lines[i].fontOverride > 0)
        {
            // handle multiple font sizes
            //arFontInfo = autoSign.sizes[sizeIdx].lines[i].fontOverride.split(" ");
            //signData.lines[i].textSize = autoSign.sizes[sizeIdx].lines[i].fontOverride;
            signData.lines[i].fontId = Number(autoSign.sizes[sizeIdx].lines[i].fontOverride); //GetFontIdFromChar(arFontInfo[1]);
        }else{
            signData.lines[i].fontId = signData.fontId;
        }
        //curFont = fontlib.GetSizedFont(signData.lines[i].fontId, signData.lines[i].textSize, signData.lines[i].spacing);
        
        signData.lines[i].textWidth = fontlib.GetStringWidth(signData.lines[i].text, signData.lines[i].fontId,signData.lines[i].textSize, signData.lines[i].spacing);
        if(autoSign.lines[i].center)
        {
            var centerPos = hCenter;
            if(signData.lines[i].left > -1) // left is the new center point
            {
                centerPos = Number(autoSign.sizes[sizeIdx].lines[i].left);
            }
            signData.lines[i].left = centerPos - (signData.lines[i].textWidth/2);
            // centerPos = signData.height/2;
            // if(signData.lines[i].top > -1) // top is the new center point
            // {
            //     centerPos = Number(autoSign.sizes[sizeIdx].lines[i].top);
            // }
            // signData.lines[i].top = centerPos - (signData.lines[i].textSize);
        }
        if("fill" in autoSign.sizes[sizeIdx].lines[i] && Number(autoSign.sizes[sizeIdx].lines[i].fill) > 0)
        {
            signData.lines[i].fill = common.GetColorFromIndex(autoSign.sizes[sizeIdx].lines[i].fill);
        }
        signData.lines[i].centerOnSymbol = false;
        signData.lines[i].symbolCount = 0;
        signData.lines[i].hasLArrow = 0;
        signData.lines[i].hasRArrow = 0;
        signData.lines[i].mileLeft = 0;
        signData.lines[i].bInsertLine = false;
        signData.lines[i].mileage = "";
        curTop += Number(signData.lines[i].textSize) + Number(signData.lineSepSpace);
    }
    signData.symbols = [];
    if(autoSign.symbols)
    {
        for(var i = 0; i < autoSign.symbols.length; i++)
        {
            signData.symbols[i] = {};
            signData.symbols[i].group = Number(autoSign.symbols[i].cat);
            signData.symbols[i].idx = Number(autoSign.symbols[i].sym);
            signData.symbols[i].size = Number(autoSign.sizes[sizeIdx].sym[i].height);
            if("color" in autoSign.symbols[i])
            {
                signData.symbols[i].color = Number(autoSign.symbols[i].color);
            }
            signData.symbols[i].canChange = false;
            signData.symbols[i].spacing = 0; // spacing is used in auto-calculating the text positioning with an in-line symbol
            if("spacing" in autoSign.symbols[i])
            {
                signData.symbols[i].spacing = Number(autoSign.symbols[i].spacing);
            }
            if("border" in autoSign.symbols[i])
            {
                signData.symbols[i].border = Number(autoSign.symbols[i].border);
            }else{
                signData.symbols[i].border = false;
            }
            signData.symbols[i].centerVert = false;
            if("centerVert" in autoSign.sizes[sizeIdx].sym[i] && autoSign.sizes[sizeIdx].sym[i].centerVert)
            {
                signData.symbols[i].top = (signData.height/2) - (signData.symbols[i].size/2);
                signData.symbols[i].centerVert = true;
            }else{
                signData.symbols[i].top = Number(autoSign.sizes[sizeIdx].sym[i].top);
            }
            signData.symbols[i].centerHor = false;
            if("centerHor" in autoSign.sizes[sizeIdx].sym[i] && autoSign.sizes[sizeIdx].sym[i].centerHor)
            {
                var obj = common.findSymbolByIdx(signData.symbols[i].group,signData.symbols[i].idx);
                var sz = (signData.symbols[i].size/obj.height)*obj.width;
                signData.symbols[i].left = (signData.width/2) - (sz/2);
                signData.symbols[i].centerHor = true;
            }else{
                signData.symbols[i].left = Number(autoSign.sizes[sizeIdx].sym[i].left);
            }
            if("vertflip" in autoSign.symbols[i])
            {
                signData.symbols[i].vertflip = autoSign.symbols[i].vertflip;
            }
            if("horflip" in autoSign.symbols[i])
            {
                signData.symbols[i].horflip = autoSign.symbols[i].horflip;
            }
            if("rotate" in autoSign.symbols[i])
            {
                signData.symbols[i].rotate = Number(autoSign.symbols[i].rotate);
            }
            signData.symbols[i].bMaxSize = false;
            signData.symbols[i].bHasBorder = false;
        }
    }
    if("shapes" in autoSign)
    {
        signData.shapes = [];
        for(var i = 0; i < autoSign.shapes.length; i++)
        {
            signData.shapes[i] = {};
            signData.shapes[i].id = Number(autoSign.shapes[i].shape);
            signData.shapes[i].fill = common.GetColorFromIndex(Number(autoSign.shapes[i].color));
            signData.shapes[i].x = Number(autoSign.sizes[sizeIdx].shapes[i].x);
            signData.shapes[i].y = Number(autoSign.sizes[sizeIdx].shapes[i].y);
            signData.shapes[i].r = Number(autoSign.sizes[sizeIdx].shapes[i].r);
            signData.shapes[i].w = Number(autoSign.sizes[sizeIdx].shapes[i].w);
            signData.shapes[i].h = Number(autoSign.sizes[sizeIdx].shapes[i].h);
        }
    }
    signData.arrows = [];
    signData.dividers = [];
    return signData;
}