var common = require('./signcommon');
var svglib = {};
module.exports = svglib;
var precision = 4;

// svg info
// = {"transx":0,"transy":0,"height":3,"forceFill":"#000000","flipHor":true,"flipVert":false,"rotate":0}
svglib.GetDefaultTransformInfo = function(size,transX,transY,forceFill)
{
    var info = {};
    info.transx = transX || 0;
    info.transy = transY || 0;
    info.newHeight = size;
    info.scale = 1;
    info.forceFill = forceFill;
    info.flipHor = false;
    info.flipVert = false;
    info.rotate = 0;
    return info;
}

svglib.RenderSVG = function(svgTxt, size, transX,transY, forceFill)
{
    var info = svglib.GetDefaultTransformInfo(size, transX, transY, forceFill);
    return svglib.TransformSVG(svgTxt, info);
}

svglib.TransformSVG = function(svgTxt, info)
{
    var size = info.newHeight;
    var transX = info.transx;
    var transY = info.transy;
    var strSvg = "";
    var forceFill = info.forceFill || null;
    var curIdx = svgTxt.indexOf("width=");
    if(curIdx == -1)
    {
        alert("Unable to find the width!");
        return;
    }
    curIdx +=7; // advance past the quote
    var tmpNum = svglib.GetNumberAt(svgTxt, curIdx);
    var objWide = tmpNum[1];
    curIdx = svgTxt.indexOf("height=",curIdx);
    if(curIdx == -1)
    {
        alert("Unable to find the height!");
        return;
    }
    curIdx += 8; // advance past the quote
    tmpNum = svglib.GetNumberAt(svgTxt,curIdx);
    var objHigh = tmpNum[1];
    //var largest = Math.max(objWide, objHigh);
    //var largest = Math.max(txtWidth.value,txtHeight.value);
    var scale = size/objHigh;
    info.scale = scale;
    var center = objWide/2;
    info.scaledWidth = objWide*scale;
    info.scaledHeight = objHigh*scale;
    var maxAttrPos = 0;
    while(curIdx < svgTxt.length){
        // move to the next xml node
        curIdx = svgTxt.indexOf("<",curIdx);
        if(curIdx == -1)
        {
            break;
        }
        var nodeName = svgTxt.substr(curIdx,5);
        // account for the group tag
        if(nodeName.substr(0,3) == "<g>")
        {
            curIdx += 3;
            continue;
        }
        curIdx += 6;
        if(nodeName == "</svg") // end of file
        {
            break;
        }
        if(nodeName == "<path")
        {
            strSvg += "<path ";
            strSvg += svglib.SetAttributes(svgTxt, curIdx, info);
            curIdx = svgTxt.indexOf("d=", curIdx);
            if(curIdx == -1)
            {
                break;
            }
            curIdx += 3;
            var pathTxt = svglib.GetStringAt(svgTxt, curIdx);
            strSvg += " d=\"" + svglib.RenderPathData(pathTxt, scale, transX,transY) + "\"/>";
            curIdx += pathTxt.length + 1;
        } else if(nodeName == "<poly"){
            // polygon tag
            var x = 0;
            var y = 0;
            var bFirst = true;
            var nodeName = svgTxt.substr(curIdx,6);
            if(nodeName == "<polyl")
            {
                strSvg += "<polyline ";
            }else{
                strSvg += "<polygon ";
            }
            strSvg += svglib.SetAttributes(svgTxt, curIdx,info);
            strSvg += " points=\"";
            var tmpIdx = svgTxt.indexOf("points=",curIdx) + 8;
            var pointsTxt = svglib.GetStringAt(svgTxt, tmpIdx);
  
            var val = [];
            tmpIdx = 0;
            while (tmpIdx < pointsTxt.length-1)
            {
                val = svglib.GetNumberAt(pointsTxt,tmpIdx);
                // there may be garbage charaters at the end of the data...
                if(val[2] == false)
                {
                    tmpIdx += (val[0]==0?1:val[0]);
                    continue;
                }
                tmpIdx += val[0];
                x = val[1];
                val = svglib.GetNumberAt(pointsTxt, tmpIdx);
                tmpIdx += val[0];
                y = val[1];
                if(bFirst)
                {
                    strSvg += ((x*scale)+transX).toFixed(precision) + "," + ((y*scale)+transY).toFixed(precision);
                    bFirst = false;
                }else{
                    strSvg += " " + ((x*scale)+transX).toFixed(precision) + "," + ((y*scale)+transY).toFixed(precision);
                }
            }
            strSvg += "\"/>";
        }else if(nodeName == "<rect"){
            // rect tag
            var x = 0;
            var y = 0;
            var rx = 0;
            var ry = 0;
            var dWide = 0;
            var dHigh = 0;
            var tmp = [];
            maxAttrPos = svgTxt.indexOf(">", curIdx);

            strSvg += "<rect ";
            strSvg += svglib.SetAttributes(svgTxt, curIdx, info);
            var tmpIdx = svgTxt.indexOf("x=",curIdx);
            if(tmpIdx > -1 || tmpIdx < maxAttrPos)
            {
                tmpIdx += 3;
                tmp = svglib.GetNumberAt(svgTxt,tmpIdx);
                x = tmp[1];
                strSvg += " x=\"" + ((x*scale)+transX) + "\"";
            }else{
                 strSvg += " x=\"" + ((x*scale) + transX) + "\"";
            }
            tmpIdx= svgTxt.indexOf("y=",curIdx);
            if(tmpIdx > -1 && tmpIdx < maxAttrPos)
            {
                tmpIdx += 3;
                tmp = svglib.GetNumberAt(svgTxt,tmpIdx);
                y = tmp[1];
                strSvg += " y=\"" + ((y*scale)+transY) + "\"";
            }else{
                 strSvg += " y=\"" + ((y*scale) + transY) + "\"";
            }
            tmpIdx = svgTxt.indexOf("width=",curIdx);
            if(tmpIdx > -1 && tmpIdx < maxAttrPos)
            {
                tmpIdx += 7;
                tmp = svglib.GetNumberAt(svgTxt,tmpIdx);
                dWide = tmp[1];
                strSvg += " width=\"" + (dWide*scale) + "\"";
            }
            tmpIdx = svgTxt.indexOf("height=",curIdx);
            if(tmpIdx > -1 && tmpIdx < maxAttrPos)
            {
                tmpIdx += 8;
                tmp = svglib.GetNumberAt(svgTxt,tmpIdx);
                dHigh = tmp[1];
                strSvg += " height=\"" + (dHigh*scale) + "\"";
            }
            tmpIdx= svgTxt.indexOf("rx=",curIdx);
            if(tmpIdx > -1 && tmpIdx < maxAttrPos)
            {
                tmpIdx += 4;
                tmp = svglib.GetNumberAt(svgTxt,tmpIdx);
                rx = tmp[1];
                strSvg += " rx=\"" + (rx*scale) + "\"";
            }
            tmpIdx= svgTxt.indexOf("ry=",curIdx);
            if(tmpIdx > -1 && tmpIdx < maxAttrPos)
            {
                tmpIdx += 4;
                tmp = svglib.GetNumberAt(svgTxt,tmpIdx);
                ry = tmp[1];
                strSvg += " ry=\"" + (ry*scale) + "\"";
            }
            strSvg += "/>";
        }else if(nodeName == "<circ"){
            // circle tag
            var x = 0;
            var y = 0;
            var r = 0;
            var tmp = [];
            maxAttrPos = svgTxt.indexOf(">", curIdx);
            strSvg += "<circle " + svglib.SetAttributes(svgTxt, curIdx, info);
            var tmpIdx= svgTxt.indexOf("cx=",curIdx);
            if(tmpIdx > -1 && tmpIdx < maxAttrPos)
            {
                tmpIdx += 4;
                tmp = svglib.GetNumberAt(svgTxt,tmpIdx);
                x = tmp[1];
                strSvg += " cx=\"" + ((x*scale)+transX).toFixed(precision) + "\"";
            }
            tmpIdx= svgTxt.indexOf("cy=",curIdx);
            if(tmpIdx > -1 && tmpIdx < maxAttrPos)
            {
                tmpIdx += 4;
                tmp = svglib.GetNumberAt(svgTxt,tmpIdx);
                y = tmp[1];
                strSvg += " cy=\"" + ((y*scale)+transY).toFixed(precision) + "\"";
            }
            tmpIdx= svgTxt.indexOf("r=",curIdx);
            if(tmpIdx > -1 && tmpIdx < maxAttrPos)
            {
                tmpIdx += 3;
                tmp = svglib.GetNumberAt(svgTxt,tmpIdx);
                r = tmp[1];
                strSvg += " r=\"" + (r*scale).toFixed(precision) + "\"";
            }
            strSvg += "/>";
        }else if(nodeName == "<elli"){
            // circle tag
            var x = 0;
            var y = 0;
            var rx = 0;
            var ry = 0;
            var tmp = [];
            maxAttrPos = svgTxt.indexOf(">", curIdx);
            strSvg += "<ellipse " + svglib.SetAttributes(svgTxt, curIdx, info);
            var tmpIdx= svgTxt.indexOf("cx=",curIdx);
            if(tmpIdx > -1 && tmpIdx < maxAttrPos)
            {
                tmpIdx += 4;
                tmp = svglib.GetNumberAt(svgTxt,tmpIdx);
                x = tmp[1];
                strSvg += " cx=\"" + ((x*scale)+transX).toFixed(precision) + "\"";
            }
            tmpIdx= svgTxt.indexOf("cy=",curIdx);
            if(tmpIdx > -1 && tmpIdx < maxAttrPos)
            {
                tmpIdx += 4;
                tmp = svglib.GetNumberAt(svgTxt,tmpIdx);
                y = tmp[1];
                strSvg += " cy=\"" + ((y*scale)+transY).toFixed(precision) + "\"";
            }
            tmpIdx= svgTxt.indexOf("rx=",curIdx);
            if(tmpIdx > -1 && tmpIdx < maxAttrPos)
            {
                tmpIdx += 4;
                tmp = svglib.GetNumberAt(svgTxt,tmpIdx);
                rx = tmp[1];
                strSvg += " rx=\"" + (rx*scale).toFixed(precision) + "\"";
            }
            tmpIdx= svgTxt.indexOf("ry=",curIdx);
            if(tmpIdx > -1 && tmpIdx < maxAttrPos)
            {
                tmpIdx += 4;
                tmp = svglib.GetNumberAt(svgTxt,tmpIdx);
                ry = tmp[1];
                strSvg += " ry=\"" + (ry*scale).toFixed(precision) + "\"";
            }
            strSvg += "/>";
        }else if(nodeName == "<text"){
            strSvg += "<text " +  svglib.SetAttributes(svgTxt,curIdx, info);
            tmpIdx= svgTxt.indexOf("font-size=",curIdx);
            var size = scale;
            if(tmpIdx > -1)
            {
                tmpIdx += 11;
                size = svglib.GetNumberAt(svgTxt,tmpIdx);
                size = size[1];
                strSvg += " font-size=\"" + (size*scale).toFixed(precision) + "\"";
            }
            var str = GetTagContents(svgTxt,curIdx);
            strSvg += ">" + str + "</text>";
        }
    }
    return strSvg;
}

