import {Tooltip} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import {getEmbeddingKey} from './actions';
import {drawImage, getSpotRadius} from './ImageChart';
import {getVisualizer} from './ScatterChartThree';
import {getScaleFactor, POINT_VISUALIZER_ID, updateScatterChart} from './ThreeUtil';


class GalleryImage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {url: null, forceUpdate: false};
        this.canvasRef = React.createRef();
    }


    draw() {
        let start = new Date().getTime();
        const {scatterPlot, containerElement, traceInfo, markerOpacity, unselectedMarkerOpacity, selection, chartOptions, pointSize} = this.props;
        const embedding = traceInfo.embedding;
        const fullName = getEmbeddingKey(embedding);
        const chartSelection = selection != null && selection.chart != null ? selection.chart[fullName] : null;
        const userPoints = chartSelection ? chartSelection.userPoints : new Set();
        if (!traceInfo.isImage) {
            let spriteVisualizer = getVisualizer(scatterPlot, POINT_VISUALIZER_ID);
            spriteVisualizer.zoomFactor = this.zoomFactor;
            updateScatterChart(scatterPlot, traceInfo, userPoints, markerOpacity, unselectedMarkerOpacity, pointSize,
                {}, chartOptions);
            const canvas = containerElement.querySelector('canvas');
            this.setState({url: canvas.toDataURL()});
        } else {
            if (!traceInfo.tileSource.ready) {
                this.setState({url: null});
                traceInfo.tileSource.addOnceHandler('ready', () => {
                    this.setState((state, props) => {
                        return {forceUpdate: !state.forceUpdate};
                    });
                });
            } else {
                let canvas = document.createElement('canvas');
                canvas.width = this.props.chartSize * window.devicePixelRatio;
                canvas.height = this.props.chartSize * window.devicePixelRatio;
                canvas.style.width = this.props.chartSize * window.devicePixelRatio + ' px';
                canvas.style.height = this.props.chartSize * window.devicePixelRatio + ' px';

                drawImage(canvas.getContext('2d'), {
                    width: this.props.chartSize,
                    height: this.props.chartSize
                }, traceInfo, userPoints, markerOpacity, unselectedMarkerOpacity, false, getSpotRadius(traceInfo, pointSize));
                this.setState({url: canvas.toDataURL()});
                canvas = null;
            }
        }

        // canvas.toBlob(function (blob) {
        //     // let newImg = document.createElement('img');
        //     let url = URL.createObjectURL(blob);
        //     _this.setState({url: url});
        //     // newImg.onload = function () {
        //     //     // no longer need to read the blob so it's revoked
        //     //     URL.revokeObjectURL(url);
        //     // };
        //     //
        //     // newImg.src = url;
        //     // document.body.appendChild(newImg);
        // });

    }


    componentDidMount() {
        this.zoomFactor = getScaleFactor(this.props.primaryChartSize);
        this.draw();
    }


    componentDidUpdate(prevProps, prevState) {
        if (prevProps.primaryChartSize !== this.props.primaryChartSize) {
            this.zoomFactor = getScaleFactor(this.props.primaryChartSize);
        }
        this.draw();
    }


    onSelect = (event) => {
        event.preventDefault();
        this.props.onSelect(this.props.traceInfo);
    };

    render() {

        let name = this.props.traceInfo.name;
        if (name === '__count') {
            name = 'count';
        }
        return (
            <Box border={1} style={{display: 'inline-block', margin: 2}}>
                <div style={{position: 'relative'}}>
                    <Tooltip title={"Embedding: " + this.props.traceInfo.embedding.name}>
                        <Typography color="textPrimary" component={"h4"}
                                    onClick={this.onSelect}
                                    style={{
                                        marginTop: '3.2px',
                                        position: 'absolute',
                                        left: 4,
                                        zIndex: 1000
                                    }}>{name}</Typography>
                    </Tooltip>

                    {this.state.url && <img alt="" src={this.state.url}
                                            width={this.props.chartSize * window.devicePixelRatio}
                                            height={this.props.chartSize * window.devicePixelRatio}
                                            onClick={this.onSelect}
                                            style={{
                                                width: this.props.chartSize,
                                                height: this.props.chartSize
                                            }}/>}

                </div>
            </Box>
        );

    }
}

export default GalleryImage;

