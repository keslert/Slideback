export const ACTION_CONSTANTS = {
  NO_OP: 'NO_OP',
  DELETE_OBJECTS: 'DELETE_OBJECTS',
  CREATE_GROUP: 'CREATE_GROUP',
  DELETE_GROUP: 'DELETE_GROUP',
  RESIZE_PAGE: 'RESIZE_PAGE',
  CREATE_OBJECT: 'CREATE_OBJECT',
  STYLE_OBJECTS: 'STYLE_OBJECTS',
  ORDER_OBJECTS: 'ORDER_OBJECTS',
  TRANSFORM_OBJECT: 'TRANSFORM_OBJECT',
  SLIDE_STYLE: 'SLIDE_STYLE',
  CREATE_SLIDE: 'CREATE_SLIDE',
  DELETE_SLIDE: 'DELETE_SLIDE',
  REARRANGE_SLIDE: 'REARRANGE_SLIDE',
  APPEND_TEXT: 'APPEND_TEXT',
  DELETE_TEXT: 'DELETE_TEXT',
  STYLE_TEXT: 'STYLE_TEXT',
  CREATE_LIST_ENTITY: 'CREATE_LIST_ENTITY',
  STYLE_LIST_ENTITY: 'STYLE_LIST_ENTITY',
  CHANGE_SLIDE_PROPERTIES: 'CHANGE_SLIDE_PROPERTIES',
}
const C = ACTION_CONSTANTS;

export default function(raw) {
  const actions = _.map(raw.changelog, json => ({
    commands: parse(json[0]),
    timestamp: json[3],
  }));

  return actions;
}

function parse(json) {

  switch(json[0]) {
    case 0:
      return deleteObject(json);
    case 1:
      return resizePage(json);
    case 2:
      return createGroup(json);
    case 3:
      return createObject(json);
    case 4:
      return json[1].map(parse);
    case 5:
      return styleObject(json);
    case 6:
      return transformObject(json);
    case 7:
      return deleteGroup(json);
    case 8:
      return orderObjects(json);
    case 9:
      return backgroundStyle(json);
    case 12:
      return createSlide(json);
    case 13:
      return deleteSlide(json);
    case 14:
      return rearrangeSlide(json);
    case 15:
      return appendText(json);
    case 16:
      return deleteText(json);
    case 17:
      return styleText(json);
    case 18:
      return changeSlideProperties(json);
    case 41:
      return createListEntity(json);
    case 42:
      return styleListEntity(json);
    case 45:
      return { action: C.NO_OP, type: 'Set Language' };
    default:
      console.log(`Unrecognized action ${json[0]}`);
      return;
  }
}



/*****************************************************************************
*  0 | Delete Object
******************************************************************************
[
  0,
  ["g1601f7737c_0_17","g15fee194f8_2_13"] // Delete Object
]
*/
function deleteObject(json) {
  return {
    action: C.DELETE_OBJECTS,
    object_ids: json[1]
  }
}


/*****************************************************************************
*  1 | Page Size
******************************************************************************
[
  1,
  [365760,228600],
  null
]
*/
function resizePage(json) {
  return {
    action: C.RESIZE_PAGE,
    width: json[1][0],
    height: json[1][1]
  }
}


/*****************************************************************************
*  2 | CREATE GROUP
******************************************************************************
[
    2,
    "g16236f9108_0_168",                        // Group ID
    ["g16236f9108_0_163","g16236f9108_0_164"],  // Object IDs
    [1,0,0,1.1111,-11015,8897],                 // BB
    "g16236f9108_0_162"                         // Slide ID
]
*/
function createGroup(json) {
  return {
    action: C.CREATE_GROUP,
    group_id: json[1],
    object_ids: json[2],
    bb: json[3],
    slide_id: json[4]
  }
}

/*****************************************************************************
*  3 | Create Object
******************************************************************************
[
  3,                                // Create Object
  "g15fee194f8_2_2",                // Object ID
  108,                              // Object Type
  [2.8402,0,0,0.1909,12468,17801],  // BB
  [
    54,15,                          // Something to do with templates (title)
    55,0
  ],
  "g15fee194f8_2_1"                 // Slide ID
],
*/
function createObject(json) {
  return {
    action: C.CREATE_OBJECT,
    id: json[1],
    type: _rawToObjectType[json[2]],
    bb: json[3],
    styles: _parseStyles(json[4]),
    slide_id: json[5]
  }
}