svglib.SetAttributes = function(txt,curIdx, info)
{
    strSvg = "";
    var translateX = info.transx;
    var translateY = info.transy;
    var forceFill = info.forceFill;
    var scale = info.scale;
    translateY = translateY || 0;
    this.bFill = false;
    this.bStroke = false;
    var bHasFill = false;
    // ensure I am finding attributes for the current tag ONLY
    var svgTxt = svglib.GetTagStringAt(txt,curIdx);
    
    tmpIdx= svgTxt.indexOf("clip-rule=",0);
    if(tmpIdx > -1)
    {
        tmpIdx += 11;
        strSvg += " clip-rule=\"" + svglib.GetStringAt(svgTxt,tmpIdx) + "\"";
    }
    tmpIdx= svgTxt.indexOf("stroke=",0);
    if(tmpIdx > -1)
    {
        tmpIdx += 8;
        strSvg += " stroke=\"" + svglib.GetStringAt(svgTxt,tmpIdx) + "\"";
        this.bStroke = true;
    }
    tmpIdx= svgTxt.indexOf("stroke-width=",0);
    if(tmpIdx > -1)
    {
        tmpIdx += 14;
        var tmp = svglib.GetNumberAt(svgTxt,tmpIdx);
        strSvg += " stroke-width=\"" + tmp[1] + "\"";
    }
    tmpIdx= svgTxt.indexOf("stroke-linecap=",0);
    if(tmpIdx > -1)
    {
        tmpIdx += 14;
        strSvg += " stroke-linecap=\"" + svglib.GetStringAt(svgTxt,tmpIdx) + "\"";
    }
    tmpIdx= svgTxt.indexOf("stroke-miterlimit=",0);
    if(tmpIdx > -1)
    {
        tmpIdx += 19;
        var tmp = svglib.GetNumberAt(svgTxt,tmpIdx);
        strSvg += " stroke-miterlimit=\"" + tmp[1] + "\"";
    }
    var tmpIdx = svgTxt.indexOf("fill=",0);
    if(tmpIdx > -1)
    {
        tmpIdx += 6;
        var color = svglib.GetStringAt(svgTxt,tmpIdx);
        if(color != "none")
        {
            strSvg += " fill=\"" + color + "\"";
            bHasFill = true;
        }
    }
    if(this.bStroke)
    {
        strSvg += " fill=\"none\"";
    }else if(!bHasFill)
    {
        strSvg += " fill=\"" + forceFill + "\"";
    }
    tmpIdx= svgTxt.indexOf("fill-rule=",0);
    if(tmpIdx > -1)
    {
        tmpIdx += 11;
        strSvg += " fill-rule=\"" + svglib.GetStringAt(svgTxt,tmpIdx) + "\"";
    }
    tmpIdx= svgTxt.indexOf("font-family=",0);
    if(tmpIdx > -1)
    {
        tmpIdx += 13;
        strSvg += " font-family=\"" + svglib.GetStringAt(svgTxt,tmpIdx) + "\"";
    }
    tmpIdx= svgTxt.indexOf("transform=",0);
    if(tmpIdx > -1)
    {
        if(info.scale != 1)
        {
            strSvg += " transform=\"" + svglib.ScaleTransform(svglib.GetStringAt(svgTxt,tmpIdx+11), info.scale) + "\"";
        }else{
            strSvg += " transform=\"" + svglib.GetStringAt(svgTxt,tmpIdx+11) + "\"";
        }
    }else{
        var a,b,c,d,e,f;
        var bAddMatrix = false;
        if(info.flipHor || info.flipVert || info.rotate > 0)
        {
            strSvg += " transform=\"";
            // setup identity matrix
            a = 1;
            b = 0; 
            c = 0; 
            d = 1;
            e = 0;
            f = 0;
            // follow SVG matrix order
            if(info.flipHor)
            {
                a = -1;
                // remember that the image is being translated before the transform!
                e = info.scaledWidth + (info.transx*2);
                bAddMatrix = true;
            }
            if(info.flipVert)
            {
                d = -1;
                // remember that the image is being translated before the transform!
                f = info.scaledHeight + (info.transy*2);
                bAddMatrix = true;
            }
            if(bAddMatrix)
            {
                    strSvg += "matrix(" + a + "," + b + "," + c + "," + d + "," + e + "," + f + ") ";
            }
            if(info.rotate != 0)
            {
                strSvg += "rotate(" + info.rotate + ") ";
            }
            strSvg += "\"";
        }
    }
    return strSvg;
}

