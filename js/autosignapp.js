var urlRoot = "http://localhost:8085/";
// this is more of a reminder of what the multi-control part affects,
// so 0 = Divider Lines, etc
var signParts = ["Divider Lines", "Text Lines", "Symbols", "Shapes", "Sizes"];
var optionLists = {};
var txtbxStyle = { width: '75px' };

class DividerRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = { line: props.line, type: 1 };
        this.data = { type: 1 };
        this.updateParent = props.callback;
    }
    update(data) {
        this.data = data;
        this.setState({ type: data.type });
    }

    sendUpdate() {
        if (this.updateParent != null) {
            this.updateParent(this.state.line, this.data);
        }
    }

    onChangeDivider(e, line) {
        this.data.type = e.target.value;
        this.setState({ type: e.target.value });
        this.sendUpdate();
    }
    render() {
        //var type = autosign.dividers[Number(this.state.line)].type;
        return React.createElement(
            "tr",
            { key: "divider" + Number(this.state.line) },
            React.createElement(
                "td",
                null,
                "\xA0\xA0\xA0\xA0",
                React.createElement(
                    "b",
                    null,
                    "Divider ",
                    this.state.line + 1,
                    ":"
                )
            ),
            React.createElement(
                "td",
                null,
                " Type",
                React.createElement("br", null),
                React.createElement(
                    "select",
                    { onChange: e => this.onChangeDivider(e, this.state.line), value: this.data.type },
                    optionLists.dividerType.map(itm => React.createElement(
                        "option",
                        { key: "divider" + String(itm.id), value: itm.id },
                        itm.name
                    ))
                )
            )
        );
    }
}

class TextRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = { line: props.line, text: "", center: false, canEdit: false };
        this.data = { text: this.state.text, center: this.state.center, canEdit: this.state.canEdit };
        this.updateParent = props.callback;
    }
    update(data) {
        this.data = data;
        //alert(JSON.stringify(data));
        this.setState({ text: this.data.text, center: this.data.center, canEdit: this.data.canEdit });
    }

    sendUpdate() {
        if (this.updateParent != null) {
            this.updateParent(this.state.line, this.data);
        }
    }

    onChangeText(e, line) {
        //autosign.lines[line].text = e.target.value;
        this.data.text = e.target.value;
        this.setState({ text: this.data.text });
        this.sendUpdate();
    }
    onClickCenter(e, line) {
        //autosign.lines[line].center = e.target.checked;
        this.data.center = e.target.checked;
        this.setState({ center: this.data.center });
        this.sendUpdate();
    }
    onClickCanEdit(e, line) {
        //autosign.lines[line].center = e.target.checked;
        this.data.canEdit = e.target.checked;
        this.setState({ canEdit: this.data.canEdit });
        this.sendUpdate();
    }

    render() {
        return React.createElement(
            "tr",
            { key: "Line" + this.state.line },
            React.createElement(
                "td",
                null,
                "\xA0\xA0\xA0\xA0",
                React.createElement(
                    "b",
                    null,
                    "Line ",
                    this.state.line + 1,
                    ":"
                )
            ),
            React.createElement(
                "td",
                null,
                "Text",
                React.createElement("br", null),
                React.createElement("input", { value: this.data.text, onChange: e => this.onChangeText(e, this.state.line), placeholder: "Sign Text" })
            ),
            React.createElement(
                "td",
                null,
                "Center ",
                React.createElement("br", null),
                React.createElement("input", { type: "checkbox", onChange: e => this.onClickCenter(e, this.state.line), checked: this.state.center })
            ),
            React.createElement(
                "td",
                null,
                "Editable ",
                React.createElement("br", null),
                React.createElement("input", { type: "checkbox", onChange: e => this.onClickCanEdit(e, this.state.line), checked: this.state.canEdit })
            )
        );
    }
}

class ShapeRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = { line: props.line, shape: 1, color: 2 };
        this.data = { shape: 1, color: 2 };
        this.updateParent = props.callback;
    }
    update(data) {
        this.data = data;
        this.setState({ shape: data.shape, color: data.color });
    }

    sendUpdate() {
        if (this.updateParent != null) {
            this.updateParent(this.state.line, this.data);
        }
    }

    onChangeShape(e, line) {
        //autosign.shapes[line].shape = e.target.value;
        this.data.shape = e.target.value;
        this.setState({ shape: e.target.value });
        this.sendUpdate();
    }

    onChangeColor(e, line) {
        //autosign.shapes[line].color = e.target.value;
        this.data.color = e.target.value;
        this.setState({ color: e.target.value });
        this.sendUpdate();
    }

    render() {
        return React.createElement(
            "tr",
            { key: "Shape" + this.state.line },
            React.createElement(
                "td",
                null,
                "\xA0\xA0\xA0\xA0",
                React.createElement(
                    "b",
                    null,
                    "Shape ",
                    this.state.line + 1,
                    ":"
                ),
                " "
            ),
            React.createElement(
                "td",
                null,
                "Shape",
                React.createElement("br", null),
                React.createElement(
                    "select",
                    { onChange: e => this.onChangeShape(e, this.state.line), value: this.data.shape },
                    optionLists.shapeObject.map(itm => React.createElement(
                        "option",
                        { key: "divider" + String(itm.id), value: itm.id },
                        itm.name
                    ))
                )
            ),
            React.createElement(
                "td",
                null,
                "Color ",
                React.createElement("br", null),
                React.createElement(
                    "select",
                    { onChange: e => this.onChangeColor(e, this.state.line), value: this.data.color },
                    optionLists.signColors.map(itm => React.createElement(
                        "option",
                        { key: this.state.line + String(itm.id), value: itm.id },
                        itm.name
                    ))
                )
            )
        );
    }
}

class SymbolRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = { line: props.line, catIdx: 1, symIdx: 0, color: 2, flipH: false, flipV: false, canEdit: false };
        this.data = { cat: 1, sym: 1, color: 2, horflip: false, vertflip: false, canEdit: false };
        this.updateParent = props.callback;
    }
    update(data) {
        this.data = data;
        this.setState({ catIdx: data.cat, symIdx: data.sym, color: data.color, flipH: data.horflip, flipV: data.vertflip });
    }
    sendUpdate() {
        if (this.updateParent != null) {
            this.updateParent(this.state.line, this.data);
        }
    }
    onChangeCategory(e, line) {
        //autosign.symbols[line].cat = e.target.value;
        this.data.cat = e.target.value;
        this.data.sym = 0;
        this.setState({ catIdx: e.target.value, symIdx: 0 });
        this.sendUpdate();
    }

    onChangeSymbol(e, line) {
        //autosign.symbols[line].sym = optionLists.symbols[this.state.category].items[e.target.value].id;
        this.data.sym = optionLists.symbols[this.state.catIdx].items[e.target.value].value;
        this.setState({ symIdx: e.target.value });
        this.sendUpdate();
    }

    onChangeColor(e, line) {
        //autosign.symbols[line].color = e.target.value;
        this.data.color = e.target.value;
        this.setState({ color: e.target.value });
        this.sendUpdate();
    }

    onFlipH(e, line) {
        //autosign.symbols[line].horflip = e.target.checked;
        this.data.horflip = e.target.checked;
        this.setState({ flipH: e.target.checked });
        this.sendUpdate();
    }

    onFlipV(e, line) {
        //autosign.symbols[line].vertflip = e.target.checked;
        this.data.vertflip = e.target.checked;
        this.setState({ flipV: e.target.checked });
        this.sendUpdate();
    }

    onCanEdit(e, line) {
        //autosign.symbols[line].vertflip = e.target.checked;
        this.data.canEdit = e.target.checked;
        this.setState({ canEdit: e.target.checked });
        this.sendUpdate();
    }

    render() {
        return React.createElement(
            React.Fragment,
            { key: "Symbol" + this.state.line },
            React.createElement(
                "tr",
                null,
                React.createElement(
                    "td",
                    null,
                    "\xA0\xA0\xA0\xA0",
                    React.createElement(
                        "b",
                        null,
                        "Symbol ",
                        this.state.line + 1,
                        ": "
                    )
                ),
                React.createElement(
                    "td",
                    null,
                    "Category ",
                    React.createElement("br", null),
                    React.createElement(
                        "select",
                        { onChange: e => this.onChangeCategory(e, this.state.line), value: this.state.catIdx },
                        optionLists.symbolCategory.map(itm => React.createElement(
                            "option",
                            { key: this.state.line + String(itm.id), value: itm.id },
                            itm.name
                        ))
                    )
                ),
                React.createElement(
                    "td",
                    null,
                    "\xA0Symbol ",
                    React.createElement("br", null),
                    React.createElement(
                        "select",
                        { onChange: e => this.onChangeSymbol(e, this.state.line), value: this.state.symIdx },
                        optionLists.symbols[this.state.catIdx].items.map(itm => React.createElement(
                            "option",
                            { key: this.state.line + String(itm.id), value: itm.value },
                            itm.name
                        ))
                    )
                ),
                React.createElement(
                    "td",
                    null,
                    React.createElement(
                        "svg",
                        { width: "72px", height: "72px" },
                        React.createElement("path", { fill: optionLists.signColors[this.data.color].value, d: optionLists.symbols[this.state.catIdx].items[this.state.symIdx].data })
                    )
                )
            ),
            React.createElement(
                "tr",
                null,
                React.createElement("td", null),
                React.createElement(
                    "td",
                    null,
                    "Color ",
                    React.createElement("br", null),
                    React.createElement(
                        "select",
                        { onChange: e => this.onChangeColor(e, this.state.line), value: this.data.color },
                        optionLists.signColors.map(itm => React.createElement(
                            "option",
                            { key: this.state.line + String(itm.id), value: itm.id },
                            itm.name
                        ))
                    )
                ),
                React.createElement(
                    "td",
                    null,
                    "Flip Horizontal ",
                    React.createElement("br", null),
                    React.createElement("input", { type: "checkbox", checked: this.state.flipH, onChange: e => this.onFlipH(e, this.state.line) })
                ),
                React.createElement(
                    "td",
                    null,
                    "Flip Vertical ",
                    React.createElement("br", null),
                    React.createElement("input", { type: "checkbox", checked: this.state.flipV, onChange: e => this.onFlipV(e, this.state.line) })
                ),
                React.createElement(
                    "td",
                    null,
                    "Editable ",
                    React.createElement("br", null),
                    React.createElement("input", { type: "checkbox", checked: this.state.canEdit, onChange: e => this.onCanEdit(e, this.state.line) })
                )
            )
        );
    }
}

function getDefaultObject(signPart) {
    var retval = null;
    switch (Number(signPart)) {
        case 0:
            // divider lines
            retval = { type: 1 };
            break;
        case 1:
            // text lines
            retval = { text: "", center: true, canEdit: false };
            break;
        case 2:
            // shapes
            retval = { shape: 1, color: 2 };
            break;
        case 3:
            // symbols
            retval = { cat: 1, sym: 0, color: 2, horflip: false, vertflip: false };
            break;
        case 4:
            // sizes
            autosign.sizes;
            break;
    }

    return retval;
}

class MultiCtrl extends React.Component {
    constructor(props) {
        super(props);
        this.state = { curItem: Number(props.curItem),
            maxItems: Number(props.maxItems),
            label: props.label,
            signPart: props.signPart,
            changed: false
        };
        this.data = [];
        this.lineRefs = [];
        this.updateData = props.callback;
    }

    update(data) {
        this.data = data;
        //alert(JSON.stringify(data));
        this.setState({ changed: !this.state.changed, curItem: data.length });
        for (var i in data) {
            //alert(JSON.stringify(data[i]));
            if (i < this.lineRefs.length) this.lineRefs[i].current.update(data[i]);
        }
    }

    componentCallback(line, data) {
        this.data[line] = data;
        if (this.updateData != null) {
            this.updateData(this.state.signPart, this.data);
        }
    }

    setCount(signPart, count) {
        var tmp = this.data;
        this.data = [];
        for (var i = 0; i < count; i++) {
            if (i < tmp.length - 1) {
                this.data[i] = tmp[i];
            } else {
                this.data[i] = getDefaultObject(this.state.signPart);
            }
        }
    }

    handleChange(event) {
        this.setState({ curItem: event.target.value });
        this.setCount(this.state.signPart, event.target.value);
        if (this.updateData != null) {
            this.updateData(this.state.signPart, this.data);
        }
    }

    render() {
        var arOptions = [];
        var arRows = [];
        var style = { width: '500px' };
        for (var i = 0; i < this.state.maxItems; i++) {
            arOptions.push(React.createElement(
                "option",
                { key: "MCI" + String(this.state.signPart) + "_" + String(i), value: i },
                " ",
                i,
                " "
            ));
            if (i < this.state.curItem) {
                var key = "MCR_" + String(this.state.signPart) + "_" + String(i);
                this.lineRefs[i] = React.createRef();
                //arRows.push(<CtrlRow key={key} line={i} signPart={this.state.signPart} callback={this.componentCallback}/>);
                switch (Number(this.state.signPart)) {
                    case 0:
                        // divider lines
                        arRows.push(React.createElement(DividerRow, { ref: this.lineRefs[i], key: key, line: i, callback: this.componentCallback.bind(this) }));
                        break;
                    case 1:
                        // text lines
                        arRows.push(React.createElement(TextRow, { ref: this.lineRefs[i], key: key, line: i, callback: this.componentCallback.bind(this) }));
                        break;
                    case 2:
                        // shapes
                        arRows.push(React.createElement(ShapeRow, { ref: this.lineRefs[i], key: key, line: i, callback: this.componentCallback.bind(this) }));
                        break;
                    case 3:
                        // symbols
                        arRows.push(React.createElement(SymbolRow, { ref: this.lineRefs[i], key: key, line: i, callback: this.componentCallback.bind(this) }));
                        break;
                    //case 4: // sizes
                    //arRows.push(<SizeRow key={key} line={i} callback={this.componentCallback.bind(this)}/>);
                    //    break;
                }
            }
        }

        return React.createElement(
            "div",
            { style: style },
            React.createElement(
                "h3",
                null,
                this.state.label,
                "\xA0",
                React.createElement(
                    "select",
                    { onChange: this.handleChange.bind(this), value: this.state.curItem },
                    arOptions
                )
            ),
            React.createElement(
                "table",
                null,
                React.createElement(
                    "tbody",
                    null,
                    arRows
                )
            )
        );
    }
}

//////////////// size specific settings ////////////////////////

function getDefaultSizeObject(type) {
    var obj = null;
    switch (Number(type)) {
        case 0:
            // divider
            obj = { pos: 2, w: 0.5 };
            break;
        case 1:
            // text
            obj = { top: -1, left: -1, fontOverride: -1, fontSizeOverride: -1, spacing: 1, color: -1 };
            break;
        case 2:
            // shape
            obj = { x: 0, y: 0, r: 0, w: 2, h: 2 };
            break;
        case 3:
            // symbol
            obj = { height: 2, top: 0, centerVert: false, left: 4, centerHor: false };
            break;
    }
    return obj;
}

class SizeDivider extends React.Component {
    constructor(props) {
        super(props);
        this.state = { line: props.line, changed: false };
        this.data = props.data;
        this.updateParent = props.callback;
    }
    updateData() {
        if (this.updateParent) {
            this.updateParent(this.state.line, this.data);
        }
    }
    posChange(e) {
        this.data.pos = e.target.value;
        this.updateData();
        this.setState({ changed: !this.state.changed });
    }
    wideChange(e) {
        this.data.w = e.target.value;
        this.updateData();
        this.setState({ changed: !this.state.changed });
    }

    render() {
        return React.createElement(
            "tr",
            null,
            React.createElement(
                "td",
                null,
                " \xA0\xA0\xA0Divider ",
                this.state.line + 1
            ),
            React.createElement(
                "td",
                null,
                "Position",
                React.createElement("br", null),
                React.createElement("input", { style: txtbxStyle, value: this.data.pos, onChange: e => this.posChange(e) })
            ),
            React.createElement(
                "td",
                null,
                "Width",
                React.createElement("br", null),
                React.createElement("input", { style: txtbxStyle, value: this.data.w, onChange: e => this.wideChange(e) })
            )
        );
    }
}

