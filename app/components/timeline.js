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
    spacing: 1.5,
  }

  constructor(props) {
    super(props);
    this.state = {
      hover: null
    }
  }
  
  componentDidMount() {
    this.updateCanvas();
  }

  componentDidUpdate(prevProps) {
    if(true || prevProps.events.length != this.props.events.length || 
       prevProps.width != this.props.width) {
      this.updateCanvas();
    }
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
      // const height = scale / (event.highlight ? 1 : 2);
      const height = scale / 2;

      ctx.fillStyle = event.color || '#fff';
      ctx.fillRect(x * scale, y * scale, scale, height);
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

  renderHover() {
    const { hover } = this.state;
    if(hover != null) {
      const { scale, spacing } = this.props;
      const { columns } = this.getCanvasSize();

      const x = hover % columns;
      const y = Math.floor(hover / columns) * spacing;
      const style = {
        top: y * scale + (scale / 2),
        left: x * scale,
        borderWidth: scale / 2,
        borderTopColor: '#ec634d',
      }

      return <div className={css.marker} style={style}></div>

    }
  }
  
  render() {
    const { width, height, columns } = this.getCanvasSize();

    return (
      <div className={css.timeline}>
        {this.renderMarker()}
        <canvas 
          ref="canvas" 
          width={width} 
          height={height} 
          onClick={(e) => this.onClick(e)}
          onMouseLeave={() => this.setState({hover: null})}
          onMouseMove={(e) => this.onHover(e)} 
        />
        {this.renderHover()}
      </div>
    );
  }

  onHover(e) {
    const { events } = this.props;
    const bb = e.target.getBoundingClientRect();
    const x = e.clientX - bb.left;
    const y = e.clientY - bb.top;

    const i = this.calculateIndexFromPosition(x, y);
    if(i >= 0 && i < events.length) {
      this.setState({hover: i});
    } else {
      this.setState({hover: null});
    }
  }
  
  onClick(e) {
    const { onClick, events } = this.props;

    const bb = e.target.getBoundingClientRect();
    const x = e.clientX - bb.left;
    const y = e.clientY - bb.top;

    const i = this.calculateIndexFromPosition(x, y);
    
    if(onClick && i >= 0 && i < events.length) {
      onClick(i);
    }
  }

  calculateIndexFromPosition(x, y) {
    const { scale, spacing } = this.props;
    const { width, height, columns } = this.getCanvasSize();

    const column = Math.floor(x / scale);
    const row = Math.floor((y - scale) / (scale * spacing));
    return row * columns + column;
  }

  getCanvasSize() {
    const { width, scale, events, spacing } = this.props;
    const _width = Math.floor(width / scale);
    const height = Math.ceil(events.length / _width) * spacing + 1;

    return { width: _width * scale, height: height * scale, columns: _width }
  }
}