import React from 'react';
import { connect } from 'react-redux';
import Slide from './slide';
import css from '../containers/App.css';
import { setQueueIndex } from '../core/presentation/actions';
import { filter, sortBy, find, some, size } from 'lodash';
import Rickshaw from 'rickshaw';
import { calculateStats } from '../utils/stats';

require('../vendor/rickshaw.css');

@connect(
  state => ({
    actionQueue: state.presentation.actionQueue,
    actionQueueIndex: state.presentation.actionQueueIndex,
    activeSlide: state.system.activeSlide,
  }),
  dispatch => ({
    setQueueIndex(index) {
      dispatch(setQueueIndex(index))
    }
  })
)
export default class Stats extends React.Component {

  static propTypes = {
    slides: React.PropTypes.array.isRequired,
    width: React.PropTypes.number.isRequired,
  }

  componentDidMount() {
    this.updateChart();
  }

  componentDidUpdate() {
    // this.updateChart();
  }

  render() {
    const { actionQueue } = this.props;
    const stats = calculateStats(actionQueue);

    
    return (
      <div className={css.stats}>
        <div ref="activityChart"></div>     
        
      </div>
    );
  }

  updateChart() {
    const { actionQueue, width } = this.props;
    const stats = calculateStats(actionQueue);

    const timeline = stats.activityTimeline;
    const first = timeline[0];
    const last = timeline[timeline.length - 1];
    const tick_size_in_seconds = (last.timestamp - first.timestamp) / 6;

    const activityData = timeline.map(item => ({
      x: item.timestamp,
      y: timeline[timeline.length-1].slides / 2
    }))

    const slidesCount = timeline.map(item => ({
      x: item.timestamp,
      y: item.slides
    }))

    const objectsCount = timeline.map(item => ({
      x: item.timestamp,
      y: item.objects
    }))

    const timelineGraph = new Rickshaw.Graph({
      element: this.refs.activityChart,
      renderer: 'multi',
      width: width,
      height: 100,
      dotSize: 2,
      series: [
        {
          name: 'activity',
          data: activityData,
          color: 'rgba(255, 0, 0, 0.2)',
          renderer: 'scatterplot'
        },{
          name: 'slides',
          data: slidesCount,
          color: 'rgba(82, 196, 255, 0.3)',
          renderer: 'area'
        // },{
        //   name: 'objects',
        //   data: objectsCount,
        //   color: 'rgba(182, 196, 255, 0.3)',
        //   renderer: 'area'
        }
      ]
    });
    timelineGraph.render();

    var detail = new Rickshaw.Graph.HoverDetail({
      graph: timelineGraph,
      xFormatter: function(x) {
        return new Date(x).toLocaleString();
      }
    });

    // var legend = new Rickshaw.Graph.Legend({
    //   graph: timeline,
    //   element: document.querySelector('#timeline_legend')
    // });

    var unit = {}
    unit.formatTime = function(d) {
      var str = new Date(d / 1000).toLocaleString('en-US', { weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric' });
      return str.replace(':00', '')
    };
    unit.formatter = function(d) { return this.formatTime(d) };
    unit.name = "meme";
    unit.seconds = tick_size_in_seconds;
    const xAxis = new Rickshaw.Graph.Axis.Time({
      graph: timelineGraph,
      ticksTreatment: 'glow',
      timeUnit: unit,
      timeFixture: new Rickshaw.Fixtures.Time.Local()
    });
    xAxis.render();


  }

  renderActivityChart(stats) {
    const { actionQueue, width } = this.props;

    

    return (
      <rd3.ScatterChart
        data={activityData}
        width={width}
        height={150}
        title="Timeline of Activity" />
    )


  }

}