class SizeText extends React.Component {
    constructor(props) {
        super(props);
        this.state = { line: props.line, changed: false };
        this.data = props.data;
        this.updateParent = props.callback;
    }
    updateData() {
        if (this.updateParent) {
            this.updateParent(this.state.line, this.data);
        }
    }
    leftChange(e) {
        this.data.left = e.target.value;
        this.updateData();
        this.setState({ changed: !this.state.changed });
    }
    topChange(e) {
        this.data.top = e.target.value;
        this.updateData();
        this.setState({ changed: !this.state.changed });
    }
    fontSizeChange(e) {
        this.data.fontSizeOverride = e.target.value;
        this.updateData();
        this.setState({ changed: !this.state.changed });
    }
    fontTypeChange(e) {
        this.data.fontOverride = e.target.value;
        this.updateData();
        this.setState({ changed: !this.state.changed });
    }
    spacingChange(e) {
        this.data.spacing = e.target.value;
        this.updateData();
        this.setState({ changed: !this.state.changed });
    }
    colorChange(e) {
        this.data.fill = e.target.value;
        this.updateData();
        this.setState({ changed: !this.state.changed });
    }

    render() {
        return React.createElement(
            React.Fragment,
            null,
            React.createElement(
                "tr",
                null,
                React.createElement(
                    "td",
                    null,
                    " \xA0\xA0\xA0Line ",
                    this.state.line + 1
                ),
                React.createElement(
                    "td",
                    null,
                    "Left",
                    React.createElement("br", null),
                    React.createElement("input", { style: txtbxStyle, value: this.data.left, onChange: e => this.leftChange(e) })
                ),
                React.createElement(
                    "td",
                    null,
                    "Top",
                    React.createElement("br", null),
                    React.createElement("input", { style: txtbxStyle, value: this.data.top, onChange: e => this.topChange(e) })
                ),
                React.createElement(
                    "td",
                    null,
                    "Font Size",
                    React.createElement("br", null),
                    React.createElement("input", { style: txtbxStyle, value: this.data.fontSizeOverride, onChange: e => this.fontSizeChange(e) })
                ),
                React.createElement(
                    "td",
                    null,
                    "Font Type",
                    React.createElement("br", null),
                    React.createElement(
                        "select",
                        { value: this.data.fontOverride, onChange: e => this.fontTypeChange(e) },
                        optionLists.fonts.map(itm => React.createElement(
                            "option",
                            { key: this.state.line + String(itm.id), value: itm.id },
                            itm.name
                        ))
                    )
                )
            ),
            React.createElement(
                "tr",
                null,
                React.createElement("td", null),
                React.createElement(
                    "td",
                    null,
                    "Spacing",
                    React.createElement("br", null),
                    React.createElement("input", { style: txtbxStyle, value: this.data.spacing, onChange: e => this.spacingChange(e) })
                ),
                React.createElement(
                    "td",
                    null,
                    "Color",
                    React.createElement("br", null),
                    React.createElement(
                        "select",
                        { value: this.data.fill, onChange: e => this.colorChange(e) },
                        optionLists.signColors.map(itm => React.createElement(
                            "option",
                            { key: this.state.line + String(itm.id), value: itm.id },
                            itm.name
                        ))
                    )
                )
            )
        );
    }
}
var arShapeType = [];
class SizeShape extends React.Component {
    constructor(props) {
        super(props);
        this.state = { line: props.line, changed: false };
        this.data = props.data;
        this.updateParent = props.callback;
    }
    updateData() {
        if (this.updateParent) {
            this.updateParent(this.state.line, this.data);
        }
    }
    xChange(e) {
        this.data.x = e.target.value;
        this.updateData();
        this.setState({ changed: !this.state.changed });
    }
    yChange(e) {
        this.data.y = e.target.value;
        this.updateData();
        this.setState({ changed: !this.state.changed });
    }
    widthChange(e) {
        this.data.w = e.target.value;
        this.updateData();
        this.setState({ changed: !this.state.changed });
    }
    heightChange(e) {
        this.data.h = e.target.value;
        this.updateData();
        this.setState({ changed: !this.state.changed });
    }
    radiusChange(e) {
        this.data.r = e.target.value;
        this.updateData();
        this.setState({ changed: !this.state.changed });
    }

    // 1 rect, 2 circle, 3 poly, 4 star, 5 diamond
    getWLabel(shape) {
        var str = "Width/Size";
        switch (shape) {
            case 1:
                str = "Width";
                break;
            case 2:
                str = "X Radius";
                break;
            case 3:
                str = "Width";
                break;
            case 4:
                str = "Size";
                break;
            case 5:
                str = "Width";
                break;
            default:
                break;
        }
        return str;
    }
    getHLabel(shape) {
        var str = "Height/Rotate";
        switch (shape) {
            case 1:
                str = "Height";
                break;
            case 2:
                str = "Y Radius";
                break;
            case 3:
                str = "Rotate";
                break;
            case 4:
                str = "N/A";
                break;
            case 5:
                str = "Height";
                break;
            default:
                break;
        }
        return str;
    }
    getRLabel(shape) {
        var str = "Radius/Edges";
        switch (shape) {
            case 1:
                str = "Corner Radius";
                break;
            case 2:
                str = "N/A";
                break;
            case 3:
                str = "Edges";
                break;
            case 4:
                str = "N/A";
                break;
            case 5:
                str = "N/A";
                break;
            default:
                break;
        }
        return str;
    }
    render() {
        return React.createElement(
            React.Fragment,
            null,
            React.createElement(
                "tr",
                null,
                React.createElement(
                    "td",
                    null,
                    " \xA0\xA0\xA0Shape ",
                    this.state.line + 1
                ),
                React.createElement(
                    "td",
                    null,
                    "Left",
                    React.createElement("br", null),
                    React.createElement("input", { style: txtbxStyle, value: this.data.x, onChange: e => this.xChange(e) })
                ),
                React.createElement(
                    "td",
                    null,
                    "Top",
                    React.createElement("br", null),
                    React.createElement("input", { style: txtbxStyle, value: this.data.y, onChange: e => this.yChange(e) })
                ),
                React.createElement(
                    "td",
                    null,
                    this.getWLabel(arShapeType[this.state.line]),
                    React.createElement("br", null),
                    React.createElement("input", { style: txtbxStyle, value: this.data.w, onChange: e => this.widthChange(e) })
                ),
                React.createElement(
                    "td",
                    null,
                    this.getHLabel(arShapeType[this.state.line]),
                    React.createElement("br", null),
                    React.createElement("input", { style: txtbxStyle, value: this.data.h, onChange: e => this.heightChange(e) })
                ),
                React.createElement(
                    "td",
                    null,
                    this.getRLabel(arShapeType[this.state.line]),
                    React.createElement("br", null),
                    React.createElement("input", { style: txtbxStyle, value: this.data.r, onChange: e => this.radiusChange(e) })
                )
            )
        );
    }
}

class SizeSymbol extends React.Component {
    constructor(props) {
        super(props);
        this.state = { line: props.line, changed: false };
        this.data = props.data;
        this.updateParent = props.callback;
    }
    updateData() {
        if (this.updateParent) {
            this.updateParent(this.state.line, this.data);
        }
    }
    heightChange(e) {
        this.data.height = e.target.value;
        this.updateData();
        this.setState({ changed: !this.state.changed });
    }
    topChange(e) {
        this.data.top = e.target.value;
        this.updateData();
        this.setState({ changed: !this.state.changed });
    }
    centerVertChange(e) {
        this.data.centerVert = e.target.checked;
        this.updateData();
        this.setState({ changed: !this.state.changed });
    }
    leftChange(e) {
        this.data.left = e.target.value;
        this.updateData();
        this.setState({ changed: !this.state.changed });
    }
    centerHorChange(e) {
        this.data.centerHor = e.target.checked;
        this.updateData();
        this.setState({ changed: !this.state.changed });
    }