export const OBJECT_TYPES = {
  WORD_ART: 'WORD_ART',
  IMAGE: 'IMAGE',
  SCRIBBLE: 'SCRIBBLE',
  RECTANGLE: 'RECTANGLE',
  ROUNDED_RECTANGLE: 'ROUNDED_RECTANGLE',
  ROUND_SINGLE_CORNER_RECTANGLE: 'ROUND_SINGLE_CORNER_RECTANGLE',
  RIGHT_TRIANGLE: 'RIGHT_TRIANGLE',
  TEXT_BOX: 'TEXT_BOX',
  LINE: 'LINE',
  VIDEO: 'VIDEO',
}

const _rawToObjectType = {
  '2': OBJECT_TYPES.WORD_ART,
  '3': OBJECT_TYPES.IMAGE,
  '4': OBJECT_TYPES.SCRIBBLE,
  '6': OBJECT_TYPES.RECTANGEL,
  '7': OBJECT_TYPES.ROUNDED_RECTANGLE,
  '76': OBJECT_TYPES.ROUND_SINGLE_CORNER_RECTANGLE,
  '79': OBJECT_TYPES.RIGHT_TRIANGLE,
  '108': OBJECT_TYPES.TEXT_BOX,
  '153': OBJECT_TYPES.LINE,
  '154': '?',
  '157': OBJECT_TYPES.VIDEO
}


/*****************************************************************************
*  5 | Style Object
******************************************************************************

[
  5,
  ["g1601f7737c_1_1"],              // Object ID
  [],                               // ?
  [
    14,1,                           // Fill
    15,"#F9CB9C",                   // Fill Color
    16,1,                           // Fill Opacity
    60,0                            //
  ]
]

[
  5,
  ["g1601f7737c_1_1"],
  [],
  [
    18,1,
    19,"#FF0000"
  ]
]
*/
function styleObject(json) {

  return {
    action: C.STYLE_OBJECTS,
    object_ids: json[1],
    styles: _parseStyles(json[3]),
  }
}

function _parseStyles(json) {
  let styles = {};
  for(let i = 0; i < json.length; i+= 2) {
    styles[_rawToObjectStyles[json[i]]] = json[i + 1]
  }
  return styles;
}


export const OBJECT_STYLES = {
  HANDLE_1: 'HANDLE_1',
  HANDLE_2: 'HANDLE_2',
  WIDTH: 'WIDTH',
  HEIGHT: 'HEIGHT',
  FILL: 'FILL',
  FILL_COLOR: 'FILL_COLOR',
  FILL_OPACITY: 'FILL_OPACITY',
  LINE: 'LINE',
  LINE_COLOR: 'LINE_COLOR',
  LINE_WIDTH: 'LINE_WIDTH',
  LINE_START_ENDPOINT: 'LINE_START_ENDPOINT',
  LINE_END_ENDPOINT: 'LINE_END_ENDPOINT',
  TEXT: 'TEXT',
  IMAGE_URL: 'IMAGE_URL',
  LINE_DASH: 'LINE_DASH',
  VERTICAL_ALIGNMENT: 'VERTICAL_ALIGNMENT',
  DESCRIPTION: 'DESCRIPTION',
  INHERITED_STYLES: 'INHERITED_STYLES',
  LINK: 'LINK',
  LINE_TYPE: 'LINE_TYPE',
  CHARTS_1: 'CHARTS_1',
  CHARTS_2: 'CHARTS_2',
  CHARTS_3: 'CHARTS_3',
  CHARTS_4: 'CHARTS_4',
}

const _rawToObjectStyles = {
  '0': OBJECT_STYLES.HANDLE_1,
  '1': OBJECT_STYLES.HANDLE_2,
  '8': OBJECT_STYLES.WIDTH,
  '9': OBJECT_STYLES.HEIGHT,

  '14': OBJECT_STYLES.FILL,
  '15': OBJECT_STYLES.FILL_COLOR,
  '16': OBJECT_STYLES.FILL_OPACITY,

  '18': OBJECT_STYLES.LINE,
  '19': OBJECT_STYLES.LINE_COLOR,
  '22': OBJECT_STYLES.LINE_WIDTH,
  '26': OBJECT_STYLES.LINE_START_ENDPOINT,
  '29': OBJECT_STYLES.LINE_END_ENDPOINT,
  '33': OBJECT_STYLES.TEXT,
  '39': OBJECT_STYLES.IMAGE_URL,
  '43': OBJECT_STYLES.LINE_DASH,
  '44': OBJECT_STYLES.VERTICAL_ALIGNMENT, 
  '49': OBJECT_STYLES.DESCRIPTION,
  '54': OBJECT_STYLES.INHERITED_STYLES,

  '72': OBJECT_STYLES.LINK,
  '135': OBJECT_STYLES.LINE_TYPE,

  '147': OBJECT_STYLES.CHARTS_1CHARTS_1,
  '148': OBJECT_STYLES.CHARTS_2CHARTS_2,
  '149': OBJECT_STYLES.CHARTS_3CHARTS_3,
  '150': OBJECT_STYLES.CHARTS_4CHARTS_4,
}