svglib.ScaleTransform = function(transStr, scale)
{
    if(transStr.indexOf("matrix") > -1)
    {
        // tear apart the matrix and scale it
        var tmp = transStr.substr(7);
        //tmp.replace("(", "");
        tmp = tmp.replace(")", "");
        var arNums = tmp.split(",");
        arNums[5] = (Number(arNums[5]) * scale).toFixed(4);
        arNums[4] = (Number(arNums[4]) * scale).toFixed(4);
        return "matrix(" + arNums[0] + "," + arNums[1] + "," + arNums[2] + "," + arNums[3] + "," + arNums[4] + "," + arNums[5] + ") ";
    }
    var retVal = "";
    var idx = transStr.indexOf("translate");
    if(idx > -1)
    {
        // could be x or x,y
        var tmp = transStr.substr(idx+10);
        tmp = tmp.replace(")", "");
        var arNums = tmp.split(",");
        if(arNums.length == 1)
        {
            retVal += " translate(" + (Number(arNums[0]) * scale).toFixed(4) + ")";
        }else if(arNums.length == 2){
            retVal += " translate(" + (Number(arNums[0]) * scale).toFixed(4) + "," + (Number(arNums[1]) * scale).toFixed(4) + ")";
        }
    }
    idx = transStr.indexOf("rotate");
    if(idx > -1)
    {
        // only handle when rotating about a point
        var tmp = transStr.substr(idx+7);
        tmp = tmp.replace(")", "");
        var arNums = tmp.split(",");
        if(arNums.length == 3)
        {
            retVal += " rotate(" + arNums[0] + "," + (Number(arNums[1])*scale).toFixed(4) + "," + (Number(arNums[2])*scale).toFixed(4) + ")";
        }else{
            retVal += " rotate(" + arNums[0] + ")";
        }
    }
    return retVal;
}