    render() {
        return React.createElement(
            React.Fragment,
            null,
            React.createElement(
                "tr",
                null,
                React.createElement(
                    "td",
                    null,
                    " \xA0\xA0\xA0Line ",
                    this.state.line + 1
                ),
                React.createElement(
                    "td",
                    null,
                    "Height",
                    React.createElement("br", null),
                    React.createElement("input", { style: txtbxStyle, value: this.data.height, onChange: e => this.heightChange(e) })
                ),
                React.createElement(
                    "td",
                    null,
                    "Top",
                    React.createElement("br", null),
                    React.createElement("input", { style: txtbxStyle, value: this.data.top, onChange: e => this.topChange(e) })
                ),
                React.createElement(
                    "td",
                    null,
                    "Center Vertical",
                    React.createElement("br", null),
                    React.createElement("input", { type: "checkbox", value: this.data.centerVert, onChange: e => this.centerVertChange(e) })
                ),
                React.createElement(
                    "td",
                    null,
                    "Left",
                    React.createElement("br", null),
                    React.createElement("input", { style: txtbxStyle, value: this.data.left, onChange: e => this.leftChange(e) })
                ),
                React.createElement(
                    "td",
                    null,
                    "Center Horizontal",
                    React.createElement("br", null),
                    React.createElement("input", { type: "checkbox", value: this.data.centerHor, onChange: e => this.centerHorChange(e) })
                )
            )
        );
    }
}

class VariableElement extends React.Component {
    constructor(props) {
        super(props);
        this.state = { type: props.type, line: props.line, changed: false };
        this.data = props.data;
        this.updateParent = props.callback;
    }

    refresh(data) {
        this.setState({ changed: !this.state.changed });
        this.data = data;
    }

    updateData() {
        if (this.updateParent != null) {
            this.updateParent(this.state.type, this.state.line, this.data);
        }
    }

    onChildChanged(line, data) {
        this.data[line] = data;
        this.updateData();
    }

    render() {
        var arRows = [];
        var label = "Dividers";
        for (var i = 0; i < this.data.length; i++) {
            switch (Number(this.state.type)) {
                case 0:
                    arRows.push(React.createElement(SizeDivider, { key: "sdiv_" + i, data: this.data[i], line: i, callback: this.onChildChanged.bind(this) }));
                    break;
                case 1:
                    label = "Lines";
                    arRows.push(React.createElement(SizeText, { key: 'stext_' + i, line: i, data: this.data[i], callback: this.onChildChanged.bind(this) }));
                    break;
                case 2:
                    label = "Shapes";
                    arRows.push(React.createElement(SizeShape, { key: 'sshape_' + i, line: i, data: this.data[i], callback: this.onChildChanged.bind(this) }));
                    break;
                case 3:
                    label = "Symbols";
                    arRows.push(React.createElement(SizeSymbol, { key: 'ssymbol_' + i, line: i, data: this.data[i], callback: this.onChildChanged.bind(this) }));
                    break;
            }
        }
        return React.createElement(
            "div",
            null,
            React.createElement(
                "b",
                null,
                label
            ),
            React.createElement(
                "table",
                null,
                React.createElement(
                    "tbody",
                    null,
                    arRows
                )
            )
        );
    }
}
var gearSvg = '<svg class="lds-gears" width="80px"  height="80px"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><g transform="translate(50 50)"> <g transform="translate(-19 -19) scale(0.6)"> <g transform="rotate(90)"><animateTransform attributeName="transform" type="rotate" values="0;360" keyTimes="0;1" dur="2s" begin="0s" repeatCount="indefinite"></animateTransform><path d="M37.3496987939662 -7 L47.3496987939662 -7 L47.3496987939662 7 L37.3496987939662 7 A38 38 0 0 1 31.359972760794346 21.46047782418268 L31.359972760794346 21.46047782418268 L38.431040572659825 28.531545636048154 L28.531545636048154 38.431040572659825 L21.46047782418268 31.359972760794346 A38 38 0 0 1 7.0000000000000036 37.3496987939662 L7.0000000000000036 37.3496987939662 L7.000000000000004 47.3496987939662 L-6.999999999999999 47.3496987939662 L-7 37.3496987939662 A38 38 0 0 1 -21.46047782418268 31.35997276079435 L-21.46047782418268 31.35997276079435 L-28.531545636048154 38.431040572659825 L-38.43104057265982 28.531545636048158 L-31.359972760794346 21.460477824182682 A38 38 0 0 1 -37.3496987939662 7.000000000000007 L-37.3496987939662 7.000000000000007 L-47.3496987939662 7.000000000000008 L-47.3496987939662 -6.9999999999999964 L-37.3496987939662 -6.999999999999997 A38 38 0 0 1 -31.35997276079435 -21.460477824182675 L-31.35997276079435 -21.460477824182675 L-38.431040572659825 -28.531545636048147 L-28.53154563604818 -38.4310405726598 L-21.4604778241827 -31.35997276079433 A38 38 0 0 1 -6.999999999999992 -37.3496987939662 L-6.999999999999992 -37.3496987939662 L-6.999999999999994 -47.3496987939662 L6.999999999999977 -47.3496987939662 L6.999999999999979 -37.3496987939662 A38 38 0 0 1 21.460477824182686 -31.359972760794342 L21.460477824182686 -31.359972760794342 L28.531545636048158 -38.43104057265982 L38.4310405726598 -28.53154563604818 L31.35997276079433 -21.4604778241827 A38 38 0 0 1 37.3496987939662 -6.999999999999995 M0 -23A23 23 0 1 0 0 23 A23 23 0 1 0 0 -23" fill="#0040FF"></path></g></g> <g transform="translate(19 19) scale(0.6)"> <g transform="rotate(247.5)"><animateTransform attributeName="transform" type="rotate" values="360;0" keyTimes="0;1" dur="2s" begin="-0.125s" repeatCount="indefinite"></animateTransform><path d="M37.3496987939662 -7 L47.3496987939662 -7 L47.3496987939662 7 L37.3496987939662 7 A38 38 0 0 1 31.359972760794346 21.46047782418268 L31.359972760794346 21.46047782418268 L38.431040572659825 28.531545636048154 L28.531545636048154 38.431040572659825 L21.46047782418268 31.359972760794346 A38 38 0 0 1 7.0000000000000036 37.3496987939662 L7.0000000000000036 37.3496987939662 L7.000000000000004 47.3496987939662 L-6.999999999999999 47.3496987939662 L-7 37.3496987939662 A38 38 0 0 1 -21.46047782418268 31.35997276079435 L-21.46047782418268 31.35997276079435 L-28.531545636048154 38.431040572659825 L-38.43104057265982 28.531545636048158 L-31.359972760794346 21.460477824182682 A38 38 0 0 1 -37.3496987939662 7.000000000000007 L-37.3496987939662 7.000000000000007 L-47.3496987939662 7.000000000000008 L-47.3496987939662 -6.9999999999999964 L-37.3496987939662 -6.999999999999997 A38 38 0 0 1 -31.35997276079435 -21.460477824182675 L-31.35997276079435 -21.460477824182675 L-38.431040572659825 -28.531545636048147 L-28.53154563604818 -38.4310405726598 L-21.4604778241827 -31.35997276079433 A38 38 0 0 1 -6.999999999999992 -37.3496987939662 L-6.999999999999992 -37.3496987939662 L-6.999999999999994 -47.3496987939662 L6.999999999999977 -47.3496987939662 L6.999999999999979 -37.3496987939662 A38 38 0 0 1 21.460477824182686 -31.359972760794342 L21.460477824182686 -31.359972760794342 L28.531545636048158 -38.43104057265982 L38.4310405726598 -28.53154563604818 L31.35997276079433 -21.4604778241827 A38 38 0 0 1 37.3496987939662 -6.999999999999995 M0 -23A23 23 0 1 0 0 23 A23 23 0 1 0 0 -23" fill="#FF00FF"></path></g></g></g></svg>';
class SignPreview extends React.Component {
    constructor(props) {
        super(props);
        this.state = { sizeIdx: props.index, changed: false };
        this.preview = gearSvg;
        //this.update(props.signinfo);
    }

