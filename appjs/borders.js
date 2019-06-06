var common = require('./signcommon');
var borders = {};
module.exports = borders;

function degs(rad)
{  
    return (rad*180)/Math.PI;
}
function rads(deg)
{
    return (deg*Math.PI)/180;
}

function angleRad(x,y)
{
    return Math.atan2(y,x);
}

function angleDegs(x,y)
{
    return Math.atan2(y,x);
}

function mag(x,y)
{
    return Math.sqrt((x*x)+(y*y));
}

borders.Magnitude2D = function(x,y)
{
	return mag(x,y);
}

// rounds a float to the nearest quarter (0.25, 0.5, 0.75 or 0.0
borders.GetNearestQuarter = function(num)
{
    var wholePart = num.toFixed(0);
    var fraction = num - wholePart;
    if(fraction > 0.12)
    {
        if(fraction < 0.38)
        {
            fraction = 0.25;
        }else if(fraction < 0.62){
            fraction = 0.5;
        }else if(fraction < 0.88){
            fraction = 0.75;
        }else{
            fraction = 1.0;
        }
    }else{
        fraction = 0;
    }
    return (Number(wholePart) + fraction);
}

// if lineBorder is not provided, it is presumed true
// false is for an inset border
borders.CalculateInset = function(w,h,lineBorder)
{
    lineBorder = lineBorder==null?true:lineBorder;
    var min = Math.min(w,h);
    if(min < 18)
    {
        return 0.375;
    }else if(min < 30){
        return lineBorder?0.375:0.5;
    }else if(min < 36)
    {
        return lineBorder?0.5:0.75;
    }else if(min < 48)
    {
        return lineBorder?0.625:0.75;
    }else
    {
        return lineBorder?0.75:1.0;
    }
}

// only for line border
borders.CalcBorderWidth = function(w,h)
{
    var min = Math.min(w,h);
    if(min < 12)
    {
        return 0.375;
    }else if(min < 30)
    {
        return 0.438;
    }else if(min < 24){
        return 0.625;
    }else if(min < 36)
    {
        return 0.75;
    }else if(min < 48)
    {
        return 0.875;
    }else
    {
        return 1.25;
    }
}

borders.CalcRadius = function(w,h)
{
    var min = Math.min(w,h);
    if(min < 12)
    {
        return 1.0;
    }else if(min < 30)
    {
        return 1.5;
    }else if(min < 36){
        return 1.875;
    }else if(min < 48)
    {
        return 2.25;
    }else
    {
        return 3.0;
    }
}

// symbol border and radius sizes
borders.GetSymbolRadius = function(size)
{
    var retVal = 1.5;
    if(size < 9){
        retVal = 0.375
    }else if(size < 18){
        retVal = 0.75;
    }else {
        retVal = 1.5;
    }
    return retVal;
}// end GetRadius

borders.GetSymbolInset = function(size)
{
    var retVal = 0.5;
    if(size < 9){
        retVal = 0.25
    }else if(size < 18){
        retVal = 0.375;
    }else {
        retVal = 0.5;
    }
    return retVal;
}// end GetInset

function GetHalfPont(x1,y1,x2,y2)
{
	var pt = {};
	pt.x = x1 - x2;
	pt.y = y1 - y2;
	pt.x/=2;
	pt.y/=2;	
	pt.x += x2;
	pt.y += y2;
	return pt;
}

// returns in degrees
function angleBetween(x1,y1,x2,y2)
{
    //angle = arccos(dotProduct/mag1*mag2)
    var dot = (x1*x2) + (y1*y2);
    var mag1 = mag(x1,y1);
    var mag2 = mag(x2,y2);
    return Math.acos(dot/(mag1*mag2));
}

function roundedDist(x1,y1,x2,y2,r)
{
    var angle = angleBetween(x1,y1,x2,y2)/2;
    return r/Math.tan(angle);
}

function GetRoundedCornerPoints(corner, rad)
{
	var points = {};
	var vec1 = {};
	var vec2 = {};
	// grab appropriate vectors and translate to the origin
	vec1.x = corner.x1-corner.x2;
	vec1.y = corner.y1-corner.y2;
	vec2.x = corner.x3-corner.x2;
	vec2.y = corner.y3-corner.y2;
	// get the distance for the rounded corner to start from
	var dist = roundedDist(vec1.x,vec1.y,vec2.x, vec2.y,rad);
	// normalize the vectors
	var tmpMag = mag(vec1.x,vec1.y); 
	vec1.x /= tmpMag;
	vec1.y /= tmpMag;
	tmpMag = mag(vec2.x,vec2.y);
	vec2.x /= tmpMag;
	vec2.y /= tmpMag;
	// move to the correct location
	vec1.x *= dist;
	vec1.y *= dist;
	vec2.x *= dist;
	vec2.y *= dist;
	// translate back to desired location
	vec1.x += corner.x2;
	vec1.y += corner.y2;
	vec2.x += corner.x2;
	vec2.y += corner.y2;
	points.x1 = vec1.x;
	points.y1 = vec1.y;
	points.x2 = vec2.x;
	points.y2 = vec2.y;
	return points;
}