svglib.GetNumberAt = function(txt, idx)
{
    var num = "";
    var retVal = [];
    var count = 0;
    var curChar = txt.charAt(idx);
    var bContinue = true;
    while(bContinue){
        if(curChar == "," || curChar == " " || curChar == "\n" || curChar == "\t")
        {
            idx++;
            curChar = txt.charAt(idx);
            count++;
        } else{
            bContinue = false;
        }
    }
    if(curChar == "-") // handle a negative number because a '-' could be the start of the next number as I parse...
    {
        num += curChar;
        idx++;
        count++;
        curChar = txt.charAt(idx);
    }
    while(curChar.match(/\d/) != null || curChar == "." )
    {
        count++;
        num += curChar;
        idx++;
        curChar = txt.charAt(idx);
    }
    retVal[0] = count;// + (curChar=="-"?0:1);
    if(num.length > 0)
    {
        retVal[1] = parseFloat(num);
    }else{
        retVal[1] = 0;
    }
    retVal[2] = true;
    if(num.length == 0)
    {
        retVal[2] = false;
    }
    return retVal;
}

svglib.GetStringAt = function(txt, idx)
{
    var str = "";
    var idx2 = txt.indexOf("\"",idx);
    if(idx2 == -1)
    {
        idx2 = txt.indexOf("'",idx);
    }
    str = txt.substring(idx,idx2);
    return str;
}

svglib.GetTagStringAt = function(txt,idx)
{
    var str = "";
    var idx2 = txt.indexOf(">",idx);
    str = txt.substring(idx,idx2);
    return str;
}

svglib.GetTagContents = function(txt,idx)
{
    var str = "";
    var idx2 = txt.indexOf(">",idx)+1;
    var idx3 = txt.indexOf("<",idx2);
    str = txt.substring(idx2,idx3);
    return str;
}

