import React from 'react';
import css from '../containers/App.css';
import { ACTION_CONSTANTS } from'../utils/parser'; 

export default class Timeline extends React.Component {

  static propTypes = {
    commands: React.PropTypes.array.isRequired,
    width: React.PropTypes.number,
    scale: React.PropTypes.number
  }

  static defaultProps = {
    width: 500,
    scale: 8
  }
  
  componentDidMount() {
    this.updateCanvas();
  }

  componentDidUpdate() {
    this.updateCanvas();
  }

  updateCanvas() {
    const { commands, scale } = this.props;
    const { width, height } = this.getCanvasSize();

    const ctx = this.refs.canvas.getContext('2d');
    ctx.fillStyle = 'transparent';
    ctx.fillRect(0, 0, width, height)

    const columns = width / scale;
    commands.forEach((command, i) => {
      const x = i % columns;
      const y = Math.floor(i / columns) * 2 + 1;

      ctx.fillStyle = colorMap[command.commands.action] || '#fff';
      ctx.fillRect(x * scale, y * scale, scale, scale);
    })
  }
  
  render() {
    const { commands, index, scale } = this.props;
    const { width, height } = this.getCanvasSize();

    const columns = width / scale;
    const x = (index - 1) % columns;
    const y = Math.floor((index - 1) / columns) * 2;
    const marker = {
      top: y * scale + scale / 2 - 1,
      left: x * scale,
      borderWidth: scale / 2,
    }

    return (
      <div className={css.timeline}>
        <div className={css.marker} style={marker}></div>
        <canvas ref="canvas" width={width} height={height}/>
      </div>
    );
  }

  getCanvasSize() {
    const { width, scale, commands } = this.props;
    const _width = Math.floor(width / scale);
    const height = Math.ceil(commands.length / _width) * 2;

    return { width: _width * scale, height: height * scale }
  }
}

const colorMap = {
  [ACTION_CONSTANTS.NO_OP]: '#000',
  [ACTION_CONSTANTS.BATCH_COMMANDS]: '#F8B5D2',
  [ACTION_CONSTANTS.DELETE_OBJECTS]: '#E574C3',
  [ACTION_CONSTANTS.CREATE_GROUP]: '#BCBF00',
  [ACTION_CONSTANTS.DELETE_GROUP]: '#BCBF00',
  [ACTION_CONSTANTS.RESIZE_PAGE]: '#C7C7C7',
  [ACTION_CONSTANTS.CREATE_OBJECT]: '#C59C93',
  [ACTION_CONSTANTS.STYLE_OBJECTS]: '#8D5649',
  [ACTION_CONSTANTS.ORDER_OBJECTS]: '#C5AFD6',
  [ACTION_CONSTANTS.TRANSFORM_OBJECT]: '#9564BF',
  [ACTION_CONSTANTS.SLIDE_STYLE]: '#1776B6',
  [ACTION_CONSTANTS.CREATE_SLIDE]: '#ADC6E9',
  [ACTION_CONSTANTS.DELETE_SLIDE]: '#FF7F00',
  [ACTION_CONSTANTS.REARRANGE_SLIDE]: '#FFBC72',
  [ACTION_CONSTANTS.APPEND_TEXT]: '#96E086',
  [ACTION_CONSTANTS.DELETE_TEXT]: '#D8241F',
  [ACTION_CONSTANTS.STYLE_TEXT]: '#FF9794',
  [ACTION_CONSTANTS.CREATE_LIST_ENTITY]: '#9CDAE6',
  [ACTION_CONSTANTS.STYLE_LIST_ENTITY]: '#9CDAE6',
  [ACTION_CONSTANTS.CHANGE_SLIDE_PROPERTIES]: '#7F7F7F',
}