function GetLineIntersect(line1, line2) {
	// if the lines intersect, the result contains the x and y of the intersection
    var result = {
        x: null,
        y: null
    };
    var denominator = ((line2.y2 - line2.y1) * (line1.x2 - line1.x1)) - ((line2.x2 - line2.x1) * (line1.y2 - line1.y1));
    if (denominator == 0) {
        return result;
    }
    var a = line1.y1 - line2.y1;
    var b = line1.x1 - line2.x1;
    var numerator1 = ((line2.x2 - line2.x1) * a) - ((line2.y2 - line2.y1) * b);
    var numerator2 = ((line1.x2 - line1.x1) * a) - ((line1.y2 - line1.y1) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    // if we cast these lines infinitely in both directions, they intersect here:
    result.x = line1.x1 + (a * (line1.x2 - line1.x1));
    result.y = line1.y1 + (a * (line1.y2 - line1.y1));
    return result;
};

// point is an x,y,r combo (x,y,radius)
// asumes a clockwise position
function GetInsetPoint(prevPoint, curPoint, nextPoint, inset)
{
	var line1 = {};
	var line2 = {};
	var tmpDir = {}
	// calculate the new line 1
	tmpDir.x = prevPoint.y - curPoint.y;
	tmpDir.y = -(prevPoint.x - curPoint.x);
	var m = mag(tmpDir.x,tmpDir.y);
	tmpDir.x = (tmpDir.x/m) * inset;
	tmpDir.y = (tmpDir.y/m) * inset;
	line1.x1 = prevPoint.x + tmpDir.x;
	line1.y1 = prevPoint.y + tmpDir.y;
	line1.x2 = curPoint.x + tmpDir.x;
	line1.y2 = curPoint.y + tmpDir.y;

	// calculate the new line 2
	tmpDir.x = curPoint.y - nextPoint.y;
	tmpDir.y = -(curPoint.x - nextPoint.x);
	m = mag(tmpDir.x,tmpDir.y);
	tmpDir.x = (tmpDir.x/m) * inset;
	tmpDir.y = (tmpDir.y/m) * inset;
	line2.x1 = curPoint.x + tmpDir.x;
	line2.y1 = curPoint.y + tmpDir.y;
	line2.x2 = nextPoint.x + tmpDir.x;
	line2.y2 = nextPoint.y + tmpDir.y;

	//var p = GetInstersectPoint(line1,line2);
	var p = GetLineIntersect(line1, line2);
	p.r = curPoint.r - inset;
	if(p.r < 0)
	{
		p.r = 0;
	}
	return p;
}

borders.GetPolyInset = function(poly,inset,forcedRadius)
{
	// poly represents the corners so I will make
	// two lines using the previous and next points
	// in order to calculate the new corner
	var prev = 0;
	var next = 1;
	var max = poly.length-1;
	var newPoly = [];
	for(var i = 0; i < poly.length; i++)
	{
		prev = i - 1;
		if(prev < 0)
		{
			prev = max;
		}
		next = i+1;
		if(next > max)
		{
			next = 0;
		}
		newPoly[i] = GetInsetPoint(poly[prev],poly[i],poly[next], inset);
		if(forcedRadius != null)
		{
			newPoly[i].r = forcedRadius;
		}
	}
	return newPoly;
}
/*
// poly is an array of x,y,r values representing a ploygon
function drawRoundedPoly(poly,ctx)
{
    var prev = poly.length;
    var next = 1;
    var bFirst = true;
    ctx.beginPath();
    for(var i = 0; i < poly.length; i++)
    {
        prev = i-1;
        if(prev <0)
            prev = poly.length-1;
        next = i+1;
        if(next > poly.length-1)
            next = 0;
		var corner = {};
		corner.x1 = poly[prev].x;
		corner.y1 = poly[prev].y;
		corner.x2 = poly[i].x;
		corner.y2 = poly[i].y;
		corner.x3 = poly[next].x;
		corner.y3 = poly[next].y;
		corner = GetRoundedCornerPoints(corner,poly[i].r);
        // draw!
        if(bFirst)
        {
            bFirst = false;
            ctx.moveTo(corner.x1, corner.y1);
        }else{
            ctx.lineTo(corner.x1, corner.y1);
        }
        ctx.arcTo(poly[i].x, poly[i].y,corner.x2, corner.y2, poly[i].r);
    }
    ctx.closePath();
}
*/

// poly is an array of x,y,r values representing a polygon with round corners
borders.GetRoundedPolySVG = function(poly,transX,transY)
{
	transX = transX || 0;
    transY = transY || 0;
	if(poly == null)
	{
		return "";
	}
	var strSvg = "";
    var prev = poly.length;
    var next = 1;
    var bFirst = true;
    for(var i = 0; i < poly.length; i++)
    {
        prev = i-1;
        if(prev <0)
            prev = poly.length-1;
        next = i+1;
        if(next > poly.length-1)
            next = 0;
		var corner = {};
		corner.x1 = poly[prev].x;
		corner.y1 = poly[prev].y;
		corner.x2 = poly[i].x;
		corner.y2 = poly[i].y;
		corner.x3 = poly[next].x;
		corner.y3 = poly[next].y;
		corner = GetRoundedCornerPoints(corner,poly[i].r);
        // draw!
        if(bFirst)
        {
            bFirst = false;
			strSvg += "M" + (transX + corner.x1).toFixed(4) + " " + (transY + corner.y1).toFixed(4);
        }else{
			strSvg += "L" + (transX + corner.x1).toFixed(4) + " " + (transY + corner.y1).toFixed(4);
        }
		strSvg += "A" + poly[i].r.toFixed(4) + " " + poly[i].r.toFixed(4) + " 0 0 1 " + (transX + corner.x2).toFixed(4) + " " + (transY + corner.y2).toFixed(4);
	}
	strSvg += "z";
    return strSvg;
}

borders.GetPolyCorners = function(w,h,shape,rad)
{
	var rect = [];
	switch(shape)
	{
		case 2: // diamond
			var s = mag(w, h);
			rect[0] = {};
			rect[0].x = 0;
			rect[0].y = s/2;
			rect[0].r = rad;
			rect[1] = {};
			rect[1].x = s/2;
			rect[1].y = 0;
			rect[1].r = rad;
			rect[2] = {};
			rect[2].x = s;
			rect[2].y = s/2;
			rect[2].r = rad;
			rect[3] = {};
			rect[3].x = s/2;
			rect[3].y = s;
			rect[3].r = rad;
		break;
		case 1: // basic rectangle
		default:
			rect[0] = {};
			rect[0].x = 0;
			rect[0].y = 0;
			rect[0].r = rad;
			rect[1] = {};
			rect[1].x = w;
			rect[1].y = 0;
			rect[1].r = rad;
			rect[2] = {};
			rect[2].x = w;
			rect[2].y = h;
			rect[2].r = rad;
			rect[3] = {};
			rect[3].x = 0;
			rect[3].y = h;
			rect[3].r = rad;
		break;
	}
	return rect;
}

borders.PolygonPoints = function(n,x,y,r,angle,counterclockwise)
{
    var points = [];
    angle = angle || 0;
    if(angle > 0)
        angle = rads(angle);
    counterclockwise = counterclockwise || false;
    points[0] = {};
    points[0].x = x + r*Math.sin(angle);
    points[0].y = y - r*Math.cos(angle);
    var delta = 2*Math.PI/n;
    for(var i = 1; i < n; i++) {
        angle += counterclockwise?-delta:delta;
        points[i] = {};
        points[i].x = x + r*Math.sin(angle);
        points[i].y = y - r*Math.cos(angle);
    }
    return points;
}


// sign has basic info, this expands it in preperation for SVG rendering
borders.FillSignBase = function(sign)
{
	if(sign.shape == 2)// diamond shape
	{
		var s = mag(sign.width,sign.height);
		sign.svgWidth = s;
		sign.svgHeight = s;
	}
	else{
		sign.svgWidth = sign.width;
		sign.svgHeight = sign.height;
	}
	if(!("strSize" in sign)){
		sign.strSize = sign.width + "in X " + sign.height + "in";
	}
	if(!("type" in sign))
	{
		sign.type = 1; // border
	}
	if(!("shape" in sign))
	{
		sign.shape = 0; // rectangle
	}
	if(!("radius" in sign)){
		sign.radius = borders.CalcRadius(sign.width,sign.height);
	}
	var scale = 1;
	if("scaleto" in sign)
	{
		scale = common.GetScaleFactor(Math.max(sign.svgWidth,sign.svgHeight),sign.scaleto);
	}
	var width = sign.width*scale;
	var height = sign.height*scale;
	sign.svgWidth *= scale;
	sign.svgHeight *= scale;
	sign.edge = borders.GetPolyCorners(width,height,sign.shape,sign.radius*scale);
	sign.inset = null;
	sign.border = null;
	if(sign.type > 0)
	{
		if(!("insetWidth" in sign)){
			sign.insetWidth = borders.CalculateInset(width,height,sign.type==1?true:false);
		}
		sign.inset = borders.GetPolyInset(sign.edge,sign.insetWidth*scale);
		if(sign.type == 1)
		{
			if(!("borderWidth" in sign)){
				sign.borderWidth = borders.CalcBorderWidth(sign.width,sign.height);
			}
			sign.border = borders.GetPolyInset(sign.inset, sign.borderWidth*scale);
		}
	}
	return sign;
}

borders.GetSignBase = function(w,h,typeBorder,shape)
{
	var signBase = {};
	signBase.width = w;
	signBase.height = h;
	if(shape == 2) // diamond sign is an exception
	{
		var s = mag(w,h);
		signBase.svgWidth = s;
		signBase.svgHeight = s;
	}
	signBase.strSize = w + "in X " + h + "in";
	signBase.type = typeBorder;
	signBase.shape = shape;
	var rad = borders.CalcRadius(w,h);
	signBase.edge = borders.GetPolyCorners(w,h,shape,rad);
	signBase.inset = null;
	signBase.border = null;
	if(typeBorder > 0)
	{
		var inset = borders.CalculateInset(w,h,typeBorder==1?true:false);
		signBase.inset = borders.GetPolyInset(signBase.edge,inset);
		if(typeBorder == 1)
		{
			inset = borders.CalcBorderWidth(w,h);
			signBase.border = borders.GetPolyInset(signBase.inset, inset);
		}
	}
    return signBase;
}

// get sign base with border
borders.GetRectSignBase = function(w,h,type)
{
    var rect = [];
	var signBase = {};
	signBase.width = w;
	signBase.height = h;
	signBase.strSize = w + "in X " + h + "in";
	signBase.type = type;
    var rad = CalcRadius(w,h);
    rect[0] = {};
    rect[0].x = 0;
    rect[0].y = 0;
    rect[0].r = rad;
    rect[1] = {};
    rect[1].x = w;
    rect[1].y = 0;
    rect[1].r = rad;
    rect[2] = {};
    rect[2].x = w;
    rect[2].y = h;
    rect[2].r = rad;
    rect[3] = {};
    rect[3].x = 0;
    rect[3].y = h;
    rect[3].r = rad;
	signBase.edge = rect;
	signBase.inset = null;
	signBase.border = null;
	if(type > 0)
	{
		var inset = CalculateInset(w,h,type==1?true:false);
		signBase.inset = GetPolyInset(signBase.edge,inset);
		if(type == 1)
		{
			inset = CalcBorderWidth(w,h);
			signBase.border = GetPolyInset(signBase.inset, inset);
		}
	}
    return signBase;
}

borders.GetDiamondSignBase = function(edgeSize,type)
{
    var rect = [];
	var signBase = {};
	var w = mag(edgeSize, edgeSize);
	signBase.width = w;
	signBase.height = w;
	signBase.strSize = edgeSize + "in X " + edgeSize + "in";
	signBase.type = type;
    var rad = CalcRadius(edgeSize,edgeSize);
    rect[0] = {};
    rect[0].x = 0;
    rect[0].y = w/2;
    rect[0].r = rad;
    rect[1] = {};
    rect[1].x = w/2;
    rect[1].y = 0;
    rect[1].r = rad;
    rect[2] = {};
    rect[2].x = w;
    rect[2].y = w/2;
    rect[2].r = rad;
    rect[3] = {};
    rect[3].x = w/2;
    rect[3].y = w;
    rect[3].r = rad;
	signBase.edge = rect;
	signBase.inset = null;
	signBase.border = null;
	if(type > 0)
	{
		var inset = CalculateInset(edgeSize,edgeSize,type==1?true:false);
		signBase.inset = GetPolyInset(signBase.edge,inset);
		if(type == 1)
		{
			inset = CalcBorderWidth(edgeSize,edgeSize);
			signBase.border = GetPolyInset(signBase.inset, inset);
		}
	}
    return signBase;
}

function ScaleCorners(corners, scale)
{
	if(corners == null)
	{
		return null;
	}
	var newCorners = [];
	for(var i = 0; i < corners.length; i++)
	{
		newCorners[i] = {};
		newCorners[i].x = corners[i].x*scale;
		newCorners[i].y = corners[i].y*scale;
		newCorners[i].r = corners[i].r*scale;
	}
	return newCorners;
}

function ScaleLines(arLines, scale)
{
	var newLines = [];
	for(var i in arLines)
	{
		newLines[i] = {};
		newLines[i].text = arLines[i].text;
		newLines[i].fontId = arLines[i].fontId;
		newLines[i].top = arLines[i].top * scale;
		newLines[i].left = arLines[i].left * scale;
		newLines[i].size = arLines[i].size * scale;
		newLines[i].spacing = arLines[i].spacing;
	}
	return newLines;
}

borders.ScaleSign = function(sign, maxSize)
{
	var side = Math.max(sign.width,sign.height);
	var scale = maxSize/side;
	var newSignBase = {};
	newSignBase.type = sign.type;
	newSignBase.width = sign.width * scale;
	newSignBase.height = sign.height * scale;
	newSignBase.edge = ScaleCorners(sign.edge, scale);
	newSignBase.inset = ScaleCorners(sign.inset, scale);
	newSignBase.border = ScaleCorners(sign.border, scale);
	newSignBase.lines = ScaleLines(sign.lines,scale);
	return newSignBase;
}

borders.GetInsetSections = function(signData, dividers)
{
    sections = [];
    var nVert = 0;
    var nHor = 0;
    var inset = (signData.borderType == 1?signData.inset + signData.borderWidth:signData.inset);
    var radius = (signData.borderType == 1?signData.radius - (signData.inset + signData.borderWidth):signData.radius - signData.inset);
    if(signData.borderType == 0)
    {
        inset = 0;
        radius = signData.radius;
    }
    if(radius < 0)
        radius = 0;
    // generate separators
    var arHor = []; // record the index of the info
    var arVert = [];
    for(var i = 0; i < dividers.length; i++)
    {
        if(dividers[i].type == 1)
        {
            arHor[nHor] = i;
            nHor++;
        }
        else if(dividers[i].type == 2){
            arVert[nVert] = i;
            nVert++;
        }
    }
    arHor[nHor] = -1;
    nHor++; // a divider creates dividers + 1 sections to generate
    arVert[nVert] = -1;
    nVert++;
    var curRight = 0;
    var curLeft = inset;
    var curTop = inset;
    var curBottom = 0;
    var bAtTop = true;
    var bAtLeft = true;
    var count = 0;
    for(var row = 0; row < nHor; row++)
    {
        var horDivWide = 0;
        if(arHor[row] == -1)
        {
            // I have reached the bottom
            if(curBottom == 0) // I'm at the first
            {
                curTop = inset;
            }else{
                curTop = curBottom;
            }
            curBottom = signData.height - inset;
        }else{
            if(curBottom == 0) // I'm at the first
            {
                curTop = inset;
            }else{
                curTop = curBottom;
            }
            horDivWide = dividers[arHor[row]].w;
            curBottom = dividers[arHor[row]].pos - (horDivWide/2);
        }
        bAtLeft = true;
        for(var col = 0; col < nVert; col++)
        {
            curLeft = (bAtLeft?inset:curRight);
            var dividerWidth = 0;
            if(arVert[col] == -1)
            {
                curRight = signData.width - inset;
            }else{
                dividerWidth = dividers[arVert[col]].w;
                curRight = dividers[arVert[col]].pos - (dividerWidth/2);
            }
            sections[count] = {};
            sections[count].corners = [];
            sections[count].corners[0] = {};
            sections[count].corners[1] = {};
            sections[count].corners[2] = {};
            sections[count].corners[3] = {};
            sections[count].corners[0].x = curLeft;
            sections[count].corners[0].y = curTop;
            sections[count].corners[0].r = (bAtLeft && bAtTop?radius:0);
            sections[count].corners[1].x = curRight;
            sections[count].corners[1].y = curTop;
            sections[count].corners[1].r = ((col == nVert-1 && bAtTop)?radius:0);
            sections[count].corners[2].x = curRight;
            sections[count].corners[2].y = curBottom;
            sections[count].corners[2].r = ((row==nHor-1 && col == nVert-1)?radius:0);
            sections[count].corners[3].x = curLeft;
            sections[count].corners[3].y = curBottom;
            sections[count].corners[3].r = ((bAtLeft && row==nHor-1)?radius:0);
            count++;
            curRight += dividerWidth; // setup so the next left can be setup
            bAtLeft = false;
        }
        curBottom += horDivWide; // setup for the next top
        bAtTop = false;
    }
    return sections;
}