svglib.RenderPathData = function(str, scale, transX, transY)
{
    var strSvg = "";
    //character for character parsing...
    var curIdx = 0;
    var tmpNum = [];
    // svg moves from point to point so we need to track the current point to get absolute coordinates needed for the canvas
    var curX = 0;
    var curY = 0;
    var tmpX = 0;
    var tmpY = 0;
    var prevCpx = 0;
    var prevCpy = 0;
    var bFirstTime = true;
    while( curIdx < str.length)
    {
        var ltr = str.charAt(curIdx);
        switch(ltr)
        {
        // uppercase are absolute paths and lowercase are relative paths!
        case "m":
        case "M": // begin path
            if(bFirstTime){
                bFirstTime = false;
            }
            // move to...
            curIdx++;
            tmpNum = svglib.GetNumberAt(str, curIdx);
            tmpX = tmpNum[1];
            curIdx += tmpNum[0];
            tmpNum = svglib.GetNumberAt(str,curIdx);
            curIdx += tmpNum[0];
            tmpY = tmpNum[1];
            strSvg += "M" + ((tmpX*scale)+transX).toFixed(precision) + "," + ((tmpY*scale)+transY).toFixed(precision);
            // move the current x,y
            curX = tmpX;
            curY = tmpY;
            prevCpx = curX;
            prevCpy = curY;
            break;
        case "C": // bezier curve with absolute coordinates
            // first point is the next end point
            curIdx++;
            
            tmpNum = svglib.GetNumberAt(str, curIdx);
            curIdx += tmpNum[0];
            var cp1x = tmpNum[1];
            tmpNum = svglib.GetNumberAt(str, curIdx);
            curIdx += tmpNum[0];
            var cp1y = tmpNum[1];
            
            tmpNum = svglib.GetNumberAt(str, curIdx);
            curIdx += tmpNum[0];
            cp2x = tmpNum[1];
            tmpNum = svglib.GetNumberAt(str, curIdx);
            curIdx += tmpNum[0];
            cp2y = tmpNum[1];
            
            tmpNum = svglib.GetNumberAt(str, curIdx);
            curIdx += tmpNum[0];
            curX = tmpNum[1];
            tmpNum = svglib.GetNumberAt(str, curIdx);
            curIdx += tmpNum[0];
            curY = tmpNum[1];
            strSvg += "C" + ((cp1x*scale)+transX).toFixed(precision) + "," + ((cp1y*scale)+transY).toFixed(precision) + "," + ((cp2x*scale)+transX).toFixed(precision) + "," + ((cp2y*scale)+transY).toFixed(precision) + "," + ((curX*scale)+transX).toFixed(precision) + "," + ((curY*scale)+transY).toFixed(precision);
            prevCpx = cp2x;
            prevCpy = cp2y;
            break;
        case "c": // bezier curve with relative coordinates
            // first point is the next end point
            curIdx++;
            
            tmpNum = svglib.GetNumberAt(str, curIdx);
            curIdx += tmpNum[0];
            var cp1x = Number((tmpNum[1] + curX).toFixed(3));
            tmpNum = svglib.GetNumberAt(str, curIdx);
            curIdx += tmpNum[0];
            var cp1y = Number((tmpNum[1] + curY).toFixed(3));
            
            tmpNum = svglib.GetNumberAt(str, curIdx);
            curIdx += tmpNum[0];
            cp2x = Number((tmpNum[1] + curX).toFixed(3));
            tmpNum = svglib.GetNumberAt(str, curIdx);
            curIdx += tmpNum[0];
            cp2y = Number((tmpNum[1] + curY).toFixed(3));
            tmpNum = svglib.GetNumberAt(str, curIdx);
            curIdx += tmpNum[0];
            curX += tmpNum[1]; // store for later
            tmpNum = svglib.GetNumberAt(str, curIdx);
            curIdx += tmpNum[0];
            curY += tmpNum[1];
            strSvg += "C" + ((cp1x*scale)+transX).toFixed(precision) + "," + ((cp1y*scale)+transY).toFixed(precision) + "," + ((cp2x*scale)+transX).toFixed(precision) + "," + ((cp2y*scale)+transY).toFixed(precision)+ "," + ((curX*scale)+transX).toFixed(precision) + "," + ((curY*scale)+transY).toFixed(precision);
            prevCpx = cp2x;
            prevCpy = cp2y;
            break;
        case "H": // absolute horizontal coordinate (x)
            curIdx++;
            tmpNum = svglib.GetNumberAt(str, curIdx);
            curIdx += tmpNum[0];
            curX = tmpNum[1];
            strSvg += "L" + ((curX*scale)+transX).toFixed(precision) + "," + ((curY*scale)+transY).toFixed(precision);
            prevCpx = curX;
            prevCpy = curY;
            break;
        case "h": // relative horizontal movement
            curIdx++;
            tmpNum = svglib.GetNumberAt(str, curIdx);
            curIdx += tmpNum[0];
            curX = Number((curX + tmpNum[1]).toFixed(3));
            strSvg += "L" + ((curX*scale)+transX).toFixed(precision) + "," + ((curY*scale)+transY).toFixed(precision);
            prevCpx = curX;
            prevCpy = curY;
            break;
        case "V": // absolute vertical coordinate (y)
            curIdx++;
            tmpNum = svglib.GetNumberAt(str, curIdx);
            curIdx += tmpNum[0];
            curY = tmpNum[1];
            strSvg += "L" + ((curX*scale)+transX).toFixed(precision) + "," + ((curY*scale)+transY).toFixed(precision);
            prevCpx = curX;
            prevCpy = curY;
            break;
        case "v": // relative vertical movement
            curIdx++;
            tmpNum = svglib.GetNumberAt(str, curIdx);
            curIdx += tmpNum[0];
            curY = Number((curY + tmpNum[1]).toFixed(3));
            strSvg += "L" + ((curX*scale)+transX).toFixed(precision) + "," + ((curY*scale)+transY).toFixed(precision);
            prevCpx = curX;
            prevCpy = curY;
            break;
        case "L": // absolute coordinate for a line
            curIdx++;
            tmpNum = svglib.GetNumberAt(str, curIdx);
            curIdx += tmpNum[0];
            curX = tmpNum[1];

            tmpNum = svglib.GetNumberAt(str, curIdx);
            curIdx += tmpNum[0];
            curY = tmpNum[1];
            strSvg += "L" + ((curX*scale)+transX).toFixed(precision) + "," + ((curY*scale)+transY).toFixed(precision);
            prevCpx = curX;
            prevCpy = curY;
            break;
        case "l": // relative coordinate for a line
            curIdx++;
            tmpNum = svglib.GetNumberAt(str, curIdx);
            curIdx += tmpNum[0];
            curX = Number((curX + tmpNum[1]).toFixed(3));
            tmpNum = svglib.GetNumberAt(str, curIdx);
            curIdx += tmpNum[0];
            curY = Number((curY + tmpNum[1]).toFixed(3));
            strSvg += "L" + ((curX*scale)+transX).toFixed(precision) + "," + ((curY*scale)+transY).toFixed(precision);
            prevCpx = curX;
            prevCpy = curY;
            break;
        case "Q": // Quadratic
            curIdx++;
            tmpNum = svglib.GetNumberAt(str, curIdx);
            curIdx += tmpNum[0];
            var cp1x = tmpNum[1];
            tmpNum = svglib.GetNumberAt(str, curIdx);
            curIdx += tmpNum[0];
            var cp1y = tmpNum[1];
            // first control point is a reflection against the current point of the second control point of the previous curve
            prevCpx = curX + (curX - prevCpx);
            prevCpy = curY + (curY - prevCpy);
            tmpNum = svglib.GetNumberAt(str,curIdx);
            curIdx += tmpNum[0];
            curX = tmpNum[1];
            tmpNum = svglib.GetNumberAt(str,curIdx);
            curIdx += tmpNum[0];
            curY = tmpNum[1];
            strSvg += "Q" + ((cp1x*scale)+transX).toFixed(precision) + "," + ((cp1y*scale)+transY).toFixed(precision) + "," + ((curX*scale)+transX).toFixed(precision) + "," + ((curY*scale)+transY).toFixed(precision);
            prevCpx = cp1x;
            prevCpy = cp1y;
            break;
        case "q": // Quadratic relative
            curIdx++;
            tmpNum = svglib.GetNumberAt(str, curIdx);
            curIdx += tmpNum[0];
            var cp1x = Number((tmpNum[1] + curX).toFixed(3));
            tmpNum = svglib.GetNumberAt(str, curIdx);
            curIdx += tmpNum[0];
            var cp1y = Number((tmpNum[1] + curY).toFixed(3));
            // first control point is a reflection against the current point of the second control point of the previous curve
            prevCpx = curX + (curX - prevCpx);
            prevCpy = curY + (curY - prevCpy);
            tmpNum = svglib.GetNumberAt(str,curIdx);
            curIdx += tmpNum[0];
            curX += tmpNum[1];
            tmpNum = svglib.GetNumberAt(str,curIdx);
            curIdx += tmpNum[0];
            curY += tmpNum[1];
            strSvg += "q" + ((cp1x*scale)+transX).toFixed(precision) + "," + ((cp1y*scale)+transY).toFixed(precision) + "," + ((curX*scale)+transX).toFixed(precision) + "," + ((curY*scale)+transY).toFixed(precision);
            prevCpx = cp1x;
            prevCpy = cp1y;
            break;
        case "T": // reflected quadratic
            curIdx++;
            tmpNum = svglib.GetNumberAt(str, curIdx);
            curIdx += tmpNum[0];
            curX = tmpNum[1];

            tmpNum = svglib.GetNumberAt(str, curIdx);
            curIdx += tmpNum[0];
            curY = tmpNum[1];
            strSvg += "T" + ((curX*scale)+transX).toFixed(precision) + "," + ((curY*scale)+transY).toFixed(precision);
            prevCpx = curX;
            prevCpy = curY;
            break;
        case "t": // relative relative quadratic
            curIdx++;
            tmpNum = svglib.GetNumberAt(str, curIdx);
            curIdx += tmpNum[0];
            curX = Number((curX + tmpNum[1]).toFixed(3));
            tmpNum = svglib.GetNumberAt(str, curIdx);
            curIdx += tmpNum[0];
            curY = Number((curY + tmpNum[1]).toFixed(3));
            strSvg += "T" + ((curX*scale)+transX).toFixed(precision) + "," + ((curY*scale)+transY).toFixed(precision);
            prevCpx = curX;
            prevCpy = curY;
            break;
        case "S": // simple bezier
            curIdx++;
            tmpNum = svglib.GetNumberAt(str, curIdx);
            curIdx += tmpNum[0];
            var cp1x = tmpNum[1];
            tmpNum = svglib.GetNumberAt(str, curIdx);
            curIdx += tmpNum[0];
            var cp1y = tmpNum[1];
            // first control point is a reflection against the current point of the second control point of the previous curve
            prevCpx = curX + (curX - prevCpx);
            prevCpy = curY + (curY - prevCpy);
            tmpNum = svglib.GetNumberAt(str,curIdx);
            curIdx += tmpNum[0];
            curX = tmpNum[1];
            tmpNum = svglib.GetNumberAt(str,curIdx);
            curIdx += tmpNum[0];
            curY = tmpNum[1];
            //ctx.quadraticCurveTo(cp1x*scale,cp1y*scale,curX*scale,curY*scale);
            strSvg += "S" + ((cp1x*scale)+transX).toFixed(precision) + "," + ((cp1y*scale)+transY).toFixed(precision) + "," + ((curX*scale)+transX).toFixed(precision) + "," + ((curY*scale)+transY).toFixed(precision);
            prevCpx = cp1x;
            prevCpy = cp1y;
            break;
        case "s": // simple Bezier relative
            curIdx++;
            tmpNum = svglib.GetNumberAt(str, curIdx);
            curIdx += tmpNum[0];
            var cp1x = Number((tmpNum[1] + curX).toFixed(3));
            tmpNum = svglib.GetNumberAt(str, curIdx);
            curIdx += tmpNum[0];
            var cp1y = Number((tmpNum[1] + curY).toFixed(3));
            // first control point is a reflection against the current point of the second control point of the previous curve
            prevCpx = curX + (curX - prevCpx);
            prevCpy = curY + (curY - prevCpy);
            tmpNum = svglib.GetNumberAt(str,curIdx);
            curIdx += tmpNum[0];
            curX += tmpNum[1];
            tmpNum = svglib.GetNumberAt(str,curIdx);
            curIdx += tmpNum[0];
            curY += tmpNum[1];
            //ctx.quadraticCurveTo(cp1x*scale,cp1y*scale,curX*scale,curY*scale);
            strSvg += "S" + ((cp1x*scale)+transX).toFixed(precision) + "," + ((cp1y*scale)+transY).toFixed(precision) + "," + ((curX*scale)+transX).toFixed(precision) + "," + ((curY*scale)+transY).toFixed(precision);
            prevCpx = cp1x;
            prevCpy = cp1y;
            break;
        case "A": // Arc  absolute TODO: [Ar,rO0 1 x,y] need to find out the details r=radius O=?? (x,y)=center
            //alert("Arc not implemented yet!");
            curIdx++; // remove this once implemented!
            tmpNum = svglib.GetNumberAt(str, curIdx);
            curIdx += tmpNum[0];
            var radius = tmpNum[1];
            var arcNums = [];
            for(var i = 0; i < 4; i++) // skip the next 4 numbers
            {
                tmpNum = svglib.GetNumberAt(str, curIdx);
                curIdx += tmpNum[0];
                arcNums[i] = tmpNum[1];
            }
            tmpNum = svglib.GetNumberAt(str, curIdx);
            curIdx += tmpNum[0];
            var cp1x = tmpNum[1];
            tmpNum = svglib.GetNumberAt(str, curIdx);
            curIdx += tmpNum[0];
            var cp1y = tmpNum[1];
            var cp2x = 0;
            var cp2y = 0;
            // now use curX and curY to extrapolate a point between the points
            if(curX < cp1x && curY > cp1y)
            {
                cp2x = curX;
                cp2y = cp1y;
            }else if(curX < cp1x && curY < cp1y){
                cp2x = cp1x;
                cp2y = curY;
            }else if(curX > cp1x && curY > cp1y)
            {
                cp2x = cp1x;
                cp2y = curY;
            }else if(curX > cp1x && curY < cp1y){
                cp2x = curX;
                cp2y = cp1y;
            }else{
                cp2x = curX - Math.abs(((curX-cp1x)/2));
                cp2y = curY + 3;
            }
            
            //strSvg += "A" + arCorners[i].r + "," + arCorners[i].r + " 0 0,1 " + curLine.x2.toFixed(2) + "," + curLine.y2.toFixed(2);
            // not a perfect solution but it will do for now...
            strSvg += "A" + (radius*scale).toFixed(precision) + "," + (radius*scale).toFixed(precision) + " " + arcNums[1] + " " + arcNums[2] + "," + arcNums[3] + " " + ((cp1x*scale)+transX).toFixed(precision) + "," + ((cp1y*scale)+transY).toFixed(precision);
            curX = cp1x;
            curY = cp1y;
            prevCpx = curX;
            prevCpy = curY;
            break;
        case "a": // Arc relative TODO:
            //alert("Arc not implemented yet!");
            curIdx++; // remove this once implemented!
            tmpNum = svglib.GetNumberAt(str, curIdx);
            curIdx += tmpNum[0];
            var radius = tmpNum[1];
            var arcNums = [];
            for(var i = 0; i < 4; i++) // skip the next 4 numbers
            {
                tmpNum = svglib.GetNumberAt(str, curIdx);
                curIdx += tmpNum[0];
                arcNums[i] = tmpNum[1];
            }
            tmpNum = svglib.GetNumberAt(str, curIdx);
            curIdx += tmpNum[0];
            var cp1x = Number((tmpNum[1] + curX).toFixed(3));
            tmpNum = svglib.GetNumberAt(str, curIdx);
            curIdx += tmpNum[0];
            var cp1y =  Number((tmpNum[1] + curY).toFixed(3));
            // now use curX and curY to extrapolate a point between the points
            if(curX < cp1x)
            {
                cp2x = curX;
                cp2y = cp1y;
            }else{
                cp2x = cp1x;
                cp2y = curY;
            }
            //strSvg += "A" + arCorners[i].r + "," + arCorners[i].r + " 0 0,1 " + curLine.x2.toFixed(2) + "," + curLine.y2.toFixed(2);
            // not a perfect solution but it will do for now...
            strSvg += "A" + (radius*scale).toFixed(precision) + "," + (radius*scale).toFixed(precision) + " " + arcNums[1] + " " + arcNums[2] + "," + arcNums[3] + " " + ((cp1y*scale)+transY).toFixed(precision) + "," + ((curX*scale)+transX).toFixed(precision) + "," + ((curY*scale)+transY).toFixed(precision);
            curX = cp1x;
            curY = cp1y;
            prevCpx = curX;
            prevCpy = curY;
            break;
        case "Z":
        case "z": // end path
            strSvg += "z";
            curIdx++; // move to the next letter
            prevCpx = curX;
            prevCpy = curY;
            break;
        default: // should be a number unless I haven't captured a command
            // unknown, move to the next index
            curIdx++; // move to the next letter
            //alert("unknown command! " + str.charAt(curIdx));
            break;
        }
    }
    return strSvg;
}

