import React from 'react';
import { connect } from 'react-redux';
import Slide from './slide';
import css from '../containers/App.css';
import { setQueueIndex } from '../core/presentation/actions';
import { map, filter, sortBy, find, some, size, flatMap } from 'lodash';
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
    this.updateActivityChart();
    this.updateSlideChart();
  }

  componentDidUpdate() {
    // this.updateActivityChart();
  }

  render() {
    const { actionQueue } = this.props;
    const stats = calculateStats(actionQueue);

    
    return (
      <div className={css.stats}>
        <div className="rickshaw_chart_wrapper">
          <div ref="activityChart"></div>
          <div ref="activityLegend"></div>
          <div ref="activityPreview"></div>  
        </div>

        <div className="rickshaw_chart_wrapper">
          <div ref="slideChart"></div>
          <div ref="slideLegend" style={{right: 0, left: 'inherit'}}></div>
          <div ref="slidePreview"></div>  
        </div>
      </div>
    );
  }

  updateSlideChart() {
    const { actionQueue, width } = this.props;
    const stats = calculateStats(actionQueue);

    const timeline = stats.slideTimeline;
    

    const combined = sortBy(filter(
      flatMap(timeline, (t, i) => map(t.events, e => ({...e, slide: i}))), 
    ), 'timestamp');

    const first = combined[0];
    const last = combined[combined.length - 1];
    const tick_size_in_seconds = (last.timestamp - first.timestamp) / 6;

    const numSlides = size(timeline)
    const spacing = 30;
    const height = numSlides * spacing;

    const calcY = (index, offset) => height - (index + 0.5) * spacing + offset

    const series = [
      {
        name: 'Slide Created',
        data: map(filter(combined, c => c.type == 'slide_created'), c => ({x: c.timestamp, y: calcY(c.slide, 0)})),
        color: '#000',
        opacity: 0.2
      },{
        name: 'Slide Deleted',
        data: map(filter(combined, c => c.type == 'slide_deleted'), c => ({x: c.timestamp, y: calcY(c.slide, 2)})),
        color: '#E574C3',
        opacity: 0.2
      },{
        name: 'Object Created',
        data: map(filter(combined, c => c.type == 'object_created'), c => ({x: c.timestamp, y: calcY(c.slide, 4)})),
        color: '#1776B6',
        opacity: 0.2
      },{
        name: 'Object Deleted',
        data: map(filter(combined, c => c.type == 'object_deleted'), c => ({x: c.timestamp, y: calcY(c.slide, 6)})),
        color: '#9564BF',
        opacity: 0.2
      },{
        name: 'Text Added',
        data: map(filter(combined, c => c.type == 'text_added'), c => ({x: c.timestamp, y: calcY(c.slide, 8)})),
        color: '#96E086',
        opacity: 0.2
      },{
        name: 'Text Deleted',
        data: map(filter(combined, c => c.type == 'text_deleted'), c => ({x: c.timestamp, y: calcY(c.slide, 10)})),
        color: '#D8241F',
        opacity: 0.2
      }
    ];    
    
    const graph = new Rickshaw.Graph({
      element: this.refs.slideChart,
      renderer: 'scatterplot',
      width: width,
      height: height,
      dotSize: 1.5,
      stack: false,
      series: series,
    });
    graph.render();

    new Rickshaw.Graph.HoverDetail({
      graph: graph,
      // xFormatter: function(x) { return new Date(x).toLocaleString(); },
      // yFormatter: function(y) { return Math.floor(y) }
      formatter: function(series, x, y) {
        var date = '<span class="date">' + new Date(x).toLocaleString() + '</span>';
        var content = `Slide ${parseInt(y / spacing)}: ${series.name}<br>${date}`;
        return content;
      }
    });    

    const legend = new Rickshaw.Graph.Legend({
      graph: graph,
      element: this.refs.slideLegend
    });

    // new Rickshaw.Graph.RangeSlider.Preview({
    //   graph: graph,
    //   element: this.refs.slidePreview
    // });

    const yAxis = new Rickshaw.Graph.Axis.Y({
      graph: graph,
      tickValues: map(new Array(numSlides), (a,i) => i * spacing),
      ticksTreatment: 'glow',
      
      tickFormat: (y) => {
        return `Slide ${parseInt((height - y) / spacing)}`
      }
    })
    yAxis.render();

    // new Rickshaw.Graph.Behavior.Series.Highlight({
    //     graph: graph,
    //     legend: legend,
    //     disabledColor: function() { return 'rgba(0, 0, 0, 0.1)' }
    // });

    // const unit = {}
    // unit.formatTime = function(d) {
    //   const str = new Date(d / 1000).toLocaleString('en-US', { weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric' });
    //   return str.replace(':00', '')
    // };
    // unit.formatter = function(d) { return this.formatTime(d) };
    // unit.name = "meme";
    // unit.seconds = tick_size_in_seconds;
    // const xAxis = new Rickshaw.Graph.Axis.Time({
    //   graph: graph,
    //   ticksTreatment: 'glow',
    //   timeUnit: unit,
    //   timeFixture: new Rickshaw.Fixtures.Time.Local()
    // });
    // xAxis.render();
  }

  updateActivityChart() {
    const { actionQueue, width } = this.props;
    const stats = calculateStats(actionQueue);

    const timeline = stats.activityTimeline;
    const first = timeline[0];
    const last = timeline[timeline.length - 1];
    const tick_size_in_seconds = (last.timestamp - first.timestamp) / 6;

    const activityData = timeline.map(item => ({
      x: item.timestamp,
      y: timeline[timeline.length-1].objects / 2
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
      height: 200,
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
        },{
          name: 'objects',
          data: objectsCount,
          color: 'rgba(182, 196, 255, 0.3)',
          renderer: 'area'
        }
      ]
    });
    timelineGraph.render();

    new Rickshaw.Graph.HoverDetail({
      graph: timelineGraph,
      // xFormatter: function(x) { return new Date(x).toLocaleString(); },
      // yFormatter: function(y) { return Math.floor(y) }
      formatter: function(series, x, y) {
        var date = '<span class="date">' + new Date(x).toLocaleString() + '</span>';
        var swatch = '<span class="detail_swatch" style="background-color: ' + series.color + '"></span>';
        var content = swatch + series.name + ": " + parseInt(y) + '<br>' + date;
        return content;
      }
    });

    

    const legend = new Rickshaw.Graph.Legend({
      graph: timelineGraph,
      element: this.refs.activityLegend
    });

    new Rickshaw.Graph.RangeSlider.Preview({
      graph: timelineGraph,
      element: this.refs.activityPreview
    });

    new Rickshaw.Graph.Behavior.Series.Highlight({
        graph: timelineGraph,
        legend: legend,
        disabledColor: function() { return 'rgba(0, 0, 0, 0.1)' }
    });
    
    // new Rickshaw.Graph.Behavior.Series.Toggle({
    //     graph: timelineGraph,
    //     legend: legend
    // });


    const unit = {}
    unit.formatTime = function(d) {
      const str = new Date(d / 1000).toLocaleString('en-US', { weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric' });
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
}