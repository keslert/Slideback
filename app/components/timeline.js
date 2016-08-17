import React from 'react';
import css from '../containers/App.css';

export default class Timeline extends React.Component {

  static propTypes = {
    width: React.PropTypes.number,
    scale: React.PropTypes.number,
    spacing: React.PropTypes.number,
    events: React.PropTypes.array.isRequired,
    markerIndex: React.PropTypes.number,
    onClick: React.PropTypes.func,
  }

  static defaultProps = {
    width: 500,
    scale: 10,
    spacing: 1,
  }
  
  componentDidMount() {
    this.updateCanvas();
  }

  componentDidUpdate() {
    this.updateCanvas();
  }

  updateCanvas() {
    const { events, scale, spacing } = this.props;
    const { width, height, columns } = this.getCanvasSize();

    const ctx = this.refs.canvas.getContext('2d');
    ctx.fillStyle = 'transparent';
    ctx.fillRect(0, 0, width, height)

    events.forEach((event, i) => {
      const x = i % columns;
      const y = Math.floor(i / columns) * spacing + 1;

      ctx.fillStyle = event || '#fff';
      ctx.fillRect(x * scale, y * scale, scale, scale / 2);
    })
  }

  renderMarker() {
    const { markerIndex, scale, spacing } = this.props;
    const { columns } = this.getCanvasSize();

    const x = markerIndex % columns;
    const y = Math.floor(markerIndex / columns) * spacing;
    const marker = {
      top: y * scale + (scale / 2),
      left: x * scale,
      borderWidth: scale / 2,
    }

    return <div className={css.marker} style={marker}></div>
  }
  
  render() {
    const { width, height, columns } = this.getCanvasSize();

    return (
      <div className={css.timeline}>
        {this.renderMarker()}
        <canvas ref="canvas" width={width} height={height} onClick={(e) => this.onClick(e)} />
      </div>
    );
  }
  
  onClick(e) {
    const { scale, spacing, onClick } = this.props;
    const { columns } = this.getCanvasSize();

    const bb = e.target.getBoundingClientRect();
    const x = e.clientX - bb.left;
    const y = e.clientY - bb.top;

    const column = Math.floor(x / scale);
    const row = Math.floor((y - scale) / (scale * spacing));

    const i = row * columns + column;
    
    onClick && onClick(i);
  }

  getCanvasSize() {
    const { width, scale, events, spacing } = this.props;
    const _width = Math.floor(width / scale);
    const height = Math.ceil(events.length / _width) * spacing + 1;

    return { width: _width * scale, height: height * scale, columns: _width }
  }
}