var MutcdLeftArrowhead = {"width":59.2588,"height":72,"data":"M54.2798,49.291l4.7793,16.3242c0.1289,0.4434,0.1992,0.9111,0.1992,1.3965C59.2583,69.7656,57.0239,72,54.27,72c-1.0527,0-2.0332-0.3301-2.8379-0.8867L0,36L51.4321,0.8857C52.2368,0.3271,53.2173,0,54.27,0c2.7539,0,4.9883,2.2344,4.9883,4.9883c0,0.4854-0.0703,0.9531-0.1992,1.3965L54.2798,22.709"};
var MutcdRightArrowhead = {"width":59.2588,"height":72,"data":"M4.9785,22.709L0.1992,6.3848C0.0703,5.9414,0,5.4736,0,4.9883C0,2.2344,2.2344,0,4.9883,0C6.041,0,7.0215,0.3301,7.8262,0.8867L59.2588,36L7.8262,71.1143C7.0215,71.6729,6.041,72,4.9883,72C2.2344,72,0,69.7656,0,67.0117c0-0.4854,0.0703-0.9531,0.1992-1.3965L4.9785,49.291"};
var MutcdUpArrowhead = {"width":59.2588,"height":72,"data":"M22.709,54.2798L6.3848,59.0601c-0.4434,0.1279-0.9111,0.1992-1.3965,0.1992C2.2344,59.2593,0,57.0239,0,54.27c0-1.0527,0.3301-2.0332,0.8867-2.8379L36,0l35.1143,51.4321C71.6729,52.2368,72,53.2173,72,54.27c0,2.7539-2.2344,4.9893-4.9883,4.9893c-0.4854,0-0.9531-0.0713-1.3965-0.1992L49.291,54.2798"};
//var ArrowDirection = ["left","right","up","down"];

