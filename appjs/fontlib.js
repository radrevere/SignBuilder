
var fontArrays = require('./fonts');
var svglib = require('./svglib');
var fonts = [fontArrays.Default,fontArrays.SeriesB,fontArrays.SeriesC,fontArrays.SeriesD,fontArrays.SeriesE,fontArrays.SeriesEM,fontArrays.SeriesF];
var sizedFonts = [];
var sizedFontCount = 0;

var fontlib = {};
module.exports = fontlib;
fontlib.fonts = fonts;

fontlib.GetFontsCombo = function(id)
{
    var htm = '<select id="'+id+'">';
    for(var i = 0; i < fonts.length; i++)
    {
        htm += '<option value="' + i + '">' + fonts[i].name + '</option>';
    }
    htm += "</select>";
    return htm;
}
// returns the SVG equivalent of the 
// requested string and the requested size in inches
// at the x-y location
fontlib.StringSVG = function(str,fontId,size, x,y, spacing)
{
    var svgStr = "";
    var font = this.GetSizedFont(fontId, size, spacing);
    var ltrs = this.GetLetterIndexes(str, font);
    var xPos = x - font.letters[ltrs[0]].lSpace;
    for(var i = 0; i < ltrs.length; i++)
    {
        svgStr += svglib.RenderPathData(font.letters[ltrs[i]].path,1,xPos,y);
        xPos += font.letters[ltrs[i]].width;
    }
    return svgStr;
}

fontlib.GetStringWidth = function(str, fontId, size, spacing)
{
    if(str == null || str == "" || fontId < 1)
    {
        return 0;
    }
    spacing = spacing || null;
    var width = 0;
    var font = this.GetSizedFont(fontId, size,spacing);
    var ltrs = GetArLetterIdx(font,str);
    // compensate for internal spacing...
    width -= font.letters[ltrs[0]].lSpace;
    width -= font.letters[ltrs[(ltrs.length-1)]].rSpace;
    for(var i = 0; i < ltrs.length; i++)
    {
        width += font.letters[ltrs[i]].width;
    }
    return width;
}

function GetArLetterIdx(font,str)
{
    var arIdx = [];
    for(var i = 0; i < str.length; i++)
    {
        var c = str.charAt(i);
        arIdx[i] = FindLetter(font,c);
    }
    return arIdx;
}
fontlib.GetLetterIndexes = function(str, font)
{
    return GetArLetterIdx(font,str);
}

function FindLetter(font,c)
{
    // for now just iterate, TODO: optimize later
    for(var i = 0; i < font.letters.length; i++)
    {
        if(font.letters[i].unicode == c)
        {
            return i;
        }
    }
    return -1;
}

function FindFont(fontId,size, spacing)
{
    for(var i = 0; i < sizedFontCount; i++)
    {
        if(sizedFonts[i].id == fontId && sizedFonts[i].size == size && sizedFonts[i].spacing == spacing)
        {
            return sizedFonts[i].font;
        }
    }
    return null;
}

fontlib.GetSizedFont = function(fontId, size, spacing)
{
    spacing = spacing || null;
    if(fontId == -1)
    {
        fontId = 1;
    }
    if(spacing == 1.0 || spacing == 1)
    {
        spacing = null;
    }
    var font = FindFont(fontId,size, spacing);
    if(font != null)
    {
        return font;
    }
    font = fonts[fontId];
    var newFont = {};
    var scale = size/font.height;
    newFont.name = font.name;
    newFont.size = size;
    newFont.underlineSize = font.underlineSize * scale;
    newFont.underlinePos = font.underlinePos * scale;
    newFont.height = size;
    newFont.letters = [];
    newFont.spacing = spacing || 1.0;
    for(var i = 0; i < font.letters.length;i++)
    {
        newFont.letters[i] = {};
        newFont.letters[i].unicode = font.letters[i].unicode;
        newFont.letters[i].width = font.letters[i].width * scale;
        newFont.letters[i].lSpace = font.letters[i].lSpace * scale;
        newFont.letters[i].rSpace = font.letters[i].rSpace * scale;
        if(spacing != null)
        {
            var lSpacing = newFont.letters[i].lSpace * spacing;
            var rSpacing = newFont.letters[i].rSpace * spacing;
            if(newFont.letters[i].unicode == " ")
            {
                newFont.letters[i].width *= spacing;
            }else{
                newFont.letters[i].width -= ((newFont.letters[i].lSpace-lSpacing) + (newFont.letters[i].rSpace-rSpacing));
            }
            newFont.letters[i].lSpace = lSpacing;
            newFont.letters[i].rSpace = rSpacing;
        }
        //newFont.letters[i].path = this.GetModifiedPath(font.letters[i].path, scale,newFont.letters[i].lSpace,0);
        newFont.letters[i].path = svglib.RenderPathData(font.letters[i].path,scale,newFont.letters[i].lSpace,0);
    }
    sizedFonts[sizedFontCount] = {};
    sizedFonts[sizedFontCount].id = fontId;
    sizedFonts[sizedFontCount].size = size;
    sizedFonts[sizedFontCount].font = newFont;
    sizedFontCount++;6
    return newFont;
}