    update(signinfo) {
        var url = urlRoot + "svgPreview?sizeIdx=" + this.state.sizeIdx + "&autosign=" + JSON.stringify(signinfo);
        fetch(url).then(resp => resp.text()).then(text => {
            this.preview = text;
            this.setState({ changed: !this.state.changed });
        });
    }
    render() {
        var style = { height: '300px' };
        return React.createElement("div", { style: style, dangerouslySetInnerHTML: { __html: this.preview } });
    }
}

class SignSizes extends React.Component {
    constructor(props) {
        super(props);
        this.state = { maxItems: props.maxItems, curCount: props.baseInfo.sizes.length, changed: false, data: props.baseInfo };
        this.signPart = 4;
        this.label = props.label;
        this.updateParent = props.callback;
        this.baseInfo = props.baseInfo;
        this.data = [];
        this.id = props.id;
        if ('sizes' in props.baseInfo) {
            this.data = this.baseInfo.sizes;
        } else {
            this.data = [];
        }
        this.childRefs = [];
        this.curRef = 0;
        this.syncWithBaseInfo();
        this.previewRefs = [];

        //this.divStyle = {position:'fixed',left:'500px',top:'20px',height:'700px',width:'600px',radius:'-1',overflow:'auto'};
        this.divStyle = { position: 'fixed', height: '600px', width: '600px', radius: '-1', overflow: 'auto' };
    }
    updatePreview(idx) {
        this.baseInfo.sizes = this.data;
        if (idx == -1) {
            for (var i in this.previewRefs) {
                if (this.previewRefs[i].current != null) {
                    this.previewRefs[i].current.update(this.baseInfo);
                }
            }
        } else if (idx >= 0 && idx < this.data.length - 1) {
            this.previewRefs[idx].current.update(this.baseInfo);
        }
    }
    updateSizes(info) {
        this.baseInfo = info;
        this.syncWithBaseInfo();
        this.setState({ baseInfo: info, curCount: this.baseInfo.sizes.length });
        var updtPrev = false;
        for (var i in this.childRefs) {
            var idx = this.childRefs[i].line;
            if (this.childRefs[i].ref.current == null) {
                continue;
            }
            switch (this.childRefs[i].type) {
                case 0:
                    this.childRefs[i].ref.current.refresh(this.data[idx].dividers);
                    break;
                case 1:
                    this.childRefs[i].ref.current.refresh(this.data[idx].lines);
                    break;
                case 2:
                    this.childRefs[i].ref.current.refresh(this.data[idx].shapes);
                    break;
                case 3:
                    this.childRefs[i].ref.current.refresh(this.data[idx].sym);
                    break;
            }
            updtPrev = true;
        }
        if (updtPrev) {
            this.updatePreview(-1);
        }
        this.updateData(); // filter up
    }

    updateData() {
        if (this.updateParent != null) {
            this.updateParent(this.signPart, this.data);
        }
    }
    varElemCallback(type, line, data) {
        switch (type) {
            case 0:
                this.data[line].dividers = data;
                break;
            case 1:
                this.data[line].lines = data;
                break;
            case 2:
                this.data[line].shapes = data;
                break;
            case 3:
                this.data[line].sym = data;
                break;
        }
        this.updateData();
        this.updatePreview(line);
    }
    syncWithBaseInfo() {

        for (var sz = 0; sz < this.state.curCount; sz++) {
            if (sz < this.baseInfo.sizes.length) {
                this.data[sz] = this.baseInfo.sizes[sz];
                if ('dividers' in this.baseInfo.sizes[sz]) {
                    this.data[sz].dividers = this.baseInfo.sizes[sz].dividers;
                } else {
                    this.data[sz].dividers = [];
                }
                for (var i = 0; i < this.baseInfo.dividers.length; i++) {
                    if ('dividers' in this.baseInfo.sizes[sz] && i < this.baseInfo.sizes[sz].dividers.length) {
                        this.data[sz].dividers[i] = this.baseInfo.sizes[sz].dividers[i];
                    } else {
                        this.data[sz].dividers[i] = getDefaultSizeObject(0);
                    }
                }
                if ('lines' in this.baseInfo.sizes[sz]) {
                    this.data[sz].lines = this.baseInfo.sizes[sz].lines;
                } else {
                    this.data[sz].lines = [];
                }
                for (var i = 0; i < this.baseInfo.lines.length; i++) {
                    if ('lines' in this.baseInfo.sizes[sz] && i < this.baseInfo.sizes[sz].lines.length) {
                        this.data[sz].lines[i] = this.baseInfo.sizes[sz].lines[i];
                    } else {
                        this.data[sz].lines[i] = getDefaultSizeObject(1);
                    }
                }
                if ('shapes' in this.baseInfo.sizes[sz]) {
                    this.data[sz].shapes = this.baseInfo.sizes[sz].shapes;
                } else {
                    this.data[sz].shapes = [];
                }
                for (var i = 0; i < this.baseInfo.shapes.length; i++) {
                    arShapeType[i] = Number(this.baseInfo.shapes[i].shape); // UI only, ensure it is in sync
                    if ('shapes' in this.baseInfo.sizes[sz] && i < this.baseInfo.sizes[sz].shapes.length) {
                        this.data[sz].shapes[i] = this.baseInfo.sizes[sz].shapes[i];
                    } else {
                        this.data[sz].shapes[i] = getDefaultSizeObject(2);
                    }
                }
                if ('sym' in this.baseInfo.sizes[sz]) {
                    this.data[sz].sym = this.baseInfo.sizes[sz].sym;
                } else {
                    this.data[sz].sym = [];
                }
                for (var i = 0; i < this.baseInfo.symbols.length; i++) {
                    if ('sym' in this.baseInfo.sizes[sz] && i < this.baseInfo.sizes[sz].sym.length) {
                        this.data[sz].sym[i] = this.baseInfo.sizes[sz].sym[i];
                    } else {
                        this.data[sz].sym[i] = getDefaultSizeObject(3);
                    }
                }
            } else {
                this.data[sz] = this.defaultObject();
                for (var i = 0; i < this.baseInfo.dividers.length; i++) {
                    this.data[sz].dividers[i] = getDefaultSizeObject(0);
                }
                for (var i = 0; i < this.baseInfo.lines.length; i++) {
                    this.data[sz].lines[i] = getDefaultSizeObject(1);
                }
                for (var i = 0; i < this.baseInfo.shapes.length; i++) {
                    this.data[sz].shapes[i] = getDefaultSizeObject(2);
                }
                for (var i = 0; i < this.baseInfo.symbols.length; i++) {
                    this.data[sz].sym[i] = getDefaultSizeObject(3);
                }
            }
        }
    }

    defaultObject() {
        var obj = { width: 12, height: 12, font: 2, fontSize: 2, lineSpace: -1, inset: -1, border: -1, rad: -1, innerRad: -1, lines: [], dividers: [], sym: [], shapes: [] };
        return obj;
    }

    onChangeWidth(e, line) {
        this.data[line].width = e.target.value;
        this.updateData();
        this.setState({ changed: !this.state.changed });
        this.updatePreview(line);
    }
    onChangeHeight(e, line) {
        this.data[line].height = e.target.value;
        this.updateData();
        this.setState({ changed: !this.state.changed });
        this.updatePreview(line);
    }
    onChangeRadius(e, line) {
        this.data[line].rad = e.target.value;
        this.updateData();
        this.setState({ changed: !this.state.changed });
        this.updatePreview(line);
    }
    onChangeInnerRad(e, line) {
        this.data[line].innerRad = e.target.value;
        this.updateData();
        this.setState({ changed: !this.state.changed });
        this.updatePreview(line);
    }
    onChangeInset(e, line) {
        this.data[line].inset = e.target.value;
        this.updateData();
        this.setState({ changed: !this.state.changed });
        this.updatePreview(line);
    }
    onChangeBorderW(e, line) {
        this.data[line].border = e.target.value;
        this.updateData();
        this.setState({ changed: !this.state.changed });
        this.updatePreview(line);
    }
    onChangeLineSpace(e, line) {
        this.data[line].lineSpace = e.target.value;
        this.updateData();
        this.setState({ changed: !this.state.changed });
        this.updatePreview(line);
    }
    onChangeTextSize(e, line) {
        this.data[line].fontSize = e.target.value;
        this.updateData();
        this.setState({ changed: !this.state.changed });
        this.updatePreview(line);
    }
    onChangeFont(e, line) {
        this.data[line].font = e.target.value;
        this.updateData();
        this.setState({ changed: !this.state.changed });
        this.updatePreview(line);
    }