/*****************************************************************************
*  6 | Position Object
******************************************************************************
[
  6,                  // Position Object
  "g15fee194f8_2_0",  // Object ID
  [
    1.3268,           // a
    0,                // b
    0,                // c
    0.2642,           // d
    103263,           // e
    146611            // f
  ]
]
*/
function transformObject(json) {
  return {
    action: C.TRANSFORM_OBJECT,
    object_id: json[1],
    bb: json[2]
  }
}

/*****************************************************************************
*  7 | DELETE GROUP
******************************************************************************
[
  7,
  "g16236f9108_0_168"       // Group ID
]
*/
function deleteGroup(json) {
  return {
    action: C.DELETE_GROUP,
    group_id: json[1]
  }
}

/*****************************************************************************
*  8 | Object Order
******************************************************************************
[
  8,
  ["g1601f7737c_1_3"],      // Object ID
  1,                        // Direction
  "g1601f7737c_0_63"        // Slide ID
]

0 = Front
1 = Back
2 = Forward
3 = Backward
*/

function orderObjects(json) {
  return {
    action: C.ORDER_OBJECTS,
    object_ids: json[1],
    direction: _directions[json[2]],
    slide_id: json[3]
  }
}

const _directions = {
  '0': 'FRONT',
  '1': 'BACK',
  '2': 'FORWARD',
  '3': 'BACKWARD'
}

/*****************************************************************************
*  9 | Slide Style
******************************************************************************

[
  9,                        // Background Style
  [],
  [14,1,15,"#FF0000",16,1], // Solid Color
  "p"                       // Slide ID
]
*/

function backgroundStyle(json) {
  return {
    action: C.SLIDE_STYLE,
    styles: _parseStyles(json[2]),
    slide_id: json[3]
  }
}


/*****************************************************************************
* 12 | Create Slide
******************************************************************************
[
  12,
  "simple-light-2",           // Slide ID
  0,                          // Slide Index
  2,                          // ?
  [
    0,                        // 0 = New Theme, 1 = Copy Theme?
    [
      "Simple Light",         // Theme Name
      [
        "#000000",            // Primary Text?
        "#FFFFFF",            // Background?
        "#595959",
        "#EEEEEE",
        "#FFAB40",
        "#212121",
        "#78909C",
        "#FFAB40",
        "#0097A7",
        "#EEFF41",
        "#0097A7",
        "#0097A7"
      ]
    ],
    4, "simple-light-2"       // Theme ID
  ]
],

[
  12,
  "g16029c0e46_0_6",          // Slide ID
  2,                          // Index
  0,                          // Type
  [
    1, "simple-light-2",      // Theme
    2, "TITLE_AND_BODY"       // Layout
  ]
],
*/
function createSlide(json) {
  return {
    action: C.CREATE_SLIDE,
    id: json[1],
    index: json[2],
    type: _rawToSlideType[json[3]],
    props: _slideProperties(json[4]),
  }
}

export const SLIDE_TYPES = {
  NORMAL: 'NORMAL',
  TEMPLATE: 'TEMPLATE',
  MASTER: 'MASTER'
}

const _rawToSlideType = {
  0: SLIDE_TYPES.NORMAL,
  1: SLIDE_TYPES.TEMPLATE,
  2: SLIDE_TYPES.MASTER
}

/*****************************************************************************
* 13 | Delete Slide
******************************************************************************
[
  13,
  1,                        // Slide Index
  0,
  null,
  "g15fee194f8_2_9"         // Slide ID
]
*/
function deleteSlide(json) {
  return {
    action: C.DELETE_SLIDE,
    index: json[1],
    slide_id: json[4]
  }
}


/*****************************************************************************
* 14 | Rearrange Slide
******************************************************************************
[
  14,           // Move Slide
  1,            // Index
  2,            // New Index
  0             // ?
]
*/
function rearrangeSlide(json) {
  return {
    action: C.REARRANGE_SLIDE,
    start_index: json[1],
    end_index: json[2]
  }
}


/*****************************************************************************
* 15 | Insert Text
******************************************************************************
[
  15,
  "i0",         // Slide ID
  null,         // ?
  1,            // Index
  "o"           // String
]
*/
function appendText(json) {
  return {
    action: C.APPEND_TEXT,
    object_id: json[1],
    index: json[3],
    text: json[4]
  }
}

/*****************************************************************************
* 16 | Delete Text
******************************************************************************
[
  16,
  "i0",         // Slide ID
  null,         // ?
  0,            // Start Index
  2             // End Index
]
*/
function deleteText(json) {
  return {
    action: C.DELETE_TEXT,
    object_id: json[1],
    start_index: json[3],
    end_index: json[4]
  }
}