svglib.GetDoubleLRArrowData = function(width, height, x,y)
{
    var scale = common.GetScaleFactor(MutcdRightArrowhead.height, height);
    var revScale = common.GetScaleFactor(height,MutcdRightArrowhead.height);
    var rArrow = svglib.RenderPathData(MutcdRightArrowhead.data, 1, (width*revScale)-(59.2588), 0);
    rArrow = rArrow.replace("M","L");
    var lArrow = MutcdLeftArrowhead.data + rArrow;
    lArrow = svglib.RenderPathData(lArrow, scale,x,y);
    //lArrow += rArrow;
    //lArrow = fontlib.GetModifiedPath(lArrow, 1, x,y);
    return "<path fill=\"black\" d=\"" + lArrow+"z" + "\"/>";
} 


svglib.GetMutcdArrowData = function(width,length, x,y, dir)
{
    dir = dir || 0;
    var scale = GetScaleFactor(MutcdLeftArrowhead.height, width);
    var revScale = GetScaleFactor(width, MutcdLeftArrowhead.height);
    var l = length * revScale;
    var data = "";
    if(dir < 2)
    {
        var pt1Y = 22.709;
        var pt2Y = 49.291;
        var data = MutcdLeftArrowhead.data;
        data += "L" + l.toFixed(4) + " " + pt1Y.toFixed(4);
        data += "L" + l.toFixed(4) + " " + pt2Y.toFixed(4);// + "z";
    }else{
        var pt1X = 22.709;
        var pt2X = 49.291;
        data = MutcdUpArrowhead.data;
        data += "L" + pt1X.toFixed(4) + " " + l.toFixed(4);
        data += "L" + pt2X.toFixed(4) + " " + l.toFixed(4);// + "z";
    }
    data = GetModifiedPath(data, scale,x,y);
    return data;
}

// the purpose of this function is to size and translate raw SVG path data for later use.
// raw path data is stored as a JSON object containing the width, height and the 'd=' element called svgPathData
// {"name":"left","width":107.678,"height":95.905,"svgPathData":"\"M.....\""
// returns new string with manipulated data "\"M....\""
svglib.ManipPathData = function(rawObj, newHeight,transX, transY)
{
    var scale = common.GetScaleFactor(rawObj.height, newHeight);
    return this.RenderPathData(rawObj.svgPathData, scale, transX, transY);
}