    generateSize(line) {
        this.syncWithBaseInfo();
        var divStyle = { border: '1px solid' };
        var arSpecs = [];
        if ("dividers" in this.data[line] && this.data[line].dividers.length > 0) {
            this.childRefs[this.curRef] = {};
            this.childRefs[this.curRef].type = 0;
            this.childRefs[this.curRef].line = line;
            this.childRefs[this.curRef].ref = React.createRef();
            arSpecs.push(React.createElement(VariableElement, { ref: this.childRefs[this.curRef].ref, key: "div_" + line, line: line, type: 0, data: this.data[line].dividers, callback: this.varElemCallback.bind(this) }));
            this.curRef++;
        }
        if ("lines" in this.data[line] && this.data[line].lines.length > 0) {
            this.childRefs[this.curRef] = {};
            this.childRefs[this.curRef].type = 1;
            this.childRefs[this.curRef].line = line;
            this.childRefs[this.curRef].ref = React.createRef();
            arSpecs.push(React.createElement(VariableElement, { ref: this.childRefs[this.curRef].ref, key: "ln_" + line, line: line, type: 1, data: this.data[line].lines, callback: this.varElemCallback.bind(this) }));
            this.curRef++;
        }
        if ("shapes" in this.data[line] && this.data[line].shapes.length > 0) {
            this.childRefs[this.curRef] = {};
            this.childRefs[this.curRef].type = 2;
            this.childRefs[this.curRef].line = line;
            this.childRefs[this.curRef].ref = React.createRef();
            arSpecs.push(React.createElement(VariableElement, { ref: this.childRefs[this.curRef].ref, key: "shp_" + line, line: line, type: 2, data: this.data[line].shapes, callback: this.varElemCallback.bind(this) }));
            this.curRef++;
        }
        if ("sym" in this.data[line] && this.data[line].sym.length > 0) {
            this.childRefs[this.curRef] = {};
            this.childRefs[this.curRef].type = 3;
            this.childRefs[this.curRef].line = line;
            this.childRefs[this.curRef].ref = React.createRef();
            arSpecs.push(React.createElement(VariableElement, { ref: this.childRefs[this.curRef].ref, key: "sym_" + line, line: line, type: 3, data: this.data[line].sym, callback: this.varElemCallback.bind(this) }));
            this.curRef++;
        }
        this.previewRefs[line] = React.createRef();
        return React.createElement(
            "div",
            { key: "Size_" + line, style: divStyle },
            React.createElement(
                "b",
                null,
                "Size: " + String(this.data[line].width) + " x " + String(this.data[line].height)
            ),
            React.createElement(SignPreview, { ref: this.previewRefs[line], index: line }),
            React.createElement(
                "table",
                null,
                React.createElement(
                    "tbody",
                    null,
                    React.createElement(
                        "tr",
                        null,
                        React.createElement(
                            "td",
                            null,
                            "Width",
                            React.createElement("br", null),
                            React.createElement("input", { onChange: e => this.onChangeWidth(e, line), style: txtbxStyle, value: this.data[line].width })
                        ),
                        React.createElement(
                            "td",
                            null,
                            "Height",
                            React.createElement("br", null),
                            React.createElement("input", { onChange: e => this.onChangeHeight(e, line), style: txtbxStyle, value: this.data[line].height })
                        ),
                        React.createElement(
                            "td",
                            null,
                            "Radius",
                            React.createElement("br", null),
                            React.createElement("input", { onChange: e => this.onChangeRadius(e, line), style: txtbxStyle, value: this.data[line].rad })
                        ),
                        React.createElement(
                            "td",
                            null,
                            "Inner Radius",
                            React.createElement("br", null),
                            React.createElement("input", { onChange: e => this.onChangeInnerRad(e, line), style: txtbxStyle, value: this.data[line].innerRad })
                        ),
                        React.createElement(
                            "td",
                            null,
                            "Inset",
                            React.createElement("br", null),
                            React.createElement("input", { onChange: e => this.onChangeInset(e, line), style: txtbxStyle, value: this.data[line].inset })
                        )
                    ),
                    React.createElement(
                        "tr",
                        null,
                        React.createElement(
                            "td",
                            null,
                            "Border Width",
                            React.createElement("br", null),
                            React.createElement("input", { onChange: e => this.onChangeBorderW(e, line), style: txtbxStyle, value: this.data[line].border })
                        ),
                        React.createElement(
                            "td",
                            null,
                            "Line Spacing",
                            React.createElement("br", null),
                            React.createElement("input", { onChange: e => this.onChangeLineSpace(e, line), style: txtbxStyle, value: this.data[line].lineSpace })
                        ),
                        React.createElement(
                            "td",
                            null,
                            "Text Size",
                            React.createElement("br", null),
                            React.createElement("input", { onChange: e => this.onChangeTextSize(e, line), style: txtbxStyle, value: this.data[line].fontSize })
                        ),
                        React.createElement(
                            "td",
                            { colSpan: "2" },
                            "Default Text Type",
                            React.createElement("br", null),
                            React.createElement(
                                "select",
                                { onChange: e => this.onChangeFont(e, line), value: this.data[line].font },
                                optionLists.fonts.map(itm => React.createElement(
                                    "option",
                                    { key: line + String(itm.id), value: itm.id },
                                    itm.name
                                ))
                            )
                        )
                    )
                )
            ),
            arSpecs
        );
    }

    handleChange(e) {
        var tmp = this.data;
        this.data = [];
        for (var i = 0; i < Number(e.target.value); i++) {
            if (i < tmp.length - 1) {
                this.data[i] = tmp[i];
            } else {
                this.data[i] = this.defaultObject();
            }
        }
        this.setState({ curCount: e.target.value });
    }

    render() {
        var arOptions = [];
        var arSizes = [];
        this.curRef = 0;
        for (var i = 0; i < this.state.maxItems; i++) {
            arOptions.push(React.createElement(
                "option",
                { key: "Sizes" + String(this.state.signPart) + "_" + String(i), value: i },
                " ",
                i,
                " "
            ));
            if (i < this.state.curCount) {
                arSizes.push(this.generateSize(i));
            }
        }
        return React.createElement(
            "div",
            { style: this.divStyle },
            React.createElement(
                "h3",
                null,
                this.label,
                " \xA0",
                React.createElement(
                    "select",
                    { onChange: this.handleChange.bind(this), value: this.state.curCount },
                    arOptions
                )
            ),
            arSizes
        );
    }
}

//function SignAppCombo(id, type)
function SignAppCombo(props) //type, id, def, callback)
{
    let arItems = [];
    switch (props.type) {
        case "color":
            arItems = optionLists.signColors;
            break;
        case "shape":
            arItems = optionLists.signShapes;
            break;
        case "border":
            arItems = optionLists.borderType;
            break;
        default:
            return null;
            break;
    }
    return React.createElement(
        "select",
        { id: props.id, value: props.def, onChange: e => props.callback(e, props.id) },
        arItems.map(itm => React.createElement(
            "option",
            { key: props.id + String(itm.id), value: itm.id },
            itm.name
        ))
    );
}