/*****************************************************************************
* 17 | Text Style
******************************************************************************
[
  17,           // Text Style
  "i0",         // Object ID
  null,         // ?
  0,            // Start Index
  1,            // End Index (if it's the end it includes an additional character)
  [],           // ?
  [
    5,          // Style Type
    "Lato"      // Style Value
  ]
]
*/
function styleText(json) {
  return {
    action: C.STYLE_TEXT,
    object_id: json[1],
    start_index: json[3],
    end_index: json[4],
    style: _parseTextStyles(json[6])
  }
}

function _parseTextStyles(json) {
  let styles = [];
  for(let i = 0; i < json.length; i += 2) {
    styles.push({
      type: _rawToTextStyles[json[i]],
      value: json[i + 1]
    })
  }
  return styles;
}

export const TEXT_STYLES = {
  BOLD: 'BOLD',
  ITALICS: 'ITALICS',
  UNDERLINE: 'UNDERLINE',
  TEXT_HIGHLIGHT: 'TEXT_HIGHLIGHT',
  TEXT_COLOR: 'TEXT_COLOR',
  FONT: 'FONT',
  FONT_SIZE: 'FONT_SIZE',
  LINE_HEIGHT: 'LINE_HEIGHT',
  TEXT_ALIGNMENT: 'TEXT_ALIGNMENT',
}

const _rawToTextStyles = {
  0: TEXT_STYLES.BOLD,
  1: TEXT_STYLES.ITALICS,
  2: TEXT_STYLES.UNDERLINE,
  3: TEXT_STYLES.TEXT_HIGHLIGHT,
  4: TEXT_STYLES.TEXT_COLOR,
  5: TEXT_STYLES.FONT,
  6: TEXT_STYLES.FONT_SIZE,
  11: TEXT_STYLES.LINE_HEIGHT,
  12: TEXT_STYLES.TEXT_ALIGNMENT,
  27: TEXT_STYLES.LIST_ENTITY_TYPE
}



/*****************************************************************************
* 18 | Set Slide Properties
******************************************************************************
[
  18,
  ["g1601f7737c_0_53"],     // Slide ID(s)
  [],                       // ?
  [
    2,                      //
    "TITLE_AND_BODY"        // Template Name
  ]
]
*/
function changeSlideProperties(json) {
  return {
    action: C.CHANGE_SLIDE_PROPERTIES,
    slide_ids: json[1],
    props: _slideProperties(json[3])
  }
}

function _slideProperties(json) {
  let props = {};
  for(let i = 0; i < json.length; i += 2) {
    props[_rawToSlideProperties[json[i]]] = json[i + 1]; 
  }
  return props;
}

export const SLIDE_PROPERTIES = {
  CREATE_THEME: 'CREATE_THEME',
  THEME: 'THEME',
  LAYOUT: 'LAYOUT',
  THEME_NAME: 'THEME_NAME',
}

const _rawToSlideProperties = {
  0: SLIDE_PROPERTIES.CREATE_THEME,
  1: SLIDE_PROPERTIES.THEME,
  2: SLIDE_PROPERTIES.LAYOUT,
  4: SLIDE_PROPERTIES.THEME_NAME,
}

/*****************************************************************************
* 41 | Create List Entity
******************************************************************************
[
  41,
  "g160b2d4641_0_2",        // Object ID
  null,                     // ?
  "kix.fzqkf2qa0qr2",       // List Entity ID
  []
],
*/
function createListEntity(json) {
  return {
    action: C.CREATE_LIST_ENTITY,
    object_id: json[1],
    id: json[3]
  }
}

/*****************************************************************************
* 42 | Style List Entity
******************************************************************************
[
  42,
  "g16029c0e46_0_8",        // Object ID
  null,                     // ?
  "kix.fzqkf2qa0qr2",       // List Entity ID
  0,                        // Inset Index
  [17,36],                  //
  [37,"✓"]                  // Styles
],

[
  42,
  "n:text",
  null,
  "bodyPlaceholderListEntity",
  0,
  [13,17,19,21,22,23,24,25,26,28,29,31,32,33,36,37],
  []
]

[
  42,
  "g16029c0e46_0_3",
  null,
  "kix.q27egt9b4u1h",
  0,
  [13,28],
  [17,10,36,"%0."]
],
*/
function styleListEntity(json) {
  return {
    action: C.STYLE_LIST_ENTITY,
    object_id: json[1],
    list_entity_id: json[3],
    inset_index: json[4],
    properties: json[5],
    styles: json[6]
  }
}