class SignListCombo extends React.Component {
    constructor(props) {
        super(props);
        this.state = { changed: false, curSel: props.selected };
        this.action = props.action;
    }
    onSelChange(e) {
        this.setState({ curSel: e.target.value });
        if (this.action != null) {
            this.action(e);
        }
    }
    refresh() {
        this.setState({ changed: !this.state.changed });
    }
    render() {
        return React.createElement(
            "select",
            { value: this.props.selected, onChange: e => this.action(e.target.value) },
            optionLists.signList.map(itm => React.createElement(
                "option",
                { key: "sign" + String(itm.id), value: itm.id },
                itm.name
            ))
        );
    }
}

class AutoSignApp extends React.Component {
    constructor(props) {
        super(props);
        this.dividersRef = React.createRef();
        this.linesRef = React.createRef();
        this.shapesRef = React.createRef();
        this.symbolsRef = React.createRef();
        this.sizeItemsRef = React.createRef();
        this.signComboRef = React.createRef();
        this.resetAutosign();
        this.state = { changed: false, signId: 0, updateSignList: false };
    }

    resetAutosign() {
        this.autosign = {};
        this.autosign.id = 0;
        this.autosign.name = "";
        this.autosign.borderType = 1;
        this.autosign.shape = 1;
        this.autosign.fieldColor = 1;
        this.autosign.textColor = 2;
        // divider lines
        this.autosign.dividers = [];
        // text lines
        this.autosign.lines = [];
        // shapes
        this.autosign.shapes = [];
        // symbols
        this.autosign.symbols = [];
        // sizes
        this.autosign.sizes = [];
    }

    comboChange(e, id) {
        if (id == "fieldColor") {
            this.autosign.fieldColor = e.target.value;
        } else if (id == "textColor") {
            this.autosign.textColor = e.target.value;
        } else if (id == "signShape") {
            this.autosign.shape = e.target.value;
        } else if (id == "borderStyle") {
            this.autosign.borderType = e.target.value;
        }
        this.sizeItemsRef.current.updateSizes(this.autosign);
        // if(this.sizeItemsRef.current != null){
        //     this.sizeItemsRef.current.updateSizes(this.autosign);
        // }
        this.setState({ changed: !this.state.changed });
    }

    multiCallback(signPart, data) {
        switch (Number(signPart)) {
            case 0:
                this.autosign.dividers = data;
                //this.setState({changed:!this.state.changed});
                break;
            case 1:
                this.autosign.lines = data;
                break;
            case 2:
                this.autosign.shapes = data;
                // for(var i = 0; i < this.autosign.sizes.length;i++)
                // {
                //     for(var shp = 0; shp < this.autosign.shapes.length;shp++)
                //     {
                //         this.autosign.sizes[i].shapes[shp].shape = this.autosign.shapes[shp].shape;
                //     }
                // }
                break;
            case 3:
                this.autosign.symbols = data;
                break;
            case 4:
                this.autosign.sizes = data;
                break;
        }
        //this.setState({changed:!this.state.changed});
        if (signPart != 4) {
            this.sizeItemsRef.current.updateSizes(this.autosign);
        }
        //alert(JSON.stringify(this.autosign));
    }

    onChangeName(e) {
        this.autosign.name = e.target.value;
        this.setState({ changed: !this.state.changed });
    }

    onLoadSign(id) {
        this.currentId = id;
        if (this.currentId > 0) {
            var url = urlRoot + "loadSign?id=" + id;
            fetch(url).then(resp => resp.json()).then(json => {
                this.autosign = json;
                this.autosign.id = this.currentId;
                //alert(JSON.stringify(json));
                this.setState({ signId: this.autosign.id });
                this.updateControls();
            }).catch(error => console.log(error));
        } else {
            this.resetAutosign();
            this.updateControls();
            this.setState({ signId: 0 });
        }
    }
    updateControls() {
        if (this.dividersRef.current != null) {
            this.dividersRef.current.update(this.autosign.dividers);
        }
        if (this.linesRef.current != null) {
            this.linesRef.current.update(this.autosign.lines);
        }
        if (this.shapesRef.current != null) {
            this.shapesRef.current.update(this.autosign.shapes);
        }
        if (this.symbolsRef.current != null) {
            this.symbolsRef.current.update(this.autosign.symbols);
        }
        if (this.sizeItemsRef.current != null) {
            this.sizeItemsRef.current.updateSizes(this.autosign);
        }
    }

    onSaveSign(e) {
        var url = urlRoot + "saveSign";
        fetch(url, { method: 'POST', body: JSON.stringify(this.autosign)
        }).then(resp => resp.text()).then(text => {
            var id = Number(text);
            if (id <= 0) {
                alert("Failed to save sign.");
            } else {
                if (this.autosign.id != id) {
                    // update sign list
                    var url = urlRoot + "signList";
                    fetch(url).then(resp => resp.json()).then(json => {
                        optionLists.signList = json;
                        this.autosign.id = id;
                        this.setState({ signId: id });
                        this.signComboRef.current.refresh();
                    }).catch(error => console.log(error));
                }

                alert("Sign Saved.");
            }
            this.setState({ changed: !this.state.changed, updateSignList: !this.state.updateSignList });
        });
    }

    onEstimate(e) {
        if (Estimate(this.autosign)) {
            this.updateControls();
        }
    }

    render() {
        return React.createElement(
            "div",
            null,
            React.createElement(
                "h1",
                null,
                "MUTCD Sign Builder"
            ),
            "Select: ",
            React.createElement(SignListCombo, { ref: this.signComboRef, selected: this.autosign.id, action: this.onLoadSign.bind(this) }),
            React.createElement(
                "table",
                null,
                React.createElement(
                    "tbody",
                    null,
                    React.createElement(
                        "tr",
                        null,
                        React.createElement(
                            "td",
                            null,
                            React.createElement(
                                "table",
                                null,
                                React.createElement(
                                    "tbody",
                                    null,
                                    React.createElement(
                                        "tr",
                                        null,
                                        React.createElement(
                                            "td",
                                            null,
                                            "Sign Name"
                                        ),
                                        React.createElement(
                                            "td",
                                            null,
                                            "Sign Shape"
                                        ),
                                        React.createElement(
                                            "td",
                                            null,
                                            "Border Style"
                                        )
                                    ),
                                    React.createElement(
                                        "tr",
                                        null,
                                        React.createElement(
                                            "td",
                                            null,
                                            React.createElement("input", { placeholder: "Sign Name", value: this.autosign.name, onChange: e => this.onChangeName(e) })
                                        ),
                                        React.createElement(
                                            "td",
                                            null,
                                            React.createElement(
                                                "select",
                                                { value: this.autosign.shape, onChange: e => this.comboChange(e, "signShape") },
                                                optionLists.signShapes.map(itm => React.createElement(
                                                    "option",
                                                    { key: "signShape" + String(itm.id), value: itm.id },
                                                    itm.name
                                                ))
                                            )
                                        ),
                                        React.createElement(
                                            "td",
                                            null,
                                            React.createElement(
                                                "select",
                                                { value: this.autosign.borderType, onChange: e => this.comboChange(e, "borderStyle") },
                                                optionLists.borderType.map(itm => React.createElement(
                                                    "option",
                                                    { key: "borderStyle" + String(itm.id), value: itm.id },
                                                    itm.name
                                                ))
                                            )
                                        )
                                    ),
                                    React.createElement(
                                        "tr",
                                        null,
                                        React.createElement(
                                            "td",
                                            null,
                                            "Field Color"
                                        ),
                                        React.createElement(
                                            "td",
                                            null,
                                            "Text Color"
                                        ),
                                        React.createElement("td", null)
                                    ),
                                    React.createElement(
                                        "tr",
                                        null,
                                        React.createElement(
                                            "td",
                                            null,
                                            React.createElement(
                                                "select",
                                                { value: this.autosign.fieldColor, onChange: e => this.comboChange(e, "fieldColor") },
                                                optionLists.signColors.map(itm => React.createElement(
                                                    "option",
                                                    { key: "fieldColor" + String(itm.id), value: itm.id },
                                                    itm.name
                                                ))
                                            )
                                        ),
                                        React.createElement(
                                            "td",
                                            null,
                                            React.createElement(
                                                "select",
                                                { value: this.autosign.textColor, onChange: e => this.comboChange(e, "textColor") },
                                                optionLists.signColors.map(itm => React.createElement(
                                                    "option",
                                                    { key: "textColor" + String(itm.id), value: itm.id },
                                                    itm.name
                                                ))
                                            )
                                        ),
                                        React.createElement(
                                            "td",
                                            null,
                                            React.createElement(
                                                "button",
                                                { onClick: e => this.onSaveSign(e) },
                                                "Save"
                                            )
                                        )
                                    )
                                )
                            ),
                            "Set the width and height of all sizes, build the first sign ",
                            React.createElement("br", null),
                            "then click ",
                            React.createElement(
                                "button",
                                { onClick: e => this.onEstimate(e) },
                                "HERE"
                            ),
                            " to auto-calculate the remaining signs.",
                            React.createElement("br", null),
                            "Only minor tweaking should be needed after that.",
                            React.createElement(MultiCtrl, { ref: this.dividersRef, curItem: this.autosign.dividers.length, maxItems: "6", label: "Divider Lines", signPart: "0", callback: this.multiCallback.bind(this) }),
                            React.createElement(MultiCtrl, { ref: this.linesRef, curItem: this.autosign.lines.length, maxItems: "11", label: "Text Lines", signPart: "1", callback: this.multiCallback.bind(this) }),
                            React.createElement(MultiCtrl, { ref: this.shapesRef, curItem: this.autosign.shapes.length, maxItems: "6", label: "Shapes", signPart: "2", callback: this.multiCallback.bind(this) }),
                            React.createElement(MultiCtrl, { ref: this.symbolsRef, curItem: this.autosign.symbols.length, maxItems: "6", label: "Symbols", signPart: "3", callback: this.multiCallback.bind(this) })
                        ),
                        React.createElement(
                            "td",
                            { valign: "top" },
                            React.createElement(SignSizes, { ref: this.sizeItemsRef, baseInfo: this.autosign, maxItems: "11", label: "Sizes", callback: this.multiCallback.bind(this) })
                        )
                    )
                )
            )
        );
    }
}

// estimates sign position, sizes, etc. based on the layout of the first sign
function Estimate(autosign) {
    if (autosign.sizes.length <= 1) {
        return false;
    }
    var baseWidth = Number(autosign.sizes[0].width);
    var baseHeight = Number(autosign.sizes[0].height);
    var baseTextSize = Number(autosign.sizes[0].fontSize);
    for (var i = 1; i < autosign.sizes.length; i++) {
        var width = Number(autosign.sizes[i].width);
        var height = Number(autosign.sizes[i].height);
        var scaleW = width / baseWidth;
        var scaleH = height / baseHeight;
        var generalScale = scaleW > scaleH ? scaleH : scaleW;
        autosign.sizes[i].fontSize = baseTextSize * scaleH;

        autosign.sizes[i].font = autosign.sizes[0].font;
        autosign.sizes[i].inset = Number(autosign.sizes[0].inset);
        if (autosign.sizes[i].inset > 0) {
            autosign.sizes[i].inset *= generalScale;
        }
        autosign.sizes[i].border = Number(autosign.sizes[0].border);
        if (Number(autosign.sizes[i].border) > 0) {
            autosign.sizes[i].border *= generalScale;
        }
        autosign.sizes[i].innerRad = Number(autosign.sizes[0].innerRad);
        if (Number(autosign.sizes[i].innerRad) > 0) {
            autosign.sizes[i].innerRad = autosign.sizes[0].innerRad * generalScale;
        }
        autosign.sizes[i].lineSpace = Number(autosign.sizes[0].lineSpace);
        if (Number(autosign.sizes[0].lineSpace) > 0) {
            autosign.sizes[i].lineSpace *= scaleH;
        }

        for (var idx = 0; idx < Number(autosign.sizes[0].dividers.length); idx++) {
            autosign.sizes[i].dividers[idx].pos = Number(autosign.sizes[0].dividers[idx].pos) * (autosign.dividers[idx].type == 1 ? scaleW : scaleH);
            autosign.sizes[i].dividers[idx].w = Number(autosign.sizes[0].dividers[idx].w) * generalScale;
        }

        for (var idx = 0; idx < Number(autosign.lines.length); idx++) {
            autosign.sizes[i].lines[idx].top = Number(autosign.sizes[0].lines[idx].top);
            if (autosign.sizes[i].lines[idx].top > 0) {
                autosign.sizes[i].lines[idx].top *= scaleH;
            }
            autosign.sizes[i].lines[idx].left = Number(autosign.sizes[0].lines[idx].left);
            if (autosign.sizes[i].lines[idx].left > 0) {
                autosign.sizes[i].lines[idx].left *= scaleW;
            }
            autosign.sizes[i].lines[idx].spacing = Number(autosign.sizes[0].lines[idx].spacing);
            autosign.sizes[i].lines[idx].fontSizeOverride = Number(autosign.sizes[0].lines[idx].fontSizeOverride);
            if (autosign.sizes[i].lines[idx].fontSizeOverride > 0) {
                autosign.sizes[i].lines[idx].fontSizeOverride *= scaleH;
            }
            autosign.sizes[i].lines[idx].fontOverride = autosign.sizes[0].lines[idx].fontOverride;
        }

        for (var idx = 0; idx < Number(autosign.sizes[0].sym.length); idx++) {
            autosign.sizes[i].sym[idx].height = Number(autosign.sizes[0].sym[idx].height);
            if (autosign.sizes[i].sym[idx].height > 0) {
                autosign.sizes[i].sym[idx].height *= scaleH;
            }
            autosign.sizes[i].sym[idx].top = Number(autosign.sizes[0].sym[idx].top);
            if (autosign.sizes[i].sym[idx].top > 0) {
                autosign.sizes[i].sym[idx].top *= scaleH;
            }
            autosign.sizes[i].sym[idx].left = autosign.sizes[0].sym[idx].left;
            if (autosign.sizes[i].sym[idx].left > 0) {
                autosign.sizes[i].sym[idx].left *= scaleW;
            }
            autosign.sizes[i].sym[idx].centerVert = autosign.sizes[0].sym[idx].centerVert;
            autosign.sizes[i].sym[idx].centerHor = autosign.sizes[0].sym[idx].centerHor;
        }

        for (var idx = 0; idx < Number(autosign.sizes[0].shapes.length); idx++) {
            autosign.sizes[i].shapes[idx].x = Number(autosign.sizes[0].shapes[idx].x);
            if (autosign.sizes[i].shapes[idx].x > 0) {
                autosign.sizes[i].shapes[idx].x *= scaleW;
            }
            autosign.sizes[i].shapes[idx].y = Number(autosign.sizes[0].shapes[idx].y);
            if (autosign.sizes[i].shapes[idx].y > 0) {
                autosign.sizes[i].shapes[idx].y *= scaleH;
            }
            autosign.sizes[i].shapes[idx].r = Number(autosign.sizes[0].shapes[idx].r);
            if (autosign.sizes[i].shapes[idx].r > 0) {
                autosign.sizes[i].shapes[idx].r *= generalScale;
            }
            autosign.sizes[i].shapes[idx].w = Number(autosign.sizes[0].shapes[idx].w);
            if (autosign.sizes[i].shapes[idx].w > 0) {
                autosign.sizes[i].shapes[idx].w *= scaleW;
            }
            autosign.sizes[i].shapes[idx].h = Number(autosign.sizes[0].shapes[idx].h);
            if (autosign.sizes[i].shapes[idx].h > 0) {
                autosign.sizes[i].shapes[idx].h *= scaleH;
            }
        }
    }
    return true;
}

var xmlhttp = new XMLHttpRequest();
xmlhttp.open("GET", urlRoot + "commonarrays", true);
xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        //alert(xmlhttp.responseText);
        optionLists = JSON.parse(xmlhttp.responseText);
        const domContainer = document.querySelector('#autosignapp');
        ReactDOM.render(React.createElement(AutoSignApp, {}), domContainer);
    }
};
xmlhttp